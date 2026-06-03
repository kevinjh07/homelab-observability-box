import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../lib/simulateDelay", () => ({ simulateDelay: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../lib/simulateError", () => ({ shouldFail: vi.fn().mockReturnValue(false) }));

import { ordersRouter } from "./orders";

const app = express();
app.use(express.json());
app.use(ordersRouter);

describe("GET /orders", () => {
  it("returns 200 with an array", async () => {
    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).get("/orders");
    expect(res.status).toBe(500);
  });
});

describe("POST /orders", () => {
  it("returns 201 with created order", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ productId: 1, quantity: 2 });
    expect(res.status).toBe(201);
    const body = res.body as Record<string, unknown>;
    expect(typeof body.id).toBe("number");
    expect(body.status).toBe("pending");
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app)
      .post("/orders")
      .send({ productId: 1, quantity: 2 });
    expect(res.status).toBe(500);
  });
});
