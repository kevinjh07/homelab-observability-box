import { Router } from "express";
import type { Request, Response } from "express";
import { simulateDelay } from "../lib/simulateDelay";
import { shouldFail } from "../lib/simulateError";
import { errorRate } from "../lib/errorRate";

export const searchRouter = Router();

searchRouter.get("/search", async (req: Request, res: Response): Promise<void> => {
  await simulateDelay(50, 600);
  if (shouldFail(errorRate)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  const query = typeof req.query.q === "string" ? req.query.q : "";
  res.json({
    query,
    results: [
      { type: "user", id: 1, name: "Alice" },
      { type: "product", id: 1, name: "Widget A" },
    ],
  });
});
