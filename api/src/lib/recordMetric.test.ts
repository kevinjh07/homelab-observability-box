import { describe, it, expect, vi } from "vitest";
import { recordMetric } from "./recordMetric";
import type { Histogram } from "prom-client";

describe("recordMetric", () => {
  it("calls observe with the correct labels and duration in seconds", () => {
    const observe = vi.fn();
    const histogram = { observe } as unknown as Histogram;

    recordMetric({
      histogram,
      method: "GET",
      route: "/users",
      statusCode: 200,
      durationMs: 150,
    });

    expect(observe).toHaveBeenCalledWith(
      { method: "GET", route: "/users", status_code: "200" },
      0.15
    );
  });

  it("converts status code to string label", () => {
    const observe = vi.fn();
    const histogram = { observe } as unknown as Histogram;

    recordMetric({
      histogram,
      method: "POST",
      route: "/orders",
      statusCode: 500,
      durationMs: 300,
    });

    expect(observe).toHaveBeenCalledWith(
      expect.objectContaining({ status_code: "500" }),
      expect.any(Number)
    );
  });
});
