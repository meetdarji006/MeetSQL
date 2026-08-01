import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "../../config/postgres";
import {
  userStats,
  userBadges,
  badges,
  users,
  submissions,
  problems,
} from "../../db/schema";

// ─── Get Global Leaderboard ──────────────────────────────────────
export async function getLeaderboard(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    db
      .select({
        userId: userStats.userId,
        displayName: users.displayName,
        solvedCount: userStats.solvedCount,
        easySolved: userStats.easySolved,
        mediumSolved: userStats.mediumSolved,
        hardSolved: userStats.hardSolved,
        currentStreak: userStats.currentStreak,
        longestStreak: userStats.longestStreak,
        lastSolvedAt: userStats.lastSolvedAt,
      })
      .from(userStats)
      .innerJoin(users, eq(userStats.userId, users.id))
      .orderBy(
        desc(userStats.solvedCount),
        desc(userStats.hardSolved),
        desc(userStats.longestStreak)
      )
      .limit(limit)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(userStats),
  ]);

  const total = countResult[0]?.count ?? 0;

  // Add rank
  const ranked = data.map((entry, idx) => ({
    rank: offset + idx + 1,
    ...entry,
  }));

  return {
    leaderboard: ranked,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Get User Stats ──────────────────────────────────────────────
export async function getUserStats(userId: number) {
  let stats = await db.query.userStats.findFirst({
    where: eq(userStats.userId, userId),
  });

  if (!stats) {
    // Initialize stats for user
    const [created] = await db
      .insert(userStats)
      .values({ userId })
      .returning();
    stats = created;
  }

  // Get user's badges
  const earnedBadges = await db
    .select({
      id: badges.id,
      name: badges.name,
      description: badges.description,
      icon: badges.icon,
      earnedAt: userBadges.earnedAt,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt));

  // Get solve breakdown by topic
  const topicBreakdown = await db
    .select({
      tag: sql<string>`unnest(${problems.topicTags})`,
      count: sql<number>`count(DISTINCT ${submissions.problemId})::int`,
    })
    .from(submissions)
    .innerJoin(problems, eq(submissions.problemId, problems.id))
    .where(
      and(eq(submissions.userId, userId), eq(submissions.verdict, "pass"))
    )
    .groupBy(sql`unnest(${problems.topicTags})`);

  return {
    stats,
    badges: earnedBadges,
    topicBreakdown,
  };
}

// ─── Get All Available Badges ────────────────────────────────────
export async function getAllBadges() {
  return db.select().from(badges).orderBy(badges.name);
}

// ─── Update Stats After Solve ────────────────────────────────────
/**
 * Called after a successful submission to update user stats.
 * Handles first-solve detection, streak calculation, and badge awarding.
 */
export async function updateStatsAfterSolve(
  userId: number,
  problemId: number,
  difficulty: "easy" | "medium" | "hard"
) {
  // Check if this is the first solve for this problem
  const previousSolve = await db
    .select({ id: submissions.id })
    .from(submissions)
    .where(
      and(
        eq(submissions.userId, userId),
        eq(submissions.problemId, problemId),
        eq(submissions.verdict, "pass")
      )
    )
    .limit(2); // Check for more than 1 (current + previous)

  // If there's already a previous solve (besides the one just recorded),
  // this isn't a first solve — don't increment counts
  if (previousSolve.length > 1) {
    return;
  }

  // Ensure stats row exists
  let stats = await db.query.userStats.findFirst({
    where: eq(userStats.userId, userId),
  });

  if (!stats) {
    await db.insert(userStats).values({ userId });
    stats = (await db.query.userStats.findFirst({
      where: eq(userStats.userId, userId),
    }))!;
  }

  // Calculate streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = stats.currentStreak;
  if (stats.lastSolvedAt) {
    const lastSolved = new Date(stats.lastSolvedAt);
    lastSolved.setHours(0, 0, 0, 0);

    if (lastSolved.getTime() === yesterday.getTime()) {
      // Consecutive day — extend streak
      newStreak = stats.currentStreak + 1;
    } else if (lastSolved.getTime() < yesterday.getTime()) {
      // Streak broken — restart
      newStreak = 1;
    }
    // Same day — no change to streak
  } else {
    newStreak = 1; // First ever solve
  }

  // Update stats
  const updateData: Record<string, any> = {
    solvedCount: stats.solvedCount + 1,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    lastSolvedAt: new Date(),
    updatedAt: new Date(),
  };

  switch (difficulty) {
    case "easy":
      updateData.easySolved = stats.easySolved + 1;
      break;
    case "medium":
      updateData.mediumSolved = stats.mediumSolved + 1;
      break;
    case "hard":
      updateData.hardSolved = stats.hardSolved + 1;
      break;
  }

  await db
    .update(userStats)
    .set(updateData)
    .where(eq(userStats.userId, userId));

  // Check and award badges
  await checkAndAwardBadges(userId, {
    ...stats,
    ...updateData,
  });
}

// ─── Badge Checking ──────────────────────────────────────────────
async function checkAndAwardBadges(
  userId: number,
  currentStats: any
): Promise<void> {
  const allBadges = await db.select().from(badges);
  const earnedBadgeIds = (
    await db
      .select({ badgeId: userBadges.badgeId })
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
  ).map((b) => b.badgeId);

  for (const badge of allBadges) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    const criteria = badge.criteria as any;
    let earned = false;

    // Check different criteria types
    if (criteria.solvedCount && currentStats.solvedCount >= criteria.solvedCount) {
      earned = true;
    }
    if (criteria.easySolved && currentStats.easySolved >= criteria.easySolved) {
      earned = true;
    }
    if (criteria.mediumSolved && currentStats.mediumSolved >= criteria.mediumSolved) {
      earned = true;
    }
    if (criteria.hardSolved && currentStats.hardSolved >= criteria.hardSolved) {
      earned = true;
    }
    if (criteria.streak && currentStats.currentStreak >= criteria.streak) {
      earned = true;
    }

    // Topic-based badges (e.g., solve 5 "joins" problems)
    if (criteria.topic && criteria.topicCount) {
      const topicSolves = await db
        .select({
          count: sql<number>`count(DISTINCT ${submissions.problemId})::int`,
        })
        .from(submissions)
        .innerJoin(problems, eq(submissions.problemId, problems.id))
        .where(
          and(
            eq(submissions.userId, userId),
            eq(submissions.verdict, "pass"),
            sql`${criteria.topic} = ANY(${problems.topicTags})`
          )
        );

      if ((topicSolves[0]?.count ?? 0) >= criteria.topicCount) {
        earned = true;
      }
    }

    if (earned) {
      await db.insert(userBadges).values({ userId, badgeId: badge.id });
    }
  }
}
