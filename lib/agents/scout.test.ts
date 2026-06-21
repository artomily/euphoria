import { describe, it, expect } from "vitest";
import { calculateVolumeScore, calculateMomentumScore } from "./scout";

describe("calculateVolumeScore", () => {
  it("clamps into 0-100", () => {
    expect(calculateVolumeScore(1e12, 1000)).toBeLessThanOrEqual(100);
    expect(calculateVolumeScore(0, 1000)).toBe(0);
  });

  it("returns 0 when there is no volume", () => {
    expect(calculateVolumeScore(0, 0)).toBe(0);
  });

  it("rises with turnover (more daily volume vs cap scores higher)", () => {
    const low = calculateVolumeScore(1_000_000, 1_000_000_000); // 0.1% turnover
    const high = calculateVolumeScore(100_000_000, 1_000_000_000); // 10% turnover
    expect(high).toBeGreaterThan(low);
  });
});

describe("calculateMomentumScore", () => {
  it("is ~50 when flat and order flow is balanced", () => {
    expect(calculateMomentumScore(0, 100, 100)).toBeGreaterThanOrEqual(49);
    expect(calculateMomentumScore(0, 100, 100)).toBeLessThanOrEqual(51);
  });

  it("rewards positive price change and buy-side flow", () => {
    const bullish = calculateMomentumScore(15, 300, 100);
    const bearish = calculateMomentumScore(-15, 100, 300);
    expect(bullish).toBeGreaterThan(bearish);
    expect(bullish).toBeLessThanOrEqual(100);
    expect(bearish).toBeGreaterThanOrEqual(0);
  });

  it("treats unknown order flow as neutral", () => {
    expect(calculateMomentumScore(0, 0, 0)).toBe(50);
  });
});
