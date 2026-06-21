// ─── Crowd Agent (Gemini 2.5 Flash via gateway) ──────────────────────────────
// Quantifies crowd FOMO 0-100. Fast classification. Neutral fallback = 50.

import { z } from "zod";
import { runStructured } from "@/lib/llm";
import { clamp } from "@/lib/utils";
import { CROWD_SYSTEM, crowdPrompt } from "./prompts";
import type { CrowdInput, CrowdOutput, FomoLevel } from "@/types/agents";

// Lenient inputs (model may return a string for arrays); fomo_level is derived
// from the score below, so we accept any string for it.
const strArray = z.preprocess(
  (v) => (typeof v === "string" ? [v] : v),
  z.array(z.string()),
);

const schema = z.object({
  fomo_score: z.coerce.number().describe("Crowd FOMO, 0-100"),
  fomo_level: z.string().optional(),
  sentiment_drivers: strArray.describe("2-4 drivers of crowd excitement"),
  social_signals: z.string().describe("One-line read on social chatter"),
  crowd_narrative: z.string().describe("Short summary of the crowd's story"),
});

function levelFor(score: number): FomoLevel {
  if (score >= 80) return "euphoria";
  if (score >= 60) return "fomo";
  if (score >= 40) return "bullish";
  if (score >= 20) return "interest";
  return "calm";
}

const FALLBACK: CrowdOutput = {
  fomo_score: 50,
  fomo_level: "bullish",
  sentiment_drivers: [],
  social_signals: "Social signal unavailable — limited data.",
  crowd_narrative: "Crowd analysis unavailable.",
};

export async function execute(input: CrowdInput): Promise<CrowdOutput> {
  const out = await runStructured({
    tier: "flash",
    schema,
    system: CROWD_SYSTEM,
    prompt: crowdPrompt(input.scout, input.narrative),
    fallback: FALLBACK,
  });
  const fomo_score = clamp(out.fomo_score);
  // Keep label consistent with the (clamped) score regardless of model wording.
  return { ...out, fomo_score, fomo_level: levelFor(fomo_score) };
}
