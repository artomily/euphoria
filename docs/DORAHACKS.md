# Euphoria — Trade Market Emotions, Not Charts

**Hackathon:** BNB Hack: AI Trading Agent Edition (CoinMarketCap × Trust Wallet × BNB Chain)
**Track:** 2 — Strategy Skills
**Sponsor capability used:** CoinMarketCap (market data)

> **One line:** Euphoria turns crowd emotion into a deterministic, backtestable BNB Chain trading strategy — it beats buy & hold with 2–4× smaller drawdowns by going to cash when the crowd gets euphoric or fearful.

---

## 1. Problem

Retail traders on BNB Chain don't blow up because they lack charts. They blow up because they **buy euphoria and sell fear** — the single most expensive, most repeatable mistake in crypto.

Every tool on the market measures *price*: RSI, MACD, candlesticks, order books. **None of them measure the emotion driving that price.** The one edge that actually predicts tops and bottoms — knowing when the crowd is over-extended — has no instrument. Traders feel it in their gut and act too late.

That's the gap: **emotion is the strongest signal in crypto, and it's the one nobody has instrumented.**

## 2. Solution

Euphoria is a **market-psychology engine** that quantifies crowd emotion and converts it into actionable BUY / SELL / WATCH signals.

It does this two ways:

- **Live, for any token** — a five-agent AI pipeline reads the market, names the narrative, scores the FOMO, checks for a bubble, and delivers a reasoned verdict you can trace end-to-end. No black box.
- **Reproducibly, as a Strategy Skill** — the same thesis distilled into a pure, deterministic rule set you can backtest, unit-test, and ship. This is the Track-2 deliverable: [`euphoria-strategy`](../packages/euphoria-strategy), a zero-dependency npm package.

> The rule in one sentence: **ride healthy momentum; step aside to cash the moment the crowd turns euphoric or fearful.**

## 3. Innovation

What makes Euphoria different from "another GPT-wrapper trading bot":

- **Emotion as the primary signal, not a sentiment footnote.** FOMO, narrative, and bubble-risk *are* the strategy — not a sprinkle on top of RSI.
- **A debate, not a single prompt.** A bull agent (Crowd) and a bear agent (Reverse) argue in parallel; an independent Judge synthesizes the verdict. You see *both sides* of every call.
- **LLM insight, deterministic execution.** The live product uses LLMs for nuance, but the shippable strategy is **pure and reproducible** — same candles in, same signals out — so it can be backtested and trusted. Most "AI strategies" can't be replayed; ours can.
- **Fully traceable.** Every score is attributed to its data source and Zod-validated. Agents degrade gracefully and never break the UI.

## 4. Architecture

```
                       POST /api/analyze
                              │
        ┌─────────────────────────────────────────────┐
        │                Orchestrator                  │
        └─────────────────────────────────────────────┘
                              │
   Scout ──▶ Narrative ──▶ ( Crowd  ∥  Reverse ) ──▶ Judge ──▶ verdict
 (heuristic)    (pro)        (flash)   (flash)        (pro)
```

| Agent | Role | Tier |
|---|---|---|
| **Scout** | live market data → volume + momentum scores | heuristic (no LLM) |
| **Narrative** | *why* it's moving (AI / DeFi / Memecoin / RWA …) + catalysts | pro |
| **Crowd** | FOMO score 0–100 (calm → euphoria) | flash |
| **Reverse** | the contrarian: bubble probability + red flags | flash |
| **Judge** | synthesizes everything into **BUY / SELL / WATCH** + reasoning | pro |

- **Next.js 16** (App Router, Server Components), TypeScript strict, **fully serverless** on Vercel.
- **Data:** CoinMarketCap (primary market read — sponsor capability), DexScreener (on-chain DEX flow), Binance klines (backtest history).
- **LLM gateway** abstracted in `lib/llm.ts` (OpenAI-compatible) — provider-agnostic, Zod-validated structured output, neutral fallbacks on failure.
- **Strategy Skill** lives in `packages/euphoria-strategy` — pure functions, zero dependencies, independently publishable.

