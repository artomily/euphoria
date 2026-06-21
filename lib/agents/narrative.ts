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

const schema = z.object({
  narrative: z.enum(NARRATIVE_CATEGORIES),
  confidence: z.number().describe("Confidence the narrative is correct, 0-100"),
  explanation: z.string().describe("Plain-language story driving attention"),
  key_catalysts: z.array(z.string()).describe("2-4 concrete catalysts"),
});

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
  return { ...out, confidence: clamp(out.confidence) };
}
