import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../config/postgres";
import { submissions, problems } from "../../db/schema";
import { ListSubmissionsInput } from "./submissions.schema";

// ─── List User Submissions ────────────────────────────────────────
export async function listSubmissions(
  userId: number,
  input: ListSubmissionsInput
) {
  const { page, limit, problemId, verdict } = input;
  const offset = (page - 1) * limit;

  const conditions = [eq(submissions.userId, userId)];

  if (problemId) {
    conditions.push(eq(submissions.problemId, problemId));
  }

  if (verdict) {
    conditions.push(eq(submissions.verdict, verdict));
  }

  const where = and(...conditions);

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: submissions.id,
        problemId: submissions.problemId,
        problemTitle: problems.title,
        problemSlug: problems.slug,
        queryText: submissions.queryText,
        verdict: submissions.verdict,
        executionTimeMs: submissions.executionTimeMs,
        errorMessage: submissions.errorMessage,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(submissions.submittedAt)),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(where),
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    submissions: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Get Single Submission ────────────────────────────────────────
export async function getSubmission(userId: number, submissionId: number) {
  const [result] = await db
    .select({
      id: submissions.id,
      problemId: submissions.problemId,
      problemTitle: problems.title,
      problemSlug: problems.slug,
      queryText: submissions.queryText,
      verdict: submissions.verdict,
      executionTimeMs: submissions.executionTimeMs,
      errorMessage: submissions.errorMessage,
      resultSummary: submissions.resultSummary,
      submittedAt: submissions.submittedAt,
    })
    .from(submissions)
    .leftJoin(problems, eq(submissions.problemId, problems.id))
    .where(
      and(eq(submissions.id, submissionId), eq(submissions.userId, userId))
    );

  if (!result) {
    throw Object.assign(new Error("Submission not found"), {
      statusCode: 404,
    });
  }

  return result;
}

// ─── Get Submissions for a Problem ────────────────────────────────
export async function getProblemSubmissions(
  userId: number,
  problemId: number
) {
  return db
    .select({
      id: submissions.id,
      queryText: submissions.queryText,
      verdict: submissions.verdict,
      executionTimeMs: submissions.executionTimeMs,
      errorMessage: submissions.errorMessage,
      submittedAt: submissions.submittedAt,
    })
    .from(submissions)
    .where(
      and(eq(submissions.userId, userId), eq(submissions.problemId, problemId))
    )
    .orderBy(desc(submissions.submittedAt))
    .limit(50);
}
