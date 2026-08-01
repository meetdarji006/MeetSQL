import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  // App
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // PostgreSQL
  DATABASE_URL: z.string().url(),

  // Oracle XE
  ORACLE_HOST: z.string().default("localhost"),
  ORACLE_PORT: z.coerce.number().default(1521),
  ORACLE_SERVICE: z.string().default("XEPDB1"),
  ORACLE_ADMIN_USER: z.string().default("SYSTEM"),
  ORACLE_ADMIN_PASSWORD: z.string(),
  ORACLE_POOL_MIN: z.coerce.number().default(2),
  ORACLE_POOL_MAX: z.coerce.number().default(10),
  ORACLE_QUERY_TIMEOUT_MS: z.coerce.number().default(10000),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
