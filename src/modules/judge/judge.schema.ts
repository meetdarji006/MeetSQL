import { z } from "zod";

export const submitSchema = z.object({
  problemId: z.coerce.number().int().positive("Problem ID must be a positive integer"),
  sql: z
    .string()
    .min(1, "SQL query is required")
    .max(5000, "SQL query must be under 5000 characters"),
});

export type SubmitInput = z.infer<typeof submitSchema>;
