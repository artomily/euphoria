import { describe, it, expect } from "vitest";
import { computeFeatures, signalFor, WARMUP } from "./strategy";
import type { Candle } from "@/types/backtest";

function candle(close: number, volume: number, buyShare = 0.5): Candle {
  return {
    time: 0,
    open: close,
    high: close,
    low: close,
    close,
    volume,
    quoteVolume: close * volume,
    trades: 100,
    takerBuyBase: volume * buyShare,
  };
}

/** A window of `WARMUP + 1` candles following a price/volume path. */
function window(path: Array<{ close: number; volume: number; buyShare?: number }>): Candle[] {
  return path.map((p) => candle(p.close, p.volume, p.buyShare));
}

describe("signalFor", () => {
  it("SELLs on euphoric blow-off (high fomo + high bubble)", () => {
    expect(signalFor({ momentum: 80, fomo: 85, bubble: 80 })).toBe("SELL");
  });

  it("BUYs on healthy momentum without euphoria", () => {
    expect(signalFor({ momentum: 65, fomo: 50, bubble: 40 })).toBe("BUY");
  });

  it("SELLs (risk-off) when momentum collapses", () => {
    expect(signalFor({ momentum: 30, fomo: 20, bubble: 20 })).toBe("SELL");
  });

  it("WATCHes in the dead band (hold current position)", () => {
    expect(signalFor({ momentum: 50, fomo: 50, bubble: 50 })).toBe("WATCH");
  });

  it("does not BUY when already over-extended (bubble high)", () => {
    expect(signalFor({ momentum: 70, fomo: 60, bubble: 65 })).toBe("WATCH");
  });
});

describe("computeFeatures", () => {
  it("produces high FOMO on a sharp run-up with a volume spike", () => {
    const flat = Array.from({ length: WARMUP }, () => ({ close: 100, volume: 1000 }));
    const spike = window([...flat, { close: 140, volume: 5000, buyShare: 0.8 }]);
    const f = computeFeatures(spike);
    expect(f.fomo).toBeGreaterThan(70);
    expect(f.momentum).toBeGreaterThan(50);
  });

  it("produces low FOMO on a flat, quiet market", () => {
    const f = computeFeatures(
      window(Array.from({ length: WARMUP + 1 }, () => ({ close: 100, volume: 1000 }))),
    );
    expect(f.fomo).toBeLessThan(40);
  });

  it("keeps every feature within 0-100", () => {
    const f = computeFeatures(
      window([
        ...Array.from({ length: WARMUP }, () => ({ close: 10, volume: 100 })),
        { close: 1000, volume: 1_000_000, buyShare: 1 },
      ]),
    );
    for (const v of [f.fomo, f.bubble, f.momentum]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});
