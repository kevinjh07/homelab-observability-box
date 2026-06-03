import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../lib/simulateDelay", () => ({ simulateDelay: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../lib/simulateError", () => ({ shouldFail: vi.fn().mockReturnValue(false) }));

import { productsRouter } from "./products";

const app = express();
app.use(productsRouter);

describe("GET /products", () => {
  it("returns 200 with an array", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).get("/products");
    expect(res.status).toBe(500);
  });
});

describe("GET /products/:id", () => {
  it("returns 200 with a product object", async () => {
    const res = await request(app).get("/products/1");
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.id).toBe(1);
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).get("/products/1");
    expect(res.status).toBe(500);
  });
});
