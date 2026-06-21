// ─── Narrative Agent (Gemini 2.5 Pro / Claude via gateway) ───────────────────
// Identifies the market narrative driving a token. Structured output via Zod —
// the schema IS the validation. On failure, returns a neutral "Unknown".

import { z } from "zod";
import { runStructured } from "@/lib/llm";
import { clamp } from "@/lib/utils";
import { NARRATIVE_SYSTEM, narrativePrompt } from "./prompts";
import type { NarrativeInput, NarrativeOutput } from "@/types/agents";

const NARRATIVE_CATEGORIES = [
  "AI",
  "Memecoin",
  "RWA",
  "DePIN",
  "Gaming",
  "DeFi",
  "Layer1",
  "Layer2",
  "Unknown",
] as const;

// Lenient: models (DeepSeek/Gemini via gateway) sometimes return a string where
// an array is expected, or an off-list / wrong-case category. Accept loosely,
// then normalize in code — the override is the real guardrail.
const strArray = z.preprocess(
  (v) => (typeof v === "string" ? [v] : v),
  z.array(z.string()),
);

const schema = z.object({
  narrative: z.string().describe("Market narrative category"),
  confidence: z.coerce.number().describe("Confidence the narrative is correct, 0-100"),
  explanation: z.string().describe("Plain-language story driving attention"),
  key_catalysts: strArray.describe("2-4 concrete catalysts"),
});

function normalizeCategory(s: string): NarrativeOutput["narrative"] {
  const hit = NARRATIVE_CATEGORIES.find(
    (c) => c.toLowerCase() === s.trim().toLowerCase(),
  );
  return hit ?? "Unknown";
}

const FALLBACK: NarrativeOutput = {
  narrative: "Unknown",
  confidence: 0,
  explanation: "Narrative analysis unavailable — limited data.",
  key_catalysts: [],
};

export async function execute(input: NarrativeInput): Promise<NarrativeOutput> {
  const out = await runStructured({
    tier: "pro",
    schema,
    system: NARRATIVE_SYSTEM,
    prompt: narrativePrompt(input.scout),
    fallback: FALLBACK,
  });
  return {
    ...out,
    narrative: normalizeCategory(out.narrative),
    confidence: clamp(out.confidence),
  };
}
