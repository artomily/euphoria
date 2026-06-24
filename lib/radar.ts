// ─── FOMO Radar — real market-derived narrative heat ─────────────────────────
// Each narrative is a basket of tokens. We fetch live market data for the basket
// (deepest-liquidity pair on any chain via DexScreener) and derive a
// deterministic 0-100 "heat" from real 24h momentum + traded volume. No LLM, no
// API key. Falls back to a baseline heat per narrative if nothing resolves, so
// the page never breaks.

const BASE_URL = process.env.DEXSCREENER_API_URL ?? "https://api.dexscreener.com";

interface DexSearchPair {
  chainId: string;
  baseToken: { symbol: string };
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
}

interface TokenSnapshot {
  symbol: string;
  change24h: number;
  volume24h: number;
}

export interface NarrativeHeat {
  /** Average 24h price change across the resolved basket (%). */
  change24h: number;
  /** Derived crowd-energy score, 0-100. */
  heat: number;
  trend: "up" | "down";
  /** False when no token resolved and we fell back to the baseline heat. */
  live: boolean;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

/** Deepest-liquidity live snapshot for a symbol, across all chains. */
async function fetchTokenSnapshot(symbol: string): Promise<TokenSnapshot | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(symbol)}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 600 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { pairs?: DexSearchPair[] };
    const target = symbol.trim().toUpperCase();
    const matches = (data.pairs ?? []).filter(
      (p) => p.baseToken?.symbol?.toUpperCase() === target,
    );
    if (matches.length === 0) return null;

    // Pick the deepest-liquidity pair (least likely to be a spoof) for the 24h
    // change; sum volume across the matched pairs.
    const best = matches.reduce((a, b) =>
      (b.liquidity?.usd ?? 0) > (a.liquidity?.usd ?? 0) ? b : a,
    );
    return {
      symbol: target,
      change24h: best.priceChange?.h24 ?? 0,
      volume24h: matches.reduce((acc, p) => acc + (p.volume?.h24 ?? 0), 0),
    };
  } catch {
    return null;
  }
}

/**
 * Compute live heat for one narrative basket. `baselineHeat` is the static
 * fallback used only when no token in the basket resolves.
 */
export async function computeNarrativeHeat(
  tokens: string[],
  baselineHeat: number,
): Promise<NarrativeHeat> {
  const snaps = (await Promise.all(tokens.map(fetchTokenSnapshot))).filter(
    (s): s is TokenSnapshot => s !== null,
  );

  if (snaps.length === 0) {
    return { change24h: 0, heat: baselineHeat, trend: "down", live: false };
  }

  const avgChange = snaps.reduce((a, s) => a + s.change24h, 0) / snaps.length;
  const totalVol = snaps.reduce((a, s) => a + s.volume24h, 0);

  // Momentum: -25%..+25% → 0..100, centered at 50.
  const momentum = clamp(50 + avgChange * 2);
  // Volume on a log scale: $10k ≈ 0, $1M ≈ 36, $100M ≈ 72, $1B+ ≈ 90.
  const volScore = totalVol > 0 ? clamp((Math.log10(totalVol) - 4) * 18) : 0;
  const heat = Math.round(momentum * 0.6 + volScore * 0.4);
  // Round first so the arrow direction always agrees with the displayed %.
  const change24h = Math.round(avgChange * 10) / 10 || 0;

  return {
    change24h,
    heat,
    trend: change24h >= 0 ? "up" : "down",
    live: true,
  };
}
