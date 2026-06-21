export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    quoteVolume: number;
    trades: number;
    takerBuyBase: number;
}
export type BacktestSignal = "BUY" | "SELL" | "WATCH";
/** Deterministic features derived from a candle window — the strategy's inputs. */
export interface StrategyFeatures {
    momentum: number;
    fomo: number;
    bubble: number;
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
    equity: number;
    buyHold: number;
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
//# sourceMappingURL=types.d.ts.map