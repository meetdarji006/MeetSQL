import { Request, Response, NextFunction } from "express";
import { fail } from "../utils/api-response";

/**
 * Global error handler middleware.
 * Must be registered LAST in the middleware chain.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("🔥 Unhandled error:", err);

  const statusCode = (err as any).statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  fail(res, statusCode, message, err);
}

/**
 * Wrap an async route handler to catch errors automatically.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
