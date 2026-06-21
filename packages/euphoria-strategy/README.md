# euphoria-strategy

> The deterministic, backtestable **Strategy Skill** that powers [Euphoria](https://github.com/your-org/euphoria) — built for **BNB Hack: AI Trading Agent Edition** (Track 2 — Strategy Skills).

Euphoria's thesis is simple: **the crowd buys euphoria and sells fear.** This package turns that thesis into a *pure, reproducible* trading strategy over OHLCV data — no LLM, no randomness — so it can be backtested and unit-tested. It is the distilled, shippable core of Euphoria's multi-agent system (Scout → momentum, Crowd → FOMO, Reverse → bubble risk).

- 🧮 **Deterministic** — same candles in, same signals out. Reproducible by design.
- 📊 **Backtestable** — ships a backtest engine with returns, drawdown, win-rate, and Sharpe vs buy & hold.
- 🪶 **Zero dependencies** — pure TypeScript, works with any OHLCV source (Binance, CoinMarketCap, etc.).

## Install

```bash
npm install euphoria-strategy
```

## Usage

```ts
import { runBacktest, signalFor, computeFeatures, WARMUP, type Candle } from "euphoria-strategy";

// Bring your own daily OHLCV candles (oldest → newest).
const candles: Candle[] = await loadCandles("BTCUSDT"); // from Binance, CMC, etc.

// Backtest the strategy vs buy & hold.
const result = runBacktest("BTC", candles);
console.log(result.totalReturnPct, result.buyHoldReturnPct, result.maxDrawdownPct);

// Or get a live signal for the latest window:
const features = computeFeatures(candles.slice(-(WARMUP + 1)));
const signal = signalFor(features); // "BUY" | "SELL" | "WATCH"
```

## The strategy spec

Three psychology proxies are derived deterministically from each candle window:

| Feature | Meaning | Derived from |
|---|---|---|
| `momentum` | trend strength | 7-day run-up + taker buy dominance |
| `fomo` | crowd excitement | run-up + volume spike + buy dominance |
| `bubble` | over-extension / reversal risk | deviation above MA + fomo |

Signal rules (long-only, with hysteresis to avoid whipsaw):

- **BUY** — `momentum ≥ 55` and `bubble ≤ 60` and `fomo ≥ 30` (healthy trend, not over-extended)
- **SELL** (risk-off) — `momentum ≤ 42` (broken trend / crowd fear) **or** `fomo ≥ 75 && bubble ≥ 70` (euphoric blow-off). Move to cash.
- **WATCH** — the 42–55 dead band: hold the current position.

## API

- `runBacktest(symbol, candles): BacktestResult`
- `computeFeatures(window): StrategyFeatures`
- `signalFor(features): "BUY" | "SELL" | "WATCH"`
- `clamp(n, min?, max?)`, `WARMUP`
- Types: `Candle`, `StrategyFeatures`, `BacktestSignal`, `BacktestTrade`, `BacktestPoint`, `BacktestResult`

## Disclaimer

Research/educational signals only — **not financial advice.** Past performance does not predict future results.

## License

MIT
