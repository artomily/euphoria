// ─── CoinMarketCap API Client ────────────────────────────────────────────────
// Sponsor capability for the BNB Hack (CMC Agent Hub / Pro API). CMC is the
// PRIMARY market read for a token; Scout falls back to DexScreener when no key
// is configured or CMC is unreachable (see CLAUDE.md — CMC is optional).
//
// A free "Basic" key (https://coinmarketcap.com/api/) is enough for quotes.
// Set COINMARKETCAP_API_KEY to enable. Without it this client no-ops cleanly.

import type { TokenMarketData } from "@/lib/dexscreener";

const BASE_URL =
  process.env.COINMARKETCAP_API_URL ?? "https://pro-api.coinmarketcap.com";

interface CmcQuote {
  price?: number;
  volume_24h?: number;
  percent_change_24h?: number;
  market_cap?: number;
}

interface CmcCoin {
  name?: string;
  symbol?: string;
  quote?: { USD?: CmcQuote };
}

interface CmcResponse {
  data?: Record<string, CmcCoin>;
  status?: { error_code?: number; error_message?: string | null };
}

/** True when a CMC key is configured — lets callers skip CMC entirely. */
export function isCmcEnabled(): boolean {
  return Boolean(process.env.COINMARKETCAP_API_KEY);
}

/**
 * Fetch the latest USD quote for a symbol from CMC. Returns null (never throws)
 * when no key is set, the symbol isn't found, or the API errors — Scout then
 * degrades to DexScreener. Note CMC quotes carry no per-trade / liquidity data,
 * so buys/sells/liquidity are left at 0 (DexScreener fills those when merged).
 */
export async function fetchCmcMarketData(
  symbol: string,
): Promise<TokenMarketData | null> {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) return null;

  try {
    const target = symbol.trim().toUpperCase();
    const url = `${BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${encodeURIComponent(target)}&convert=USD`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "X-CMC_PRO_API_KEY": apiKey },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as CmcResponse;
    const coin = json.data?.[target];
    const usd = coin?.quote?.USD;
    if (!coin || !usd || usd.price == null) return null;

    return {
      symbol: (coin.symbol ?? target).toUpperCase(),
      name: coin.name ?? target,
      address: "",
      price: usd.price,
      price_change_24h: usd.percent_change_24h ?? 0,
      volume_24h: usd.volume_24h ?? 0,
      market_cap: usd.market_cap ?? 0,
      liquidity_usd: 0,
      buys_24h: 0,
      sells_24h: 0,
    };
  } catch (error) {
    console.error("[cmc] fetch failed:", error);
    return null;
  }
}
