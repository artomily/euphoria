// Types for the deterministic strategy backtester (Track 2 — Strategy Skills).

export interface Candle {
  time: number; // open time, ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // base-asset volume
  quoteVolume: number; // quote (≈USD) volume
  trades: number;
  takerBuyBase: number; // taker buy base volume (buy-side pressure)
}

export type BacktestSignal = "BUY" | "SELL" | "WATCH";

/** Deterministic features derived from a candle window — the strategy's inputs. */
export interface StrategyFeatures {
  momentum: number; // 0-100
  fomo: number; // 0-100 — crowd-excitement proxy
  bubble: number; // 0-100 — over-extension / reversal risk proxy
}

export interface BacktestTrade {
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  returnPct: number;
}

export interface BacktestPoint {
  time: number;
  price: number;
  equity: number; // strategy equity, starts at 1
  buyHold: number; // buy & hold equity, starts at 1
  signal: BacktestSignal;
  fomo: number;
  inPosition: boolean;
}

export interface BacktestResult {
  symbol: string;
  candles: number;
  totalReturnPct: number;
  buyHoldReturnPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  trades: number;
  sharpe: number;
  series: BacktestPoint[];
  generatedAt: string;
}
