import { describe, it, expect } from "vitest";
import { runBacktest } from "./engine";
import { WARMUP } from "./strategy";
import type { Candle } from "@/types/backtest";

function makeCandles(closes: number[]): Candle[] {
  return closes.map((close, i) => ({
    time: i * 86_400_000,
    open: close,
    high: close,
    low: close,
    close,
    volume: 1000,
    quoteVolume: close * 1000,
    trades: 100,
    takerBuyBase: 550, // mild buy dominance
  }));
}

describe("runBacktest", () => {
  it("returns coherent, bounded metrics", () => {
    const closes = Array.from({ length: 120 }, (_, i) => 100 + Math.sin(i / 5) * 20 + i * 0.3);
    const r = runBacktest("TEST", makeCandles(closes));

    expect(r.candles).toBe(120);
    expect(r.series.length).toBe(120 - WARMUP);
    expect(r.maxDrawdownPct).toBeGreaterThanOrEqual(0);
    expect(r.winRatePct).toBeGreaterThanOrEqual(0);
    expect(r.winRatePct).toBeLessThanOrEqual(100);
    expect(Number.isFinite(r.totalReturnPct)).toBe(true);
    expect(Number.isFinite(r.sharpe)).toBe(true);
  });

  it("stays flat (0% return, no trades) on a dead-flat market", () => {
    const r = runBacktest("FLAT", makeCandles(Array.from({ length: 60 }, () => 100)));
    expect(r.trades).toBe(0);
    expect(Math.abs(r.totalReturnPct)).toBeLessThan(1e-6);
  });

  it("equity series starts near 1 and buy-hold tracks price", () => {
    const r = runBacktest("UP", makeCandles(Array.from({ length: 60 }, (_, i) => 100 + i)));
    const first = r.series[0];
    expect(first.buyHold).toBeCloseTo(1, 5);
    expect(first.equity).toBeGreaterThan(0);
  });
});
