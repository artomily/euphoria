// GET /api/trending — live, volume-ranked BNB-Chain tokens for the dashboard
// featured chips. Backed by DexScreener; cached via the Next Data Cache.

import { fetchTrendingBscTokens } from "@/lib/dexscreener";

// Refresh at most every 5 minutes — featured chips don't need tick-level data.
export const revalidate = 300;

export async function GET(): Promise<Response> {
  const tokens = await fetchTrendingBscTokens(8);
  return Response.json({ tokens });
}
