import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Histogram } from "prom-client";
import { recordMetric } from "../lib/recordMetric";

function resolveRoute(req: Request): string {
  return (req.route as { path?: string } | undefined)?.path ?? req.path;
}

export function buildMetricsMiddleware(histogram: Histogram): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startedAt = Date.now();

    res.on("finish", () => {
      recordMetric({
        histogram,
        method: req.method,
        route: resolveRoute(req),
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  };
}
