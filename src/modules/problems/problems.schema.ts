import { z } from "zod";

export const listProblemsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  topic: z.string().optional(),
  search: z.string().optional(),
});

export const problemSlugSchema = z.object({
  slug: z.string().min(1),
});

export type ListProblemsInput = z.infer<typeof listProblemsSchema>;
