// ─── Historical OHLCV (Binance public klines) ────────────────────────────────
// Free, no-key source of daily candles for backtesting BNB-ecosystem tokens that
// list against USDT. Returns [] (never throws) on any failure so the backtester
// degrades gracefully.
//
// Kline row layout (Binance): [openTime, open, high, low, close, volume,
// closeTime, quoteVolume, trades, takerBuyBase, takerBuyQuote, ignore].

import type { Candle } from "@/types/backtest";

const BASE_URL = process.env.BINANCE_API_URL ?? "https://api.binance.com";

type KlineRow = [
  number, string, string, string, string, string,
  number, string, number, string, string, string,
];

export async function fetchDailyCandles(
  symbol: string,
  days = 180,
): Promise<Candle[]> {
  try {
    const pair = `${symbol.trim().toUpperCase()}USDT`;
    const limit = Math.min(Math.max(days, 1), 1000);
    const url = `${BASE_URL}/api/v3/klines?symbol=${encodeURIComponent(pair)}&interval=1d&limit=${limit}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // daily candles — cache an hour
    });
    if (!res.ok) return [];

    const rows = (await res.json()) as KlineRow[];
    if (!Array.isArray(rows)) return [];

    return rows.map((r) => ({
      time: r[0],
      open: Number(r[1]),
      high: Number(r[2]),
      low: Number(r[3]),
      close: Number(r[4]),
      volume: Number(r[5]),
      quoteVolume: Number(r[7]),
      trades: r[8],
      takerBuyBase: Number(r[9]),
    }));
  } catch (error) {
    console.error("[binance] klines fetch failed:", error);
    return [];
  }
}
