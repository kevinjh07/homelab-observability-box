import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../lib/simulateDelay", () => ({ simulateDelay: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../lib/simulateError", () => ({ shouldFail: vi.fn().mockReturnValue(false) }));

import { searchRouter } from "./search";

const app = express();
app.use(searchRouter);

describe("GET /search", () => {
  it("returns 200 with results array", async () => {
    const res = await request(app).get("/search?q=widget");
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.query).toBe("widget");
    expect(Array.isArray(body.results)).toBe(true);
  });

  it("uses empty string when query param is absent", async () => {
    const res = await request(app).get("/search");
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.query).toBe("");
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).get("/search?q=fail");
    expect(res.status).toBe(500);
  });
});
