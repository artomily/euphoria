// ─── Analyses persistence ─────────────────────────────────────────────────────
// Save completed analyses and read a wallet's history from Neon. All writes are
// best-effort at the call site — a DB hiccup must never break the analysis UX.

import { getSql } from "./client";
import type { AnalysisResult } from "@/types/agents";

export interface AnalysisListItem {
  id: string;
  symbol: string;
  decision: string;
  fomo_score: number;
  confidence: number;
  narrative: string;
  created_at: string;
}

/** Insert one completed analysis. `walletAddress` is the lowercased SIWE address, or null when anonymous. */
export async function saveAnalysis(
  result: AnalysisResult,
  walletAddress: string | null,
): Promise<void> {
  const sql = getSql();
  await sql`
    insert into analyses
      (wallet_address, symbol, decision, fomo_score, confidence, narrative, result_json)
    values (
      ${walletAddress},
      ${result.symbol},
      ${result.judge.decision},
      ${result.crowd.fomo_score},
      ${result.judge.confidence},
      ${result.narrative.narrative},
      ${JSON.stringify(result)}
    )
  `;
}

/** Most-recent analyses for a wallet, newest first. */
export async function listAnalyses(
  walletAddress: string,
  limit = 50,
): Promise<AnalysisListItem[]> {
  const sql = getSql();
  const rows = await sql`
    select id, symbol, decision, fomo_score, confidence, narrative, created_at
    from analyses
    where wallet_address = ${walletAddress}
    order by created_at desc
    limit ${limit}
  `;
  return rows as AnalysisListItem[];
}
