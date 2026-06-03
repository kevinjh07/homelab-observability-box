import { Router } from "express";
import type { Request, Response } from "express";
import { simulateDelay } from "../lib/simulateDelay";
import { shouldFail } from "../lib/simulateError";

export const usersRouter = Router();

const ERROR_RATE = parseFloat(process.env.ERROR_RATE ?? "0.05");

usersRouter.get("/users", async (_req: Request, res: Response): Promise<void> => {
  await simulateDelay(30, 100);
  if (shouldFail(ERROR_RATE)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});

usersRouter.get("/users/:id", async (req: Request, res: Response): Promise<void> => {
  await simulateDelay(15, 50);
  if (shouldFail(ERROR_RATE * 0.5)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  res.json({ id: parseInt(req.params.id, 10), name: "Alice" });
});

usersRouter.post("/users", async (req: Request, res: Response): Promise<void> => {
  await simulateDelay(100, 300);
  if (shouldFail(ERROR_RATE * 2)) {
    res.status(500).json({ error: "internal server error" });
    return;
  }
  const body = req.body as { name?: string; email?: string };
  res.status(201).json({ id: Math.floor(Math.random() * 1000) + 10, ...body });
});
