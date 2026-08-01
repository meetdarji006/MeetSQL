import { Request, Response } from "express";
import * as leaderboardService from "./leaderboard.service";
import { ok, fail } from "../../utils/api-response";

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const result = await leaderboardService.getLeaderboard(page, limit);
    ok(res, "Leaderboard retrieved", result.leaderboard, result.pagination);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getMyStats(req: Request, res: Response) {
  try {
    const result = await leaderboardService.getUserStats(req.user!.userId);
    ok(res, "Stats retrieved", result);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getBadges(req: Request, res: Response) {
  try {
    const badges = await leaderboardService.getAllBadges();
    ok(res, "Badges retrieved", badges);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}
