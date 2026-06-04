import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { simulateDelay } from "./simulateDelay";

describe("simulateDelay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after a delay within [min, max]", async () => {
    vi.spyOn(global, "setTimeout");
    const promise = simulateDelay(50, 100);
    vi.runAllTimers();
    await promise;
    const delay = (setTimeout as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as number;
    expect(delay).toBeGreaterThanOrEqual(50);
    expect(delay).toBeLessThanOrEqual(100);
  });

  it("works when min equals max", async () => {
    vi.spyOn(global, "setTimeout");
    const promise = simulateDelay(75, 75);
    vi.runAllTimers();
    await promise;
    const delay = (setTimeout as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as number;
    expect(delay).toBe(75);
  });
});
