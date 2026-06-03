import { Router } from "express";
import type { Request, Response } from "express";
import { simulateDelay } from "../lib/simulateDelay";
import { shouldFail } from "../lib/simulateError";

export const productsRouter = Router();

const ERROR_RATE = parseFloat(process.env.ERROR_RATE ?? "0.05");

productsRouter.get("/products", async (_req: Request, res: Response): Promise<void> => {
  await simulateDelay(20, 70);
  if (shouldFail(ERROR_RATE * 0.5)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  res.json([
    { id: 1, name: "Widget A", price: 9.99 },
    { id: 2, name: "Widget B", price: 19.99 },
  ]);
});

productsRouter.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  await simulateDelay(10, 40);
  if (shouldFail(ERROR_RATE * 0.5)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  res.json({ id: parseInt(req.params.id, 10), name: "Widget A", price: 9.99 });
});
