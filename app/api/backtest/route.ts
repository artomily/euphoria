// GET /api/backtest?symbol=CAKE&days=180 — backtest the Euphoria strategy spec.

import { z, ZodError } from "zod";
import { fetchDailyCandles } from "@/lib/backtest/binance";
import { runBacktest } from "@/lib/backtest/engine";
import { WARMUP } from "@/lib/backtest/strategy";
import type { AnalyzeErrorResponse } from "@/types/api";

// Dynamic: reads ?symbol= from the request. Caching is handled by the underlying
// Binance fetch (next: { revalidate: 3600 }).

const querySchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(15)
    .regex(/^[a-zA-Z0-9]+$/, "Symbol must be alphanumeric"),
  days: z.coerce.number().int().min(30).max(1000).default(180),
});

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const { symbol, days } = querySchema.parse({
      symbol: searchParams.get("symbol") ?? "",
      days: searchParams.get("days") ?? undefined,
    });

    const candles = await fetchDailyCandles(symbol, days);
    if (candles.length <= WARMUP) {
      return Response.json(
        {
          error: `No historical data for ${symbol.toUpperCase()} (needs a USDT pair on Binance)`,
        } satisfies AnalyzeErrorResponse,
        { status: 404 },
      );
    }

    return Response.json({ result: runBacktest(symbol, candles) });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: "Invalid input", details: error.issues } satisfies AnalyzeErrorResponse,
        { status: 400 },
      );
    }
    console.error("[api/backtest] failed:", error);
    return Response.json(
      { error: "Backtest failed" } satisfies AnalyzeErrorResponse,
      { status: 500 },
    );
  }
}
