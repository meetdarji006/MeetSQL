import { eq, and } from "drizzle-orm";
import { db } from "../../config/postgres";
import { users, submissions } from "../../db/schema";
import { getProblemFull } from "../problems/problems.service";
import { checkSqlSafety } from "../sandbox/sandbox.guard";
import * as sandbox from "../sandbox/sandbox.service";
import { updateStatsAfterSolve } from "../leaderboard/leaderboard.service";
import { validateSelectDiff } from "./validators/select-diff";
import { validateDmlDiff } from "./validators/dml-diff";
import { validateDdlDiff } from "./validators/ddl-diff";

interface JudgeResult {
  verdict: "pass" | "fail" | "error" | "timeout";
  message: string;
  executionTimeMs: number;
  resultSummary?: any;
}

/**
 * Judge a student's SQL submission.
 *
 * Flow:
 * 1. Blacklist check
 * 2. Fetch problem + user Oracle credentials
 * 3. Prepare environment (drop/recreate tables)
 * 4. Execute student SQL
 * 5. Validate based on problem.validationType
 * 6. Return verdict
 */
export async function judgeSubmission(
  userId: number,
  problemId: number,
  studentSql: string,
  saveSubmission: boolean = true
): Promise<JudgeResult> {
  // 1. SQL Safety Check
  const safety = checkSqlSafety(studentSql);
  if (!safety.allowed) {
    const result: JudgeResult = {
      verdict: "error",
      message: `Blocked: ${safety.reason}`,
      executionTimeMs: 0,
    };

    if (saveSubmission) {
      await saveSubmissionRecord(userId, problemId, studentSql, result);
    }
    return result;
  }

  // 2. Fetch problem and user
  const problem = await getProblemFull(problemId);
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || !user.oracleSchema || !user.oraclePassword) {
    throw Object.assign(
      new Error("Oracle schema not provisioned. Please contact support."),
      { statusCode: 400 }
    );
  }

  let result: JudgeResult;

  try {
    // 3. Prepare environment
    await sandbox.prepareEnvironment(
      user.oracleSchema,
      user.oraclePassword,
      problem.setupScript
    );

    // 4 & 5. Execute and validate based on type
    switch (problem.validationType) {
      case "select_diff":
        result = await judgeSelectDiff(
          user.oracleSchema,
          user.oraclePassword,
          studentSql,
          problem.solutionQuery,
          problem.orderSensitive ?? false
        );
        break;

      case "dml_diff":
        result = await judgeDmlDiff(
          user.oracleSchema,
          user.oraclePassword,
          studentSql,
          problem.solutionQuery,
          problem.setupScript
        );
        break;

      case "ddl_diff":
        result = await judgeDdlDiff(
          user.oracleSchema,
          user.oraclePassword,
          studentSql,
          problem.expectedOutput as any
        );
        break;

      default:
        result = {
          verdict: "error",
          message: `Unknown validation type: ${problem.validationType}`,
          executionTimeMs: 0,
        };
    }
  } catch (err: any) {
    // Handle Oracle errors
    if (err.message?.includes("timeout") || err.errorNum === 1013) {
      result = {
        verdict: "timeout",
        message: "Query execution timed out",
        executionTimeMs: 0,
      };
    } else {
      result = {
        verdict: "error",
        message: err.message || "Execution error",
        executionTimeMs: 0,
      };
    }
  }

  // 6. Save submission
  if (saveSubmission) {
    await saveSubmissionRecord(userId, problemId, studentSql, result);
  }

  return result;
}

// ─── SELECT Diff Judging ──────────────────────────────────────────
async function judgeSelectDiff(
  oracleSchema: string,
  oraclePassword: string,
  studentSql: string,
  solutionQuery: string,
  orderSensitive: boolean
): Promise<JudgeResult> {
  // Execute solution query to get expected output
  const expected = await sandbox.executeStudentQuery(
    oracleSchema,
    oraclePassword,
    solutionQuery
  );

  // Execute student query
  const student = await sandbox.executeStudentQuery(
    oracleSchema,
    oraclePassword,
    studentSql
  );

  // Compare
  const diff = validateSelectDiff(
    student.rows,
    expected.rows,
    student.metaData,
    expected.metaData,
    orderSensitive
  );

  return {
    verdict: diff.pass ? "pass" : "fail",
    message: diff.message,
    executionTimeMs: student.executionTimeMs,
    resultSummary: {
      expectedRowCount: expected.rows.length,
      actualRowCount: student.rows.length,
      sampleExpected: expected.rows.slice(0, 3),
      sampleActual: student.rows.slice(0, 3),
    },
  };
}

