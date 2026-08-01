import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error-handler";

// Route imports
import authRoutes from "./modules/auth/auth.routes";
import problemsRoutes from "./modules/problems/problems.routes";
import judgeRoutes from "./modules/judge/judge.routes";
import submissionsRoutes from "./modules/submissions/submissions.routes";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use("/api/", limiter);

// Stricter rate limit for judge submissions
const judgeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions, please slow down",
  },
});
app.use("/api/judge", judgeLimiter);

// ─── Health Check ─────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "MeetSQL API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ─── Serve Frontend Client ─────────────────────────────────────────
import path from "path";
import fs from "fs";

const clientDistPath = path.resolve(process.cwd(), "client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// ─── 404 Handler for API ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global Error Handler ─────────────────────────────────────────
app.use(errorHandler);

export default app;

