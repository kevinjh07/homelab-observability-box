import { describe, it, expect, vi, afterEach } from "vitest";
import express from "express";
import request from "supertest";

describe("GET /metrics", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("returns 200 with prometheus text format", async () => {
    const { buildMetricsRoute } = await import("./metricsRoute");
    const registry = {
      metrics: vi.fn().mockResolvedValue("# HELP test\ntest 1\n"),
      contentType: "text/plain; version=0.0.4; charset=utf-8",
    };

    const app = express();
    app.use(buildMetricsRoute(registry as never));

    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("# HELP test");
  });
});
