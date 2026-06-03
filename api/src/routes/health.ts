import { Router } from "express";
import type { Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response): void => {
  res.json({ status: "ok" });
});

healthRouter.get("/ready", (_req: Request, res: Response): void => {
  res.json({ status: "ready" });
});

healthRouter.get("/health", (_req: Request, res: Response): void => {
  res.json({
    status: "ok",
    service: process.env.OTEL_SERVICE_NAME ?? "homelab-api",
    uptime_seconds: Math.floor(process.uptime()),
  });
});
