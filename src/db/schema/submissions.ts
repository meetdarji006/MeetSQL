import {
  pgTable,
  pgEnum,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { problems } from "./problems";

// ─── Enums ────────────────────────────────────────────────────────
export const verdictEnum = pgEnum("verdict", [
  "pass",
  "fail",
  "error",
  "timeout",
]);

// ─── Submissions ──────────────────────────────────────────────────
export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    problemId: integer("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    queryText: text("query_text").notNull(),
    verdict: verdictEnum("verdict").notNull(),
    executionTimeMs: integer("execution_time_ms"),
    errorMessage: text("error_message"),
    resultSummary: jsonb("result_summary"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  },
  (table) => ({
    userProblemIdx: index("submissions_user_problem_idx").on(
      table.userId,
      table.problemId
    ),
    userIdx: index("submissions_user_idx").on(table.userId),
  })
);

// ─── Relations ────────────────────────────────────────────────────
export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
}));
