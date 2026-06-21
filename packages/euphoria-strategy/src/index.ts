// euphoria-strategy — the deterministic, backtestable "Strategy Skill" that
// powers Euphoria (BNB Hack Track 2). Pure functions, zero dependencies.

export type {
  Candle,
  BacktestSignal,
  StrategyFeatures,
  BacktestTrade,
  BacktestPoint,
  BacktestResult,
} from "./types";

export { WARMUP, clamp, computeFeatures, signalFor } from "./strategy";
export { runBacktest } from "./engine";
