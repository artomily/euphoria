# Euphoria — Trade Market Emotions, Not Charts

**Hackathon:** BNB Hack: AI Trading Agent Edition (CoinMarketCap × Trust Wallet × BNB Chain)
**Track:** 2 — Strategy Skills
**Sponsor capability:** CoinMarketCap (market data)

---

## ⚡ One-liner

Euphoria is a multi-agent **market-psychology engine** for BNB Chain that turns crowd emotion into a **deterministic, backtestable trading strategy** — replacing RSI and candlesticks with FOMO, narrative, and bubble-risk signals.

## 🎯 The Problem

Retail traders on BNB Chain don't lose money because they lack charts — they lose because they **buy euphoria and sell fear**. Every existing tool shows *price*. None quantifies the *emotion* driving that price. The most reliable edge in crypto — knowing when the crowd is over-extended — has no instrument.

## 💡 What We Built

**1. A five-agent psychology pipeline** (`POST /api/analyze`). Ask about any BNB Chain token and:

| Agent | Role | Tier |
|---|---|---|
| **Scout** | live market data → volume + momentum scores | heuristic (no LLM) |
| **Narrative** | *why* it's moving (AI / DeFi / Memecoin / RWA …) + catalysts | pro |
| **Crowd** | FOMO score 0–100 (calm → euphoria) | flash |
| **Reverse** | the contrarian: bubble probability + red flags | flash |
| **Judge** | synthesizes all into **BUY / SELL / WATCH** + reasoning | pro |

Crowd (bull) and Reverse (bear) run in parallel and are shown as a **debate**; the Judge delivers the verdict. Every signal is traced to its source — no black box. Outputs are Zod-validated; agents degrade gracefully and never break the UI.

**2. A backtestable Strategy Skill** (the Track-2 deliverable) — the same thesis as a **pure, reproducible** rule set, shipped as a zero-dependency npm package: [`euphoria-strategy`](../packages/euphoria-strategy).

> Ride healthy momentum; move to cash when the crowd turns **euphoric or fearful**.

```ts
import { runBacktest, signalFor } from "euphoria-strategy";
const result = runBacktest("BTC", candles); // returns, drawdown, win-rate, Sharpe vs buy & hold
```

## 📈 Does it work? (backtest vs buy & hold)

Replayed on daily candles over a recent ~6-month window. The strategy **preserved capital by stepping aside before crashes** — beating buy & hold on every BNB-ecosystem asset tested, with 2–4× smaller drawdowns. *(Reproduce live at `/backtest` — figures move with daily data.)*

| Asset | Strategy | Buy & Hold | Max Drawdown |
|---|---|---|---|
| BTC | **+6%** | −32% | 11% |
| ETH | **+2%** | −47% | 13% |
| SOL | **+2%** | −49% | 16% |
| CAKE | **−11%** | −33% | 27% |
| BNB | **−16%** | −38% | 22% |

The strategy is **unit-tested** (Vitest) and deterministic — same candles in, same signals out.

## 🛠️ Tech & Stack

- **Next.js 16** (App Router, Server Components), TypeScript strict, serverless.
- **CoinMarketCap** as the primary market read (sponsor capability), DexScreener for on-chain DEX flow, Binance klines for backtest history.
- **LLM gateway** abstracted in `lib/llm.ts` (OpenAI-compatible) — provider-agnostic, Zod-validated structured output, neutral fallbacks.
- **`euphoria-strategy`** npm package — the publishable, reusable strategy skill.

## ✅ Live now

- Full 5-agent pipeline with **real LLM verdicts** + live BNB Chain market data.
- `/backtest` UI + `GET /api/backtest` running the strategy on live history.
- Publishable `euphoria-strategy` package, unit-tested. `npm run lint && npm run test && npm run build` all green.

## 🗺️ Roadmap

- Deeper CMC Agent Hub signals (market regime, liquidity, risk flags).
- Persist analyses + FOMO Radar across trending narratives (Supabase).
- Optional Trust Wallet Agent Kit execution → also qualify for Track 1.

## 🔗 Links

- **Demo video:** `demo/euphoria-demo.mp4`
- **Strategy Skill (npm):** `packages/euphoria-strategy`
- **Repo:** `<GitHub URL>`
- **Run locally:** `cp .env.example .env.local` → add keys → `npm run dev`

## ⚠️ Disclaimer

Euphoria outputs **psychological signals for research and education — not financial advice.** Past performance does not predict future results.
