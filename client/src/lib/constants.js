export const API_URL = "http://localhost:3000/api";

export const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", dot: "bg-green-400" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
  hard: { label: "Hard", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
};

export const VERDICT_CONFIG = {
  pass: { label: "ACCEPTED", color: "text-green-400", bg: "bg-green-500", icon: "✓" },
  fail: { label: "WRONG ANSWER", color: "text-red-400", bg: "bg-red-500", icon: "✗" },
  error: { label: "RUNTIME ERROR", color: "text-amber-400", bg: "bg-amber-500", icon: "!" },
  timeout: { label: "TIME LIMIT EXCEEDED", color: "text-red-300", bg: "bg-red-400", icon: "⏱" },
};

export const SQL_QUOTES = [
  "SELECT skill FROM practice WHERE reps > 0;",
  "DROP TABLE procrastination CASCADE;",
  "INSERT INTO knowledge VALUES ('SQL', SYSDATE);",
  "UPDATE confidence SET level = level + 1 WHERE solved = TRUE;",
  "SELECT * FROM future WHERE preparation IS NOT NULL;",
  "DELETE FROM doubts WHERE practice_count > 100;",
  "CREATE INDEX idx_success ON consistency(daily_reps);",
];
