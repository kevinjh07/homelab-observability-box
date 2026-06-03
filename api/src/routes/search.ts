import { Router } from "express";
import type { Request, Response } from "express";
import { simulateDelay } from "../lib/simulateDelay";
import { shouldFail } from "../lib/simulateError";

export const searchRouter = Router();

const ERROR_RATE = parseFloat(process.env.ERROR_RATE ?? "0.05");

searchRouter.get("/search", async (req: Request, res: Response): Promise<void> => {
  await simulateDelay(50, 600);
  if (shouldFail(ERROR_RATE)) {
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
