import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── User Stats ───────────────────────────────────────────────────
export const userStats = pgTable("user_stats", {
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  solvedCount: integer("solved_count").default(0).notNull(),
  easySolved: integer("easy_solved").default(0).notNull(),
  mediumSolved: integer("medium_solved").default(0).notNull(),
  hardSolved: integer("hard_solved").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastSolvedAt: timestamp("last_solved_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Badges ───────────────────────────────────────────────────────
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  criteria: jsonb("criteria").notNull(),
  icon: text("icon").notNull(),
});

// ─── User Badges ──────────────────────────────────────────────────
export const userBadges = pgTable(
  "user_badges",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    badgeId: integer("badge_id")
      .references(() => badges.id, { onDelete: "cascade" })
      .notNull(),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => ({
    userBadgeIdx: uniqueIndex("user_badges_user_badge_idx").on(
      table.userId,
      table.badgeId
    ),
  })
);

// ─── Relations ────────────────────────────────────────────────────
export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));
