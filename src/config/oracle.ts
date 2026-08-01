import oracledb, { Pool, Connection } from "oracledb";
import { env } from "./env";

let adminPool: Pool | null = null;

/**
 * Get or create the Oracle admin connection pool (SYSTEM user).
 * Used for schema management operations (create/drop student schemas, setup scripts).
 */
export async function getOracleAdminPool(): Promise<Pool> {
  if (adminPool) return adminPool;

  adminPool = await oracledb.createPool({
    user: env.ORACLE_ADMIN_USER,
    password: env.ORACLE_ADMIN_PASSWORD,
    connectString: `${env.ORACLE_HOST}:${env.ORACLE_PORT}/${env.ORACLE_SERVICE}`,
    poolMin: env.ORACLE_POOL_MIN,
    poolMax: env.ORACLE_POOL_MAX,
    poolTimeout: 60,
  });

  console.log("✅ Oracle admin pool created");
  return adminPool;
}

/**
 * Get a direct connection as a specific student Oracle user.
 * Used for executing student SQL submissions in their sandboxed schema.
 */
export async function getStudentConnection(
  oracleUser: string,
  oraclePassword: string
): Promise<Connection> {
  const safePass = oraclePassword.length > 24 ? oraclePassword.slice(0, 24) : oraclePassword;
  const conn = await oracledb.getConnection({
    user: oracleUser,
    password: safePass,
    connectString: `${env.ORACLE_HOST}:${env.ORACLE_PORT}/${env.ORACLE_SERVICE}`,
  });

  // Set query timeout as primary safety mechanism
  conn.callTimeout = env.ORACLE_QUERY_TIMEOUT_MS;

  return conn;
}

/**
 * Get a connection from the admin pool.
 */
export async function getAdminConnection(): Promise<Connection> {
  const pool = await getOracleAdminPool();
  return pool.getConnection();
}

/**
 * Close the Oracle admin pool gracefully.
 */
export async function closeOraclePool(): Promise<void> {
  if (adminPool) {
    await adminPool.close(10);
    adminPool = null;
    console.log("🔌 Oracle admin pool closed");
  }
}
