import { describe, it, expect } from "vitest";
import { parseErrorRate, errorRate } from "./errorRate";

describe("parseErrorRate", () => {
  it("returns the parsed value for a valid number", () => {
    expect(parseErrorRate("0.2")).toBe(0.2);
  });

  it("returns the default fallback when value is undefined", () => {
    expect(parseErrorRate(undefined)).toBe(0.05);
  });

  it("returns a custom fallback when value is undefined", () => {
    expect(parseErrorRate(undefined, 0.5)).toBe(0.5);
  });

  it("returns the fallback when value is not a number", () => {
    expect(parseErrorRate("abc")).toBe(0.05);
    expect(parseErrorRate("abc", 0.3)).toBe(0.3);
  });

  it("exposes a numeric errorRate resolved from the environment", () => {
    expect(typeof errorRate).toBe("number");
    expect(Number.isNaN(errorRate)).toBe(false);
  });
});
