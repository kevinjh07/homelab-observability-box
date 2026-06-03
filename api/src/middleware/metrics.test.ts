import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import type { Histogram } from "prom-client";
import { buildMetricsMiddleware } from "./metrics";

const buildReq = (overrides: Partial<Request> = {}): Request =>
  ({ method: "GET", route: { path: "/users" }, ...overrides } as Request);

describe("buildMetricsMiddleware", () => {
  let observe: ReturnType<typeof vi.fn>;
  let histogram: Histogram;

  beforeEach(() => {
    observe = vi.fn();
    histogram = { observe } as unknown as Histogram;
  });

  it("calls next immediately", () => {
    const next = vi.fn() as unknown as NextFunction;
    const middleware = buildMetricsMiddleware(histogram);
    const res = { statusCode: 200, on: vi.fn() } as unknown as Response;
    middleware(buildReq(), res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("records metric after response finishes", () => {
    let finishCallback: (() => void) | undefined;
    const res = {
      statusCode: 200,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") finishCallback = cb;
      }),
    } as unknown as Response;

    const middleware = buildMetricsMiddleware(histogram);
    middleware(buildReq(), res, vi.fn() as unknown as NextFunction);
    finishCallback?.();

    expect(observe).toHaveBeenCalledOnce();
    const [labels] = observe.mock.calls[0] as [Record<string, string>, number];
    expect(labels.method).toBe("GET");
    expect(labels.route).toBe("/users");
    expect(labels.status_code).toBe("200");
  });

  it("uses request path when route is unavailable", () => {
    let finishCallback: (() => void) | undefined;
    const res = {
      statusCode: 404,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") finishCallback = cb;
      }),
    } as unknown as Response;
    const req = { method: "GET", route: undefined, path: "/unknown" } as unknown as Request;

    const middleware = buildMetricsMiddleware(histogram);
    middleware(req, res, vi.fn() as unknown as NextFunction);
    finishCallback?.();

    const [labels] = observe.mock.calls[0] as [Record<string, string>, number];
    expect(labels.route).toBe("/unknown");
  });
});
