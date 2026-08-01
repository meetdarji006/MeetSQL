import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";
import * as schema from "../db/schema";

const useSsl =
  env.NODE_ENV === "production" &&
  !env.DATABASE_URL.includes("localhost") &&
  !env.DATABASE_URL.includes("127.0.0.1") &&
  !env.DATABASE_URL.includes("@postgres:");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

export const db = drizzle(pool, { schema, logger: env.NODE_ENV === "development" });
export { pool as pgPool };
