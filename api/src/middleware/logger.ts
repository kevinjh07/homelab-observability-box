import type { Request, Response, NextFunction } from "express";
import { formatLogEntry } from "../lib/formatLogEntry";

function resolveLogLevel(statusCode: number): "info" | "warn" | "error" {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "warn";
  return "info";
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const level = resolveLogLevel(res.statusCode);

    console.log(
      formatLogEntry({
        level,
        method: req.method,
        route: req.path,
        statusCode: res.statusCode,
        durationMs,
      }),
    );
  });

  next();
}
