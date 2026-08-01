import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import { fail } from "../utils/api-response";

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * JWT authentication middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches the decoded payload to req.user.
 */
export function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    fail(res, 401, "Missing or invalid authorization header");
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      fail(res, 401, "Access token expired");
      return;
    }
    fail(res, 401, "Invalid access token");
  }
}
