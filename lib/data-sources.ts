// ─── Data Source Transparency ────────────────────────────────────────────────
// Every AI agent declares where its signal comes from. This makes Euphoria's
// analysis auditable: a user can see that the Crowd Agent read X, TikTok, and
// YouTube before scoring FOMO — not a black box.

export type SourcePlatform =
  | "x"
  | "tiktok"
  | "youtube"
  | "instagram"
  | "reddit"
  | "telegram"
  | "dexscreener"
  | "coinmarketcap"
  | "coingecko"
  | "bscscan"
  | "binance"
  | "news";

export interface DataSource {
  id: SourcePlatform;
  /** Human-readable label shown in the UI */
  name: string;
  /** Short category shown on hover / in expanded view */
  kind: "social" | "market" | "onchain" | "prediction" | "news";
  /** Brand color for the source glyph */
  color: string;
  /** Tinted background behind the glyph */
  bg: string;
  /** Public base URL — used so the user can verify the source themselves */
  url: string;
}

export const DATA_SOURCES: Record<SourcePlatform, DataSource> = {
  x: {
    id: "x",
    name: "X",
    kind: "social",
    color: "#0f1419",
    bg: "#f1f3f5",
    url: "https://x.com/search",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    kind: "social",
    color: "#ff0050",
    bg: "#ffe9f0",
    url: "https://www.tiktok.com/search",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    kind: "social",
    color: "#ff0000",
    bg: "#ffeaea",
    url: "https://www.youtube.com/results",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    kind: "social",
    color: "#c13584",
    bg: "#fdeef6",
    url: "https://www.instagram.com/explore/tags",
  },
  reddit: {
    id: "reddit",
    name: "Reddit",
    kind: "social",
    color: "#ff4500",
    bg: "#fff0e8",
    url: "https://www.reddit.com/search",
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    kind: "social",
    color: "#229ed9",
    bg: "#e8f5fc",
    url: "https://t.me/s",
  },
  dexscreener: {
    id: "dexscreener",
    name: "DexScreener",
    kind: "market",
    color: "#5b6cff",
    bg: "#eceeff",
    url: "https://dexscreener.com",
  },
  coinmarketcap: {
    id: "coinmarketcap",
    name: "CoinMarketCap",
    kind: "market",
    color: "#17181b",
    bg: "#eef0f2",
    url: "https://coinmarketcap.com",
  },
  coingecko: {
    id: "coingecko",
    name: "CoinGecko",
    kind: "market",
    color: "#8dc63f",
    bg: "#f0f8e6",
    url: "https://www.coingecko.com",
  },
  bscscan: {
    id: "bscscan",
    name: "BscScan",
    kind: "onchain",
    color: "#f0b90b",
    bg: "#fdf6e0",
    url: "https://bscscan.com",
  },
  binance: {
    id: "binance",
    name: "Binance",
    kind: "prediction",
    color: "#f0b90b",
    bg: "#fef7e0",
    url: "https://www.binance.com",
  },
  news: {
    id: "news",
    name: "News & Blogs",
    kind: "news",
    color: "#6b6b85",
    bg: "#f1f1f5",
    url: "https://news.google.com/search",
  },
};

export type AgentSourceKey =
  | "scout"
  | "narrative"
  | "crowd"
  | "reverse"
  | "judge";

/**
 * Which platforms each agent reads. The Judge synthesizes the others, so it
 * inherits the full union rather than fetching directly.
 */
export const AGENT_SOURCES: Record<AgentSourceKey, SourcePlatform[]> = {
  scout: ["dexscreener", "coinmarketcap", "coingecko", "bscscan"],
  narrative: ["x", "news", "youtube", "reddit"],
  crowd: ["x", "tiktok", "youtube", "instagram", "reddit", "telegram"],
  reverse: ["bscscan", "dexscreener", "x"],
  judge: [],
};

/** Sources consulted when analyzing a Binance prediction's FOMO. */
export const PREDICTION_SOURCES: SourcePlatform[] = [
  "binance",
  "x",
  "news",
  "reddit",
  "youtube",
];

/** Resolve a list of platform ids to their full source records. */
export function resolveSources(ids: SourcePlatform[]): DataSource[] {
  return ids.map((id) => DATA_SOURCES[id]);
}
