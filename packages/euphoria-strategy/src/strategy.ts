// ─── Euphoria Strategy Spec (deterministic, backtestable) ────────────────────
// Euphoria's market-psychology thesis expressed as PURE, reproducible rules over
// OHLCV — no LLM, no randomness, so it can be backtested and unit-tested. It
// mirrors the live agents' philosophy: Scout (momentum), Crowd (FOMO), Reverse
// (bubble risk).
//
// Thesis: the crowd buys euphoria and sells fear. So we ride healthy momentum but
// REFUSE to chase euphoric blow-off tops, and we step aside (to cash) when
// over-extension or fear takes over. Long-only, signal-driven.

import type { Candle, StrategyFeatures, BacktestSignal } from "./types";

/** Candles needed before the first signal can be computed. */
export const WARMUP = 14;

/** Clamp a number into [min, max] (defaults to a 0-100 score range). */
export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / from) * 100;
}

/**
 * Derive the strategy's three psychology proxies from a candle window. The LAST
 * candle in `window` is "today"; earlier candles are the lookback context.
 */
export function computeFeatures(window: Candle[]): StrategyFeatures {
  const n = window.length;
  const today = window[n - 1];
  const closes = window.map((c) => c.close);
  const volumes = window.map((c) => c.volume);

  // Run-up over up to 7 days.
  const back = Math.min(7, n - 1);
  const runup = pctChange(closes[n - 1 - back], today.close);

  // Volume spike vs the window average.
  const avgVol = mean(volumes.slice(0, n - 1));
  const volSpike = avgVol > 0 ? today.volume / avgVol : 1;

  // Taker buy dominance, 0..1 (share of volume that was aggressive buying).
  const buyDom = today.volume > 0 ? today.takerBuyBase / today.volume : 0.5;

  // Deviation of price above the window moving average.
  const ma = mean(closes);
  const dev = pctChange(ma, today.close);

  const runupComp = clamp(runup * 4); // +25% / 7d -> 100
  const volComp = clamp((volSpike - 1) * 100); // 2x avg -> 100
  const buyComp = clamp(buyDom * 100);
  const devComp = clamp(dev * 3); // +33% above MA -> 100

  const fomo = clamp(0.5 * runupComp + 0.3 * volComp + 0.2 * buyComp);
  const bubble = clamp(0.6 * devComp + 0.4 * fomo);
  const momentum = clamp(0.6 * clamp(50 + runup * 2) + 0.4 * buyComp);

  return {
    momentum: Math.round(momentum),
    fomo: Math.round(fomo),
    bubble: Math.round(bubble),
  };
}

/**
 * Map features to a signal. Trend-following with a contrarian top, expressed as
 * crowd psychology — with hysteresis (enter > 55, exit < 42, hold between):
 *  • SELL  — risk-off: a euphoric blow-off (high FOMO + high bubble) OR a broken
 *            trend / crowd fear (momentum collapses). Move to cash.
 *  • BUY   — healthy momentum without euphoria: trending, not over-extended.
 *  • WATCH — the dead band: hold the current position (or stay flat).
 */
export function signalFor(f: StrategyFeatures): BacktestSignal {
  if ((f.fomo >= 75 && f.bubble >= 70) || f.momentum <= 42) return "SELL";
  if (f.momentum >= 55 && f.bubble <= 60 && f.fomo >= 30) return "BUY";
  return "WATCH";
}
