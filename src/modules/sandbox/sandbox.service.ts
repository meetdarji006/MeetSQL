import oracledb, { Connection, Metadata } from "oracledb";
import { getAdminConnection, getStudentConnection } from "../../config/oracle";
import { env } from "../../config/env";

/**
 * Create an Oracle schema (user) for a student.
 * Called during signup.
 */
export async function createStudentSchema(
  oracleSchemaName: string,
  oraclePassword: string
): Promise<void> {
  const safePass = oraclePassword.length > 24 ? oraclePassword.slice(0, 24) : oraclePassword;
  const conn = await getAdminConnection();
  try {
    // Create the student user with limited tablespace quota
    await conn.execute(
      `CREATE USER ${oracleSchemaName} IDENTIFIED BY "${safePass}"
       DEFAULT TABLESPACE USERS
       QUOTA 50M ON USERS`
    );

    // Grant minimal privileges needed for SQL practice
    await conn.execute(
      `GRANT CREATE SESSION,
            CREATE TABLE,
            CREATE SEQUENCE,
            CREATE VIEW,
            CREATE TRIGGER
       TO ${oracleSchemaName}`
    );

    // Try to assign to student resource group (best-effort, may not work on XE)
    try {
      await conn.execute(
        `BEGIN
           DBMS_RESOURCE_MANAGER.SET_CONSUMER_GROUP_MAPPING(
             'ORACLE_USER', '${oracleSchemaName}', 'STUDENT_GROUP'
           );
         END;`
      );
    } catch {
      // Resource Manager may not be available on XE — that's OK
      console.warn(
        `⚠️ Could not assign ${oracleSchemaName} to STUDENT_GROUP (Resource Manager may not be available)`
      );
    }

    await conn.commit();
    console.log(`✅ Oracle schema created: ${oracleSchemaName}`);
  } finally {
    await conn.close();
  }
}

/**
 * Ensures the student Oracle user exists with the correct password.
 * Creates the user if it doesn't exist or updates password if needed.
 */
export async function ensureStudentSchema(
  oracleSchemaName: string,
  oraclePassword: string
): Promise<void> {
  const safePass = oraclePassword.length > 24 ? oraclePassword.slice(0, 24) : oraclePassword;
  const conn = await getAdminConnection();
  try {
    try {
      await conn.execute(
        `ALTER USER ${oracleSchemaName} IDENTIFIED BY "${safePass}"`
      );
    } catch (err: any) {
      if (err.errorNum === 1918 || err.message?.includes("ORA-01918")) {
        await conn.execute(
          `CREATE USER ${oracleSchemaName} IDENTIFIED BY "${safePass}"
           DEFAULT TABLESPACE USERS
           QUOTA 50M ON USERS`
        );
      } else {
        throw err;
      }
    }

    // Always ensure quota & required system privileges are granted
    await conn.execute(
      `ALTER USER ${oracleSchemaName} QUOTA 50M ON USERS`
    );
    await conn.execute(
      `GRANT CREATE SESSION,
            CREATE TABLE,
            CREATE SEQUENCE,
            CREATE VIEW,
            CREATE TRIGGER
       TO ${oracleSchemaName}`
    );
  } finally {
    await conn.close();
  }
}

/**
 * Strips trailing semicolons and slashes from single SQL statements
 * to satisfy node-oracledb execution requirements.
 */
function cleanSql(sql: string): string {
  if (!sql) return "";
  let s = sql.trim();
  // Remove trailing / or ; and any trailing whitespace
  while (s.endsWith(";") || s.endsWith("/")) {
    s = s.slice(0, -1).trim();
  }
  return s;
}

/**
 * Drop all objects in a student's schema (tables, sequences, views)
 * then execute the problem's setup_script to create fresh tables.
 */
