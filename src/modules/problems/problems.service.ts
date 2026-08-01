import { eq, ilike, and, sql, arrayContains } from "drizzle-orm";
import { db } from "../../config/postgres";
import { problems, submissions } from "../../db/schema";
import { ListProblemsInput } from "./problems.schema";

// ─── List Problems ────────────────────────────────────────────────
export async function listProblems(input: ListProblemsInput) {
  const { page, limit, difficulty, topic, search } = input;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (difficulty) {
    conditions.push(eq(problems.difficulty, difficulty));
  }

  if (topic) {
    conditions.push(arrayContains(problems.topicTags, [topic]));
  }

  if (search) {
    conditions.push(ilike(problems.title, `%${search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: problems.id,
        title: problems.title,
        slug: problems.slug,
        difficulty: problems.difficulty,
        topicTags: problems.topicTags,
        validationType: problems.validationType,
        createdAt: problems.createdAt,
      })
      .from(problems)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(problems.id),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(problems)
      .where(where),
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    problems: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Get Problem by Slug ──────────────────────────────────────────
export async function getProblemBySlug(slug: string) {
  const problem = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });

  if (!problem) {
    throw Object.assign(new Error("Problem not found"), { statusCode: 404 });
  }

  // Don't expose solutionQuery or expectedOutput to students
  const { solutionQuery, expectedOutput, ...safe } = problem;
  return safe;
}

// ─── Get Problem (full, internal use by judge) ────────────────────
export async function getProblemFull(problemId: number) {
  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, problemId),
  });

  if (!problem) {
    throw Object.assign(new Error("Problem not found"), { statusCode: 404 });
  }

  return problem;
}

// ─── Get All Topic Tags ──────────────────────────────────────────
export async function getAllTopics() {
  const result = await db
    .selectDistinct({ tag: sql<string>`unnest(${problems.topicTags})` })
    .from(problems)
    .orderBy(sql`1`);

  return result.map((r) => r.tag);
}

// ─── Get Solved Problem IDs ──────────────────────────────────────
export async function getSolvedProblemIds(userId: number): Promise<number[]> {
  const result = await db
    .selectDistinct({ problemId: submissions.problemId })
    .from(submissions)
    .where(
      and(eq(submissions.userId, userId), eq(submissions.verdict, "pass"))
    );

  return result.map((r) => r.problemId);
}