## 5. Live on / where to run it

Euphoria is **read-only** — it analyzes markets and never touches user funds, so there is **no on-chain contract or transaction surface** (and no private-key handling). It's "live" in three places:

- **Web app (live demo):** 〈your Vercel URL — e.g. https://euphoria.vercel.app〉
- **Strategy Skill (npm package):** [`packages/euphoria-strategy`](../packages/euphoria-strategy) — `runBacktest()` / `signalFor()`
- **In-app backtester:** `/backtest` UI and `GET /api/backtest?symbol=CAKE`, running the strategy over live historical candles
- **Target network:** BNB Chain (token universe + DEX data)

```ts
import { runBacktest, signalFor } from "euphoria-strategy";
const result = runBacktest("BTC", candles); // returns, drawdown, win-rate, Sharpe vs buy & hold
```

## 6. Where we are now

Shipped and working today — not slideware:

- ✅ Full **5-agent pipeline** with real LLM verdicts on live BNB Chain market data.
- ✅ **`euphoria-strategy`** npm package — zero-dependency, deterministic, **unit-tested** (Vitest).
- ✅ **Backtest** UI + API running the strategy on live history.
- ✅ `npm run lint && npm run test && npm run build` — all green.

**Does it actually work?** Backtested on daily candles over a recent ~6-month window, the strategy preserved capital by stepping aside before crashes — **beating buy & hold on every BNB-ecosystem asset tested, with 2–4× smaller drawdowns.** *(Reproduce live at `/backtest`; figures move with daily data.)*

| Asset | Strategy | Buy & Hold | Max Drawdown |
|---|---|---|---|
| BTC | **+6%** | −32% | 11% |
| ETH | **+2%** | −47% | 13% |
| SOL | **+2%** | −49% | 16% |
| CAKE | **−11%** | −33% | 27% |
| BNB | **−16%** | −38% | 22% |

## 7. The ambition

Euphoria's bet: **market psychology becomes a first-class data layer for crypto — like price and volume are today.**

- **Near term:** deeper CMC Agent Hub signals (market regime, liquidity, risk flags); persist analyses and a live **FOMO Radar** across trending narratives.
- **Mid term:** real-time signal streaming, saved watchlists, portfolio-level emotion tracking, and a public **Strategy Skill marketplace** where the `euphoria-strategy` engine is one of many.
- **Long term:** optional Trust Wallet Agent Kit execution (also qualifying for Track 1), social/on-chain behavioral signals, and an institutional-grade psychology API.

The first AI platform that trades emotion as a primary signal.

## 8. Team

| Name | Role | Links |
|---|---|---|
| 〈Name〉 | 〈Founder / Eng / etc.〉 | 〈GitHub · X · LinkedIn〉 |
| 〈Name〉 | 〈Role〉 | 〈links〉 |

> _Fill in before submission. Keep it short — judges scan for relevant builder/trading/ML background._

## 9. Advisors & partners

- **Advisors:** 〈Name — one-line credibility, or remove this section if none〉
- **Sponsor capability:** CoinMarketCap (market data) — core to Scout + backtest history.
- **Ecosystem:** BNB Chain (target network), Trust Wallet (planned Agent Kit execution).
- **Infrastructure:** Vercel, Supabase, Privy.

> _If you have no formal advisors/partners yet, say "Sponsor & ecosystem integrations" instead of inventing relationships — judges check._

## 10. Links

- **Live demo:** 〈Vercel URL〉
- **Demo video:** [`demo/euphoria-demo.mp4`](../demo/euphoria-demo.mp4)
- **GitHub repo:** https://github.com/artomily/euphoria
- **Strategy Skill (npm package):** [`packages/euphoria-strategy`](../packages/euphoria-strategy)
- **Architecture deep-dive:** [`docs/ARCHITECTURE.md`](ARCHITECTURE.md)
- **Run locally:** `cp .env.example .env.local` → add keys → `npm run dev`

---

## ⚠️ Disclaimer

Euphoria outputs **psychological signals for research and education — not financial advice.** Past performance does not predict future results.
