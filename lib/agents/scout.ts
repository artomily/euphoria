// ─── Scout Agent ─────────────────────────────────────────────────────────────
// Pure, deterministic market scoring — NO LLM call. Scout fetches BNB Chain
// market data and turns it into two 0-100 signals (volume + momentum) that every
// downstream agent depends on. Because it's deterministic, the scoring functions
// below are the unit-test target (see CLAUDE.md § Testing).

import { fetchTokenMarketData, type TokenMarketData } from "@/lib/dexscreener";
import { fetchCmcMarketData } from "@/lib/cmc";
import type { ScoutInput, ScoutOutput } from "@/types/agents";

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Volume score (0-100) from turnover — 24h volume relative to market cap. A token
 * trading a large fraction of its cap in a day is "hot". 50% turnover maxes out.
 */
export function calculateVolumeScore(volume24h: number, marketCap: number): number {
  if (marketCap <= 0) {
    // No cap data — fall back to absolute volume on a log scale ($1M ≈ 50).
    if (volume24h <= 0) return 0;
    return clamp((Math.log10(volume24h) - 3) * 25);
  }
  const turnover = volume24h / marketCap;
  if (turnover <= 0) return 0;
  // Log scale tuned for on-chain DEX turnover (which understates true volume):
  // 0.1% ≈ 0, 1% ≈ 28, 10% ≈ 56, 100% ≈ 84. Bluechips land low-modest, while
  // hot/meme tokens (turnover ≥ 1) saturate near the top.
  return clamp((Math.log10(turnover) + 3) * 28);
}

/**
 * Momentum score (0-100) blending 24h price change (centered at 50) with buy-side
 * order-flow pressure. Flat price + balanced flow ≈ 50.
 */
export function calculateMomentumScore(
  priceChange24h: number,
  buys: number,
  sells: number,
): number {
  // Price component: -25%..+25% maps to 0..100, centered at 50.
  const priceComponent = clamp(50 + priceChange24h * 2);

  // Flow component: share of buys among trades, 0..100. Neutral 50 when unknown.
  const totalTrades = buys + sells;
  const flowComponent = totalTrades > 0 ? (buys / totalTrades) * 100 : 50;

  return clamp(priceComponent * 0.65 + flowComponent * 0.35);
}

function toOutput(
  data: TokenMarketData,
  source: ScoutOutput["data_source"],
): ScoutOutput {
  return {
    symbol: data.symbol,
    name: data.name,
    price: data.price,
    price_change_24h: data.price_change_24h,
    volume_24h: data.volume_24h,
    market_cap: data.market_cap,
    volume_score: Math.round(calculateVolumeScore(data.volume_24h, data.market_cap)),
    momentum_score: Math.round(
      calculateMomentumScore(data.price_change_24h, data.buys_24h, data.sells_24h),
    ),
    data_source: source,
  };
}

/**
 * Merge the two sources: CMC (the sponsor capability) is authoritative for
 * price / volume / market cap / 24h change; DexScreener supplies on-chain
 * order-flow (buys/sells) and liquidity that CMC quotes don't carry.
 */
function merge(cmc: TokenMarketData, dex: TokenMarketData): TokenMarketData {
  return {
    symbol: cmc.symbol,
    name: cmc.name || dex.name,
    address: dex.address || cmc.address,
    price: cmc.price || dex.price,
    price_change_24h: cmc.price_change_24h,
    volume_24h: cmc.volume_24h || dex.volume_24h,
    market_cap: cmc.market_cap || dex.market_cap,
    liquidity_usd: dex.liquidity_usd,
    buys_24h: dex.buys_24h,
    sells_24h: dex.sells_24h,
  };
}

/** Neutral output when no market data is available — keeps the pipeline alive. */
function neutralOutput(symbol: string): ScoutOutput {
  return {
    symbol: symbol.toUpperCase(),
    name: symbol.toUpperCase(),
    price: 0,
    price_change_24h: 0,
    volume_24h: 0,
    market_cap: 0,
    volume_score: 50,
    momentum_score: 50,
    data_source: "mock",
  };
}

export async function execute(input: ScoutInput): Promise<ScoutOutput> {
  // CMC (sponsor capability) and DexScreener in parallel; either can be null.
  const [cmc, dex] = await Promise.all([
    fetchCmcMarketData(input.symbol),
    fetchTokenMarketData(input.symbol),
  ]);

  if (cmc && dex) return toOutput(merge(cmc, dex), "cmc");
  if (cmc) return toOutput(cmc, "cmc");
  if (dex) return toOutput(dex, "dexscreener");
  return neutralOutput(input.symbol);
}
