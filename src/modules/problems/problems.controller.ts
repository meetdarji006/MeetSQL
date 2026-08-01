import { Request, Response } from "express";
import * as problemsService from "./problems.service";
import { ok, fail } from "../../utils/api-response";

export async function listProblems(req: Request, res: Response) {
  try {
    const result = await problemsService.listProblems(req.query as any);
    ok(res, "Problems retrieved", result.problems, result.pagination);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getProblem(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const problem = await problemsService.getProblemBySlug(slug);
    ok(res, "Problem retrieved", problem);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getTopics(req: Request, res: Response) {
  try {
    const topics = await problemsService.getAllTopics();
    ok(res, "Topics retrieved", topics);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getSolvedIds(req: Request, res: Response) {
  try {
    const solvedIds = await problemsService.getSolvedProblemIds(req.user!.userId);
    ok(res, "Solved IDs retrieved", solvedIds);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}
