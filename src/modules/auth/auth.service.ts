import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "../../config/postgres";
import { users, refreshTokens } from "../../db/schema";
import { hashPassword, comparePassword } from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  parseExpiryToMs,
  TokenPayload,
} from "../../utils/jwt";
import { env } from "../../config/env";
import { SignupInput, LoginInput } from "./auth.schema";

import { createStudentSchema } from "../sandbox/sandbox.service";

// ─── Signup ───────────────────────────────────────────────────────
export async function signup(input: SignupInput) {
  // Check if email already exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    throw Object.assign(new Error("Email already registered"), {
      statusCode: 409,
    });
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Insert user
  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    })
    .returning({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      oracleSchema: users.oracleSchema,
      createdAt: users.createdAt,
    });

  // Generate Oracle schema name & password (24 chars to fit Oracle identifier limits)
  const oracleSchemaName = `STU_${user.id}`;
  const oraclePass = crypto.randomBytes(12).toString("hex");

  await db
    .update(users)
    .set({
      oracleSchema: oracleSchemaName,
      oraclePassword: oraclePass,
    })
    .where(eq(users.id, user.id));

  // Provision Oracle user schema
  try {
    await createStudentSchema(oracleSchemaName, oraclePass);
  } catch (err: any) {
    console.warn(`⚠️ Failed to provision Oracle schema on signup: ${err.message}`);
  }

  // Issue tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    oracleSchema: oracleSchemaName,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Store refresh token
  const expiresAt = new Date(
    Date.now() + parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN)
  );
  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      oracleSchema: oracleSchemaName,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

// ─── Login ────────────────────────────────────────────────────────
export async function login(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  // Issue tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    oracleSchema: user.oracleSchema,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Store refresh token
  const expiresAt = new Date(
    Date.now() + parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN)
  );
  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      oracleSchema: user.oracleSchema,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

// ─── Refresh ──────────────────────────────────────────────────────
export async function refresh(token: string) {
  // Verify the refresh token JWT
  let decoded: TokenPayload;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error("Invalid or expired refresh token"), {
      statusCode: 401,
    });
  }

  // Check if refresh token exists in DB (not revoked)
  const stored = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.token, token),
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw Object.assign(new Error("Refresh token expired or revoked"), {
      statusCode: 401,
    });
  }

  // Rotate: delete old token, issue new pair
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));

  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.userId),
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    oracleSchema: user.oracleSchema,
  };

  const accessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  const expiresAt = new Date(
    Date.now() + parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN)
  );
  await db.insert(refreshTokens).values({
    userId: user.id,
    token: newRefreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

// ─── Logout ───────────────────────────────────────────────────────
export async function logout(token: string) {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}

// ─── Get Profile ──────────────────────────────────────────────────
export async function getProfile(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      email: true,
      displayName: true,
      oracleSchema: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
}
