import { describe, it, expect } from "vitest";
import { formatLogEntry } from "./formatLogEntry";

describe("formatLogEntry", () => {
  it("returns a JSON string with all expected fields", () => {
    const entry = formatLogEntry({
      level: "info",
      method: "GET",
      route: "/users",
      statusCode: 200,
      durationMs: 42,
    });
    const parsed = JSON.parse(entry) as Record<string, unknown>;
    expect(parsed.level).toBe("info");
    expect(parsed.method).toBe("GET");
    expect(parsed.route).toBe("/users");
    expect(parsed.status_code).toBe(200);
    expect(parsed.duration_ms).toBe(42);
    expect(typeof parsed.ts).toBe("string");
  });

  it("includes error message when provided", () => {
    const entry = formatLogEntry({
      level: "error",
      method: "POST",
      route: "/orders",
      statusCode: 500,
      durationMs: 10,
      errorMessage: "internal server error",
    });
    const parsed = JSON.parse(entry) as Record<string, unknown>;
    expect(parsed.error).toBe("internal server error");
  });

  it("omits error field when not provided", () => {
    const entry = formatLogEntry({
      level: "info",
      method: "GET",
      route: "/",
      statusCode: 200,
      durationMs: 5,
    });
    const parsed = JSON.parse(entry) as Record<string, unknown>;
    expect("error" in parsed).toBe(false);
  });
});
