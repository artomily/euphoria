// ─── Binance Prediction FOMO ─────────────────────────────────────────────────
// Paste a Binance prediction link and Euphoria scores the *crowd psychology*
// around the bet — not the odds themselves, but how much FOMO is driving one
// side. The analysis is deterministic per-slug so a demo link always yields the
// same read.

import { PREDICTION_SOURCES, type SourcePlatform } from "./data-sources";

export type FomoLevel = "calm" | "interest" | "bullish" | "fomo" | "euphoria";

export interface PredictionMarket {
  slug: string;
  question: string;
  category: string;
  /** Implied probability of YES, 0-100 */
  yesPrice: number;
  volumeUsd: number;
  liquidityUsd: number;
  endsAt: string;
}

export interface BetFomoAnalysis {
  market: PredictionMarket;
  /** Crowd FOMO around the bet, 0-100 */
  fomoScore: number;
  fomoLevel: FomoLevel;
  /** Side the crowd is piling into */
  crowdLean: "YES" | "NO";
  crowdConfidence: number;
  /** Social chatter vs. on-book odds. Positive = sentiment hotter than price. */
  mispricing: number;
  socialMentions24h: number;
  mentionChange: number;
  drivers: string[];
  contrarian: string[];
  verdict: "FADE" | "FOLLOW" | "WATCH";
  verdictReason: string;
  sources: SourcePlatform[];
}

const BINANCE_HOST = /(^|\.)binance\.com$/i;

/** True if the input string is a Binance prediction URL. */
export function isBinanceUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return BINANCE_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Extract the market slug from a Binance prediction URL, or return a slugified
 * raw input. Handles /event/<slug>, /market/<slug>, and trailing query/hash.
 */
export function parseBinanceSlug(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  if (isBinanceUrl(raw)) {
    const url = new URL(raw);
    const segments = url.pathname.split("/").filter(Boolean);
    // .../event/<slug> or .../market/<slug> → take the last meaningful segment
    const slug = segments[segments.length - 1];
    return slug ?? null;
  }

  // Accept a bare slug too (e.g. "will-bnb-hit-1000-by-2025")
  if (/^[a-z0-9-]+$/i.test(raw)) return raw.toLowerCase();
  return null;
}

// ─── Deterministic mock generation ──────────────────────────────────────────

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function scoreToLevel(score: number): FomoLevel {
  if (score >= 80) return "euphoria";
  if (score >= 60) return "fomo";
  if (score >= 40) return "bullish";
  if (score >= 20) return "interest";
  return "calm";
}

function titleize(slug: string): string {
  const words = slug.replace(/-/g, " ").trim();
  const q = words.charAt(0).toUpperCase() + words.slice(1);
  return q.endsWith("?") ? q : `${q}?`;
}

function pickCategory(slug: string): string {
  const s = slug.toLowerCase();
  if (/(btc|bitcoin|eth|bnb|sol|crypto|token|coin|price)/.test(s)) return "Crypto";
  if (/(election|president|senate|vote|trump|biden)/.test(s)) return "Politics";
  if (/(super-bowl|nba|world-cup|cup|game|match|win-the)/.test(s)) return "Sports";
  if (/(fed|rate|cpi|recession|gdp)/.test(s)) return "Economy";
  return "Trending";
}

/**
 * Produce a deterministic FOMO read for a Binance prediction from its slug.
 * Same slug → same analysis (stable for demos and caching).
 */
export function analyzeBet(slug: string): BetFomoAnalysis {
  const h = hashString(slug);
  const yesPrice = 12 + (h % 76); // 12–87
  const fomoScore = 35 + ((h >> 3) % 60); // 35–94
  const fomoLevel = scoreToLevel(fomoScore);
  const crowdLean: "YES" | "NO" = yesPrice >= 50 ? "YES" : "NO";
  const crowdConfidence = 55 + ((h >> 5) % 40); // 55–94
  // Sentiment hotter than odds → positive mispricing (over-betting the favorite)
  const mispricing = (fomoScore - yesPrice) % 100;
  const socialMentions24h = 800 + (h % 14000);
  const mentionChange = 20 + ((h >> 7) % 240); // +20%–+260%
  const volumeUsd = 50_000 + (h % 4_000_000);
  const liquidityUsd = 20_000 + ((h >> 2) % 900_000);

  const leanWord = crowdLean === "YES" ? "YES" : "NO";

  const drivers = [
    `Social mentions up ${mentionChange}% in 24h, skewed toward ${leanWord}`,
    `${(socialMentions24h / 1000).toFixed(1)}K posts across X, TikTok & YouTube this week`,
    `Order flow crowding the ${leanWord} side faster than liquidity can absorb`,
  ];

  const contrarian =
    fomoScore >= 65
      ? [
          `Crowd conviction (${crowdConfidence}%) outruns the on-book ${yesPrice}% odds`,
          "Late-money pattern — retail piling in after the move, not before",
        ]
      : [
          "Sentiment and odds broadly agree — limited edge either way",
          "No clear whale positioning detected in recent trades",
        ];

  let verdict: BetFomoAnalysis["verdict"];
  let verdictReason: string;
  if (fomoScore >= 70 && Math.abs(mispricing) >= 15) {
    verdict = "FADE";
    verdictReason = `FOMO is euphoric and the crowd is over-betting ${leanWord}. History favors fading crowded prediction-market positions like this.`;
  } else if (fomoScore >= 45 && Math.abs(mispricing) < 15) {
    verdict = "FOLLOW";
    verdictReason = `Crowd energy is building on ${leanWord} and sentiment tracks the odds — momentum looks genuine, not exhausted.`;
  } else {
    verdict = "WATCH";
    verdictReason = `Signal is mixed. FOMO is present but not decisive — wait for sentiment and odds to diverge before taking a side.`;
  }

  return {
    market: {
      slug,
      question: titleize(slug),
      category: pickCategory(slug),
      yesPrice,
      volumeUsd,
      liquidityUsd,
      endsAt: "Dec 31, 2026",
    },
    fomoScore,
    fomoLevel,
    crowdLean,
    crowdConfidence,
    mispricing,
    socialMentions24h,
    mentionChange,
    drivers,
    contrarian,
    verdict,
    verdictReason,
    sources: PREDICTION_SOURCES,
  };
}

/** Curated trending markets for the Predictions landing state. */
export const TRENDING_MARKETS: PredictionMarket[] = [
  {
    slug: "will-bitcoin-hit-150k-by-2026",
    question: "Will Bitcoin hit $150K by 2026?",
    category: "Crypto",
    yesPrice: 41,
    volumeUsd: 3_240_000,
    liquidityUsd: 540_000,
    endsAt: "Dec 31, 2026",
  },
  {
    slug: "will-bnb-flip-solana-marketcap",
    question: "Will BNB flip Solana in market cap?",
    category: "Crypto",
    yesPrice: 28,
    volumeUsd: 980_000,
    liquidityUsd: 210_000,
    endsAt: "Jun 30, 2026",
  },
  {
    slug: "fed-cuts-rates-in-q3-2026",
    question: "Will the Fed cut rates in Q3 2026?",
    category: "Economy",
    yesPrice: 63,
    volumeUsd: 1_710_000,
    liquidityUsd: 430_000,
    endsAt: "Sep 30, 2026",
  },
  {
    slug: "will-a-spot-sol-etf-launch-in-2026",
    question: "Will a spot SOL ETF launch in 2026?",
    category: "Crypto",
    yesPrice: 72,
    volumeUsd: 2_050_000,
    liquidityUsd: 380_000,
    endsAt: "Dec 31, 2026",
  },
];
