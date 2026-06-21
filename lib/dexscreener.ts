// ─── DexScreener API Client ──────────────────────────────────────────────────
// Primary market-data source for BNB Chain tokens. No API key required.
// Docs: https://docs.dexscreener.com/api/reference
//
// We use the search endpoint, filter to BNB Chain ("bsc"), and pick the pair with
// the deepest liquidity as the canonical read for a symbol.

const BASE_URL = process.env.DEXSCREENER_API_URL ?? "https://api.dexscreener.com";

export interface TokenMarketData {
  symbol: string;
  name: string;
  /** BEP-20 contract address of the base token */
  address: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  liquidity_usd: number;
  buys_24h: number;
  sells_24h: number;
}

// Minimal shape of the fields we read from a DexScreener pair.
interface DexPair {
  chainId: string;
  baseToken: { address: string; name: string; symbol: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  marketCap?: number;
  fdv?: number;
  txns?: { h24?: { buys?: number; sells?: number } };
}

/**
 * Fetch the canonical BNB Chain market read for a token symbol.
 * Returns null when the token isn't found or the API is unreachable — callers
 * (Scout) degrade to neutral/mock behaviour rather than throwing.
 */
export async function fetchTokenMarketData(
  symbol: string,
): Promise<TokenMarketData | null> {
  try {
    const url = `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(symbol)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Cache identical lookups for 60s to dedup the expensive analyze path.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { pairs?: DexPair[] };
    const pairs = data.pairs ?? [];

    const target = symbol.trim().toUpperCase();
    const bscPairs = pairs.filter(
      (p) =>
        p.chainId === "bsc" &&
        p.baseToken?.symbol?.toUpperCase() === target,
    );
    if (bscPairs.length === 0) return null;

    // Price/cap come from the deepest-liquidity pool (most trustworthy single
    // read), but volume, trade counts, and liquidity are summed across ALL pools
    // — a token usually trades on many pairs, so one pool understates activity.
    const best = bscPairs.reduce((a, b) =>
      (b.liquidity?.usd ?? 0) > (a.liquidity?.usd ?? 0) ? b : a,
    );

    const sum = (pick: (p: DexPair) => number | undefined) =>
      bscPairs.reduce((acc, p) => acc + (pick(p) ?? 0), 0);

    return {
      symbol: best.baseToken.symbol.toUpperCase(),
      name: best.baseToken.name,
      address: best.baseToken.address,
      price: Number(best.priceUsd ?? 0),
      price_change_24h: best.priceChange?.h24 ?? 0,
      volume_24h: sum((p) => p.volume?.h24),
      market_cap: best.marketCap ?? best.fdv ?? 0,
      liquidity_usd: sum((p) => p.liquidity?.usd),
      buys_24h: sum((p) => p.txns?.h24?.buys),
      sells_24h: sum((p) => p.txns?.h24?.sells),
    };
  } catch (error) {
    console.error("[dexscreener] fetch failed:", error);
    return null;
  }
}
