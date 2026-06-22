import type { Candle, StrategyFeatures, BacktestSignal } from "./types";
/** Candles needed before the first signal can be computed. */
export declare const WARMUP = 14;
/** Clamp a number into [min, max] (defaults to a 0-100 score range). */
export declare function clamp(n: number, min?: number, max?: number): number;
/**
 * Derive the strategy's three psychology proxies from a candle window. The LAST
 * candle in `window` is "today"; earlier candles are the lookback context.
 */
export declare function computeFeatures(window: Candle[]): StrategyFeatures;
/**
 * Map features to a signal. Trend-following with a contrarian top, expressed as
 * crowd psychology — with hysteresis (enter > 55, exit < 42, hold between):
 *  • SELL  — risk-off: a euphoric blow-off (high FOMO + high bubble) OR a broken
 *            trend / crowd fear (momentum collapses). Move to cash.
 *  • BUY   — healthy momentum without euphoria: trending, not over-extended.
 *  • WATCH — the dead band: hold the current position (or stay flat).
 */
export declare function signalFor(f: StrategyFeatures): BacktestSignal;
//# sourceMappingURL=strategy.d.ts.map