export async function prepareEnvironment(
  oracleSchemaName: string,
  oraclePassword: string,
  setupScript: string
): Promise<void> {
  await ensureStudentSchema(oracleSchemaName, oraclePassword);
  const conn = await getStudentConnection(oracleSchemaName, oraclePassword);
  try {
    // 1. Drop all existing objects in the schema
    await cleanSchema(conn);

    // 2. Execute the setup script (may contain multiple statements)
    const statements = splitOracleStatements(setupScript);
    for (const stmt of statements) {
      const cleaned = cleanSql(stmt);
      if (cleaned.length > 0) {
        await conn.execute(cleaned);
      }
    }

    await conn.commit();
  } finally {
    await conn.close();
  }
}

/**
 * Execute a student's SQL query in their sandboxed schema.
 * Returns the result set and execution time.
 */
export async function executeStudentQuery(
  oracleSchemaName: string,
  oraclePassword: string,
  sql: string
): Promise<{
  rows: any[];
  metaData: Metadata[];
  executionTimeMs: number;
}> {
  const conn = await getStudentConnection(oracleSchemaName, oraclePassword);
  conn.callTimeout = env.ORACLE_QUERY_TIMEOUT_MS;

  try {
    const startTime = Date.now();
    const cleanedSql = cleanSql(sql);

    const result = await conn.execute(cleanedSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000, // Safety cap on result rows
    });

    const executionTimeMs = Date.now() - startTime;

    return {
      rows: (result.rows as any[]) || [],
      metaData: (result.metaData as Metadata[]) || [],
      executionTimeMs,
    };
  } finally {
    await conn.close();
  }
}

/**
 * Execute a DML statement (INSERT/UPDATE/DELETE) in the student's schema.
 * Does NOT auto-commit — the judge will query affected tables before rollback.
 */
export async function executeDmlQuery(
  oracleSchemaName: string,
  oraclePassword: string,
  sql: string
): Promise<{
  rowsAffected: number;
  executionTimeMs: number;
  connection: Connection; // Keep connection open for post-DML inspection
}> {
  const conn = await getStudentConnection(oracleSchemaName, oraclePassword);
  conn.callTimeout = env.ORACLE_QUERY_TIMEOUT_MS;

  const startTime = Date.now();
  const cleanedSql = cleanSql(sql);

  const result = await conn.execute(cleanedSql, [], {
    autoCommit: false, // Keep transaction open for inspection
  });

  const executionTimeMs = Date.now() - startTime;

  return {
    rowsAffected: result.rowsAffected || 0,
    executionTimeMs,
    connection: conn, // Caller must close this connection
  };
}

/**
 * Execute a DDL statement (CREATE TABLE, ALTER TABLE, etc.) in the student's schema.
 * DDL auto-commits in Oracle.
 */
export async function executeDdlQuery(
  oracleSchemaName: string,
  oraclePassword: string,
  sql: string
): Promise<{ executionTimeMs: number }> {
  const conn = await getStudentConnection(oracleSchemaName, oraclePassword);
  conn.callTimeout = env.ORACLE_QUERY_TIMEOUT_MS;

  try {
    const startTime = Date.now();
    const cleanedSql = cleanSql(sql);
    await conn.execute(cleanedSql);
    const executionTimeMs = Date.now() - startTime;
    return { executionTimeMs };
  } finally {
    await conn.close();
  }
}

/**
 * Query a table in the student's schema (used by judge validators).
 */
export async function queryTable(
  oracleSchemaName: string,
  oraclePassword: string,
  tableName: string
): Promise<any[]> {
  const conn = await getStudentConnection(oracleSchemaName, oraclePassword);
  try {
    const result = await conn.execute(
      `SELECT * FROM ${tableName} ORDER BY ROWID`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, maxRows: 1000 }
    );
    return (result.rows as any[]) || [];
  } finally {
    await conn.close();
  }
}

/**
 * Query Oracle data dictionary for table structure (used by DDL validator).
 */
