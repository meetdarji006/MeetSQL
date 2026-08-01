import { z } from "zod";

export const listSubmissionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  problemId: z.coerce.number().int().positive().optional(),
  verdict: z.enum(["pass", "fail", "error", "timeout"]).optional(),
});

export type ListSubmissionsInput = z.infer<typeof listSubmissionsSchema>;
