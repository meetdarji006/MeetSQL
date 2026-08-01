import {
  pgTable,
  pgEnum,
  serial,
  text,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────
export const difficultyEnum = pgEnum("difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const validationTypeEnum = pgEnum("validation_type", [
  "select_diff",
  "dml_diff",
  "ddl_diff",
]);

// ─── Problems ─────────────────────────────────────────────────────
export const problems = pgTable(
  "problems",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    topicTags: text("topic_tags").array().notNull().default([]),
    setupScript: text("setup_script").notNull(),
    solutionQuery: text("solution_query").notNull(),
    validationType: validationTypeEnum("validation_type").notNull(),
    expectedOutput: jsonb("expected_output"),
    orderSensitive: boolean("order_sensitive").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("problems_slug_idx").on(table.slug),
  })
);
