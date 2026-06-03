import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requestLogger } from "./logger";

const buildReq = (overrides: Partial<Request> = {}): Request =>
  ({ method: "GET", path: "/users", ...overrides } as Request);

const buildRes = (statusCode = 200): Response =>
  ({ statusCode, on: vi.fn() } as unknown as Response);

describe("requestLogger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  it("calls next immediately", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = buildRes();
    requestLogger(buildReq(), res, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("logs after response finishes", () => {
    const next = vi.fn() as unknown as NextFunction;
    let finishCallback: (() => void) | undefined;
    const res = {
      statusCode: 200,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") finishCallback = cb;
      }),
    } as unknown as Response;

    requestLogger(buildReq(), res, next);
    finishCallback?.();

    expect(console.log).toHaveBeenCalledOnce();
    const logged = JSON.parse(
      (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    ) as Record<string, unknown>;
    expect(logged.method).toBe("GET");
    expect(logged.route).toBe("/users");
    expect(logged.status_code).toBe(200);
  });

  it("logs error level for 5xx responses", () => {
    let finishCallback: (() => void) | undefined;
    const res = {
      statusCode: 500,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") finishCallback = cb;
      }),
    } as unknown as Response;

    requestLogger(buildReq(), res, vi.fn() as unknown as NextFunction);
    finishCallback?.();

    const logged = JSON.parse(
      (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    ) as Record<string, unknown>;
    expect(logged.level).toBe("error");
  });

  it("logs warn level for 4xx responses", () => {
    let finishCallback: (() => void) | undefined;
    const res = {
      statusCode: 404,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") finishCallback = cb;
      }),
    } as unknown as Response;

    requestLogger(buildReq(), res, vi.fn() as unknown as NextFunction);
    finishCallback?.();

    const logged = JSON.parse(
      (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    ) as Record<string, unknown>;
    expect(logged.level).toBe("warn");
  });

  it("logs info level for 2xx responses", () => {
    let finishCallback: (() => void) | undefined;
    const res = {
      statusCode: 200,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") finishCallback = cb;
      }),
    } as unknown as Response;

    requestLogger(buildReq(), res, vi.fn() as unknown as NextFunction);
    finishCallback?.();

    const logged = JSON.parse(
      (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    ) as Record<string, unknown>;
    expect(logged.level).toBe("info");
  });
});
