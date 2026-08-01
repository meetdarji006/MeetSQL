import { Request, Response } from "express";
import * as authService from "./auth.service";
import { ok, created, fail } from "../../utils/api-response";

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    created(res, "Account created successfully", result);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    ok(res, "Login successful", result);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    ok(res, "Tokens refreshed", result);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    await authService.logout(req.body.refreshToken);
    ok(res, "Logged out successfully");
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const user = await authService.getProfile(req.user!.userId);
    ok(res, "Profile retrieved", user);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}
