// ─── Orchestrator ────────────────────────────────────────────────────────────
// Coordinates the agent pipeline in dependency order:
//
//   Scout (heuristic, no LLM)
//      ↓
//   Narrative (Pro)
//      ↓
//   Crowd ∥ Reverse  (independent — run concurrently via Promise.all)
//      ↓
//   Judge (Pro, synthesizes everything)
//
// Critical path = 1 heuristic + 3 LLM hops, not 5. Agents never throw (they
// return neutral fallbacks), so the orchestrator always produces a full result.

import * as scout from "./scout";
import * as narrative from "./narrative";
import * as crowd from "./crowd";
import * as reverse from "./reverse";
import * as judge from "./judge";
import type { AnalysisResult } from "@/types/agents";

export async function orchestrate(symbol: string): Promise<AnalysisResult> {
  const start = Date.now();

  const scoutOut = await scout.execute({ symbol });
  const narrativeOut = await narrative.execute({ scout: scoutOut });

  // Crowd and Reverse each depend only on Scout + Narrative — run in parallel.
  const [crowdOut, reverseOut] = await Promise.all([
    crowd.execute({ scout: scoutOut, narrative: narrativeOut }),
    reverse.execute({ scout: scoutOut, narrative: narrativeOut }),
  ]);

  const judgeOut = await judge.execute({
    scout: scoutOut,
    narrative: narrativeOut,
    crowd: crowdOut,
    reverse: reverseOut,
  });

  return {
    symbol: scoutOut.symbol,
    scout: scoutOut,
    narrative: narrativeOut,
    crowd: crowdOut,
    reverse: reverseOut,
    judge: judgeOut,
    duration_ms: Date.now() - start,
    cached: false,
  };
}
