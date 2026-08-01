import { Response } from "express";

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  error?: unknown;
  meta?: Record<string, unknown>;
}

/**
 * Standardized API response wrapper.
 * All endpoints return { success, message, data?, meta?, error? }
 */
export function apiResponse<T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  error,
  meta,
}: ApiResponseOptions<T>): void {
  const body: Record<string, unknown> = { success, message };

  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;

  if (!success && error) {
    body.error =
      error instanceof Error
        ? { name: error.name, message: error.message }
        : error;
  }

  res.status(statusCode).json(body);
}

/**
 * Shorthand for success responses.
 */
export function ok<T>(res: Response, message: string, data?: T, meta?: Record<string, unknown>): void {
  apiResponse({ res, statusCode: 200, success: true, message, data, meta });
}

/**
 * Shorthand for created responses.
 */
export function created<T>(res: Response, message: string, data?: T): void {
  apiResponse({ res, statusCode: 201, success: true, message, data });
}

/**
 * Shorthand for error responses.
 */
export function fail(res: Response, statusCode: number, message: string, error?: unknown): void {
  apiResponse({ res, statusCode, success: false, message, error });
}
