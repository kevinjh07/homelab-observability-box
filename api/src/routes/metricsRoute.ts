import { Router } from "express";
import type { Request, Response } from "express";
import type { Registry } from "prom-client";

export function buildMetricsRoute(registry: Registry): Router {
  const router = Router();

  router.get("/metrics", async (_req: Request, res: Response): Promise<void> => {
    res.set("Content-Type", registry.contentType);
    res.end(await registry.metrics());
  });

  return router;
}
