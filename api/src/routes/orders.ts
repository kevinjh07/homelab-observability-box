import { Router } from "express";
import type { Request, Response } from "express";
import { simulateDelay } from "../lib/simulateDelay";
import { shouldFail } from "../lib/simulateError";
import { errorRate } from "../lib/errorRate";

export const ordersRouter = Router();

ordersRouter.get("/orders", async (_req: Request, res: Response): Promise<void> => {
  await simulateDelay(80, 250);
  if (shouldFail(errorRate)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  res.json([
    { id: 1, productId: 1, quantity: 2, status: "shipped" },
    { id: 2, productId: 2, quantity: 1, status: "pending" },
  ]);
});

ordersRouter.post("/orders", async (req: Request, res: Response): Promise<void> => {
  await simulateDelay(150, 400);
  if (shouldFail(errorRate * 2)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  const body = req.body as { productId?: number; quantity?: number };
  res.status(201).json({
    id: Math.floor(Math.random() * 1000) + 100,
    ...body,
    status: "pending",
  });
});