// ─── DML Diff Judging ─────────────────────────────────────────────
async function judgeDmlDiff(
  oracleSchema: string,
  oraclePassword: string,
  studentSql: string,
  solutionQuery: string,
  setupScript: string
): Promise<JudgeResult> {
  // First: run solution query on a fresh environment to get expected state
  await sandbox.prepareEnvironment(oracleSchema, oraclePassword, setupScript);

  // Execute solution DML
  const solResult = await sandbox.executeDmlQuery(
    oracleSchema,
    oraclePassword,
    solutionQuery
  );

  // Get the affected tables after solution
  const affectedTables = await getAffectedTables(solResult.connection);
  const expectedData: Record<string, any[]> = {};

  for (const table of affectedTables) {
    const result = await solResult.connection.execute(
      `SELECT * FROM ${table} ORDER BY ROWID`,
      [],
      {
        outFormat: 4002, // OUT_FORMAT_OBJECT
        maxRows: 1000,
      }
    );
    expectedData[table] = (result.rows as any[]) || [];
  }
  await solResult.connection.close();

  // Second: reset and run student DML
  await sandbox.prepareEnvironment(oracleSchema, oraclePassword, setupScript);

  const stuResult = await sandbox.executeDmlQuery(
    oracleSchema,
    oraclePassword,
    studentSql
  );

  const tableDiffs = [];
  for (const table of affectedTables) {
    const result = await stuResult.connection.execute(
      `SELECT * FROM ${table} ORDER BY ROWID`,
      [],
      {
        outFormat: 4002,
        maxRows: 1000,
      }
    );
    tableDiffs.push({
      tableName: table,
      actualRows: (result.rows as any[]) || [],
      expectedRows: expectedData[table] || [],
    });
  }
  await stuResult.connection.close();

  const diff = validateDmlDiff(tableDiffs);

  return {
    verdict: diff.pass ? "pass" : "fail",
    message: diff.message,
    executionTimeMs: stuResult.executionTimeMs,
    resultSummary: diff.tableDiffs,
  };
}

// ─── DDL Diff Judging ─────────────────────────────────────────────
async function judgeDdlDiff(
  oracleSchema: string,
  oraclePassword: string,
  studentSql: string,
  expectedStructure: any
): Promise<JudgeResult> {
  // Execute student DDL
  const { executionTimeMs } = await sandbox.executeDdlQuery(
    oracleSchema,
    oraclePassword,
    studentSql
  );

  // Query the data dictionary for the resulting structure
  const tableName = expectedStructure?.tableName;
  if (!tableName) {
    return {
      verdict: "error",
      message: "Problem configuration error: missing tableName in expectedOutput",
      executionTimeMs,
    };
  }

  const structure = await sandbox.queryTableStructure(
    oracleSchema,
    oraclePassword,
    tableName
  );

  // Compare against expected
  const diff = validateDdlDiff(
    structure.columns,
    structure.constraints,
    structure.indexes,
    expectedStructure
  );

  return {
    verdict: diff.pass ? "pass" : "fail",
    message: diff.message,
    executionTimeMs,
    resultSummary: diff.structureDiffs,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────
async function getAffectedTables(
  conn: any
): Promise<string[]> {
  const result = await conn.execute(
    `SELECT TABLE_NAME FROM USER_TABLES ORDER BY TABLE_NAME`,
    [],
    { outFormat: 4002 }
  );
  return ((result.rows as any[]) || []).map((r: any) => r.TABLE_NAME);
}

async function saveSubmissionRecord(
  userId: number,
  problemId: number,
  queryText: string,
  result: JudgeResult
): Promise<void> {
  await db.insert(submissions).values({
    userId,
    problemId,
    queryText,
    verdict: result.verdict,
    executionTimeMs: result.executionTimeMs,
    errorMessage: result.verdict !== "pass" ? result.message : null,
    resultSummary: result.resultSummary || null,
  });

  // Update leaderboard stats on pass
  if (result.verdict === "pass") {
    try {
      const problem = await getProblemFull(problemId);
      await updateStatsAfterSolve(userId, problemId, problem.difficulty);
    } catch (err) {
      // Don't fail the submission if stats update fails
      console.error("⚠️ Failed to update leaderboard stats:", err);
    }
  }
}
