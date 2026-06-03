import { describe, it, expect, vi } from "vitest";
import { shouldFail } from "./simulateError";

describe("shouldFail", () => {
  it("returns true when random is below error rate", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.04);
    expect(shouldFail(0.05)).toBe(true);
  });

  it("returns false when random equals error rate", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.05);
    expect(shouldFail(0.05)).toBe(false);
  });

  it("returns false when random is above error rate", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    expect(shouldFail(0.05)).toBe(false);
  });

  it("always returns false for rate zero", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(shouldFail(0)).toBe(false);
  });
});
