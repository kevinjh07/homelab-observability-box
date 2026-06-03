import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { healthRouter } from "./health";

const app = express();
app.use(healthRouter);

describe("GET /", () => {
  it("returns 200 with ok status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect((res.body as Record<string, unknown>).status).toBe("ok");
  });
});

describe("GET /ready", () => {
  it("returns 200 with ready status", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect((res.body as Record<string, unknown>).status).toBe("ready");
  });
});

describe("GET /health", () => {
  it("returns 200 with service name and uptime", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.status).toBe("ok");
    expect(typeof body.uptime_seconds).toBe("number");
    expect(typeof body.service).toBe("string");
  });
});