export async function queryTableStructure(
  oracleSchemaName: string,
  oraclePassword: string,
  tableName: string
): Promise<{
  columns: any[];
  constraints: any[];
  indexes: any[];
}> {
  const conn = await getStudentConnection(oracleSchemaName, oraclePassword);
  try {
    const [colResult, conResult, idxResult] = await Promise.all([
      conn.execute(
        `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, DATA_PRECISION, DATA_SCALE, NULLABLE
         FROM USER_TAB_COLUMNS WHERE TABLE_NAME = :tn ORDER BY COLUMN_ID`,
        { tn: tableName.toUpperCase() },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      conn.execute(
        `SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE, SEARCH_CONDITION, R_CONSTRAINT_NAME,
                DELETE_RULE, STATUS
         FROM USER_CONSTRAINTS WHERE TABLE_NAME = :tn ORDER BY CONSTRAINT_NAME`,
        { tn: tableName.toUpperCase() },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      conn.execute(
        `SELECT INDEX_NAME, UNIQUENESS
         FROM USER_INDEXES WHERE TABLE_NAME = :tn ORDER BY INDEX_NAME`,
        { tn: tableName.toUpperCase() },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
    ]);

    return {
      columns: (colResult.rows as any[]) || [],
      constraints: (conResult.rows as any[]) || [],
      indexes: (idxResult.rows as any[]) || [],
    };
  } finally {
    await conn.close();
  }
}

/**
 * Drop all objects in a student's schema (tables, views, sequences, etc.)
 */
async function cleanSchema(conn: Connection): Promise<void> {
  // Get all user objects and drop them in dependency order
  const objectTypes = ["VIEW", "TABLE", "SEQUENCE"];

  for (const objType of objectTypes) {
    const result = await conn.execute(
      `SELECT OBJECT_NAME FROM USER_OBJECTS WHERE OBJECT_TYPE = :ot`,
      { ot: objType },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    for (const row of (result.rows as any[]) || []) {
      try {
        const cascade = objType === "TABLE" ? " CASCADE CONSTRAINTS PURGE" : "";
        await conn.execute(`DROP ${objType} "${row.OBJECT_NAME}"${cascade}`);
      } catch {
        // Object may have already been dropped by cascade
      }
    }
  }
}

/**
 * Split a multi-statement Oracle SQL script into individual statements.
 * Splits on semicolons, handling PL/SQL blocks (BEGIN..END) correctly.
 */
function splitOracleStatements(script: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inPlsql = false;

  const lines = script.split("\n");

  for (const line of lines) {
    const trimmed = line.trim().toUpperCase();

    if (
      trimmed.startsWith("BEGIN") ||
      trimmed.startsWith("DECLARE") ||
      trimmed.startsWith("CREATE OR REPLACE")
    ) {
      inPlsql = true;
    }

    current += line + "\n";

    if (inPlsql) {
      // PL/SQL blocks end with "/" on its own line
      if (trimmed === "/") {
        statements.push(current.replace(/\/\s*$/, "").trim());
        current = "";
        inPlsql = false;
      }
    } else {
      // Regular SQL statements end with ";"
      if (trimmed.endsWith(";")) {
        statements.push(current.replace(/;\s*$/, "").trim());
        current = "";
      }
    }
  }

  // Handle any remaining content
  const remaining = current.trim();
  if (remaining.length > 0 && remaining !== "/") {
    statements.push(remaining.replace(/;\s*$/, "").replace(/\/\s*$/, "").trim());
  }

  return statements.filter((s) => s.length > 0);
}

/**
 * Drop a student's Oracle schema entirely.
 * Called if a user account is deleted.
 */
export async function dropStudentSchema(
  oracleSchemaName: string
): Promise<void> {
  const conn = await getAdminConnection();
  try {
    await conn.execute(`DROP USER ${oracleSchemaName} CASCADE`);
    console.log(`🗑️ Oracle schema dropped: ${oracleSchemaName}`);
  } finally {
    await conn.close();
  }
}
