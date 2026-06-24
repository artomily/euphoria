// ─── DexScreener API Client ──────────────────────────────────────────────────
// Primary market-data source for BNB Chain tokens. No API key required.
// Docs: https://docs.dexscreener.com/api/reference
//
// Resolution strategy (two paths):
//   1. Majors whose typed symbol ≠ on-chain symbol (native BNB trades as WBNB,
//      BTC as BTCB) or whose `search` results are noisy are resolved by their
//      canonical BNB-Chain contract address — the only way to guarantee the
//      real, deepest-liquidity read. See BSC_TOKEN_ADDRESSES.
//   2. Every other token falls back to the `search` endpoint, filtered to BNB
//      Chain ("bsc"). This keeps the long tail open — any BSC token is analyzable.

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

// Canonical BNB-Chain (Binance-Peg) contract addresses for popular tokens. The
// key is what a user types; the value is the deepest-liquidity base token on
// BSC. Native BNB → WBNB, BTC → BTCB, etc. All verified to carry live pools.
const BSC_TOKEN_ADDRESSES: Record<string, string> = {
  BNB:   "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
  WBNB:  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  BTC:   "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // BTCB
  BTCB:  "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
  ETH:   "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  WETH:  "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  CAKE:  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  USDT:  "0x55d398326f99059fF775485246999027B3197955",
  XRP:   "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
  ADA:   "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
  DOGE:  "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
  SOL:   "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF",
  DOT:   "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
  LINK:  "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
  LTC:   "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
  TRX:   "0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3",
  TWT:   "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
  FLOKI: "0xfb5B838b6cfEEdC2873aB27866079AC55363D37E",
};

/**
 * Collapse a set of BNB-Chain pairs into a single canonical read. Price, cap and
 * 24h change come from the deepest-liquidity pool (most trustworthy single
 * read); volume, liquidity and trade counts are summed across ALL pools — a
 * token usually trades on many pairs, so one pool understates activity.
 */
function aggregatePairs(pairs: DexPair[], displaySymbol?: string): TokenMarketData {
  const best = pairs.reduce((a, b) =>
    (b.liquidity?.usd ?? 0) > (a.liquidity?.usd ?? 0) ? b : a,
  );
  const sum = (pick: (p: DexPair) => number | undefined) =>
    pairs.reduce((acc, p) => acc + (pick(p) ?? 0), 0);

  return {
    symbol: (displaySymbol ?? best.baseToken.symbol).toUpperCase(),
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
}

/** Resolve a major by its canonical BNB-Chain contract address. */
async function fetchByAddress(
  displaySymbol: string,
  address: string,
): Promise<TokenMarketData | null> {
  try {
    const res = await fetch(`${BASE_URL}/tokens/v1/bsc/${address}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    // This endpoint returns a flat array of pairs involving the token.
    const pairs = (await res.json()) as DexPair[];
    const addr = address.toLowerCase();
    const owned = (Array.isArray(pairs) ? pairs : []).filter(
      (p) => p.baseToken?.address?.toLowerCase() === addr,
    );
    if (owned.length === 0) return null;

    // Keep the user's typed symbol for display (e.g. "BNB", not "WBNB").
    return aggregatePairs(owned, displaySymbol);
  } catch (error) {
    console.error("[dexscreener] address fetch failed:", error);
    return null;
  }
}

/** Resolve any token by searching DexScreener and filtering to BNB Chain. */
async function fetchBySearch(symbol: string): Promise<TokenMarketData | null> {
  try {
    const url = `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(symbol)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { pairs?: DexPair[] };
    const pairs = data.pairs ?? [];

    const target = symbol.trim().toUpperCase();
    const bscPairs = pairs.filter(
      (p) =>
        p.chainId === "bsc" && p.baseToken?.symbol?.toUpperCase() === target,
    );
    if (bscPairs.length === 0) return null;

    return aggregatePairs(bscPairs);
  } catch (error) {
    console.error("[dexscreener] search failed:", error);
    return null;
  }
}

/**
 * Fetch the canonical BNB Chain market read for a token symbol. Tries the
 * address map first (correct for majors like BNB/BTC/ETH), then falls back to
 * search for the long tail. Returns null when nothing matches or the API is
 * unreachable — callers (Scout) degrade to neutral/mock rather than throwing.
 */
export async function fetchTokenMarketData(
  symbol: string,
): Promise<TokenMarketData | null> {
  const target = symbol.trim().toUpperCase();

  const address = BSC_TOKEN_ADDRESSES[target];
  if (address) {
    const byAddress = await fetchByAddress(target, address);
    if (byAddress) return byAddress;
  }

  return fetchBySearch(target);
}

// ─── Trending (live featured tokens) ─────────────────────────────────────────

// The canonical (non-alias) symbol→address universe used to surface a live,
// volume-ranked set of featured tokens — so the dashboard chips reflect real
// market activity instead of a hardcoded list.
const TRENDING_UNIVERSE: { symbol: string; address: string }[] = [
  { symbol: "BNB",   address: BSC_TOKEN_ADDRESSES.BNB },
  { symbol: "BTC",   address: BSC_TOKEN_ADDRESSES.BTC },
  { symbol: "ETH",   address: BSC_TOKEN_ADDRESSES.ETH },
  { symbol: "SOL",   address: BSC_TOKEN_ADDRESSES.SOL },
  { symbol: "XRP",   address: BSC_TOKEN_ADDRESSES.XRP },
  { symbol: "CAKE",  address: BSC_TOKEN_ADDRESSES.CAKE },
  { symbol: "DOGE",  address: BSC_TOKEN_ADDRESSES.DOGE },
  { symbol: "ADA",   address: BSC_TOKEN_ADDRESSES.ADA },
  { symbol: "LINK",  address: BSC_TOKEN_ADDRESSES.LINK },
  { symbol: "DOT",   address: BSC_TOKEN_ADDRESSES.DOT },
  { symbol: "LTC",   address: BSC_TOKEN_ADDRESSES.LTC },
  { symbol: "TRX",   address: BSC_TOKEN_ADDRESSES.TRX },
  { symbol: "FLOKI", address: BSC_TOKEN_ADDRESSES.FLOKI },
  { symbol: "TWT",   address: BSC_TOKEN_ADDRESSES.TWT },
];

export interface TrendingToken {
  symbol: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
}

/**
 * Fetch the featured-token universe in one batched call, ranked by live 24h
 * volume. Returns [] on failure so the UI can fall back to a static list.
 */
export async function fetchTrendingBscTokens(limit = 8): Promise<TrendingToken[]> {
  try {
    const addrs = TRENDING_UNIVERSE.map((t) => t.address).join(",");
    const res = await fetch(`${BASE_URL}/tokens/v1/bsc/${addrs}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const pairs = (await res.json()) as DexPair[];
    const all = Array.isArray(pairs) ? pairs : [];

    return TRENDING_UNIVERSE.map(({ symbol, address }) => {
      const addr = address.toLowerCase();
      const owned = all.filter((p) => p.baseToken?.address?.toLowerCase() === addr);
      if (owned.length === 0) return null;
      const agg = aggregatePairs(owned, symbol);
      return {
        symbol,
        price: agg.price,
        price_change_24h: agg.price_change_24h,
        volume_24h: agg.volume_24h,
      } satisfies TrendingToken;
    })
      .filter((t): t is TrendingToken => t !== null)
      .sort((a, b) => b.volume_24h - a.volume_24h)
      .slice(0, limit);
  } catch (error) {
    console.error("[dexscreener] trending fetch failed:", error);
    return [];
  }
}
