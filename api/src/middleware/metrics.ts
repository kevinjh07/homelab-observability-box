import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Histogram } from "prom-client";
import { recordMetric } from "../lib/recordMetric";

function resolveRoute(req: Request): string {
  // Sem rota casada (ex.: 404), usar um valor fixo evita explosão de
  // cardinalidade no histograma com caminhos arbitrários de scanners.
  return (req.route as { path?: string } | undefined)?.path ?? "unmatched";
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
