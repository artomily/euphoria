"use strict";
// ─── Backtest Engine ─────────────────────────────────────────────────────────
// Replays the deterministic Euphoria strategy over historical candles and reports
// returns, drawdown, win rate, and Sharpe vs a buy-and-hold benchmark. Long-only:
// fully invested while in a position, flat otherwise. Close-to-close returns.
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBacktest = runBacktest;
const strategy_1 = require("./strategy");
function std(xs) {
    if (xs.length < 2)
        return 0;
    const m = xs.reduce((a, b) => a + b, 0) / xs.length;
    const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
    return Math.sqrt(v);
}
function runBacktest(symbol, candles) {
    const series = [];
    const trades = [];
    const dailyReturns = [];
    let equity = 1;
    let peak = 1;
    let maxDrawdown = 0;
    let inPosition = false;
    let entryPrice = 0;
    let entryTime = 0;
    const base = candles[strategy_1.WARMUP]?.close ?? candles[0]?.close ?? 1;
    for (let i = strategy_1.WARMUP; i < candles.length; i++) {
        const c = candles[i];
        // Realize the prior day's position over yesterday→today close.
        if (i > strategy_1.WARMUP) {
            const r = inPosition ? c.close / candles[i - 1].close - 1 : 0;
            equity *= 1 + r;
            dailyReturns.push(r);
        }
        // Decide today's signal from the window ending at today.
        const feats = (0, strategy_1.computeFeatures)(candles.slice(i - strategy_1.WARMUP, i + 1));
        const signal = (0, strategy_1.signalFor)(feats);
        // Act at today's close.
        if (signal === "BUY" && !inPosition) {
            inPosition = true;
            entryPrice = c.close;
            entryTime = c.time;
        }
        else if (signal === "SELL" && inPosition) {
            inPosition = false;
            trades.push({
                entryTime,
                entryPrice,
                exitTime: c.time,
                exitPrice: c.close,
                returnPct: ((c.close - entryPrice) / entryPrice) * 100,
            });
        }
        peak = Math.max(peak, equity);
        maxDrawdown = Math.max(maxDrawdown, (peak - equity) / peak);
        series.push({
            time: c.time,
            price: c.close,
            equity,
            buyHold: c.close / base,
            signal,
            fomo: feats.fomo,
            inPosition,
        });
    }
    // Mark any open position to market at the final close.
    if (inPosition && candles.length > strategy_1.WARMUP) {
        const last = candles[candles.length - 1];
        trades.push({
            entryTime,
            entryPrice,
            exitTime: last.time,
            exitPrice: last.close,
            returnPct: ((last.close - entryPrice) / entryPrice) * 100,
        });
    }
    const wins = trades.filter((t) => t.returnPct > 0).length;
    const sd = std(dailyReturns);
    const avg = dailyReturns.length
        ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
        : 0;
    const sharpe = sd > 0 ? (avg / sd) * Math.sqrt(365) : 0;
    const last = series[series.length - 1];
    return {
        symbol: symbol.toUpperCase(),
        candles: candles.length,
        totalReturnPct: (equity - 1) * 100,
        buyHoldReturnPct: last ? (last.buyHold - 1) * 100 : 0,
        maxDrawdownPct: maxDrawdown * 100,
        winRatePct: trades.length ? (wins / trades.length) * 100 : 0,
        trades: trades.length,
        sharpe,
        series,
        generatedAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=engine.js.map