import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { fail } from "../utils/api-response";

/**
 * Zod validation middleware factory.
 * Validates req.body against the provided schema.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.issues.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        fail(res, 400, "Validation failed", formatted);
        return;
      }
      next(err);
    }
  };
}

/**
 * Validate query parameters.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query) as Record<string, any>;
      for (const key of Object.keys(req.query)) {
        delete (req.query as any)[key];
      }
      Object.assign(req.query, parsed);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.issues.map((e: any) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        fail(res, 400, "Invalid query parameters", formatted);
        return;
      }
      next(err);
    }
  };
}
