// ─── Reverse Agent (Gemini 2.5 Flash via gateway) ────────────────────────────
// The contrarian — estimates bubble probability 0-100. Neutral fallback = 50.

import { z } from "zod";
import { runStructured } from "@/lib/llm";
import { clamp } from "@/lib/utils";
import { REVERSE_SYSTEM, reversePrompt } from "./prompts";
import type { ReverseInput, ReverseOutput } from "@/types/agents";

const BUBBLE_RISKS = ["low", "medium", "high", "extreme"] as const;

const schema = z.object({
  bubble_probability: z.number().describe("Probability this is a bubble, 0-100"),
  bubble_risk: z.enum(BUBBLE_RISKS),
  red_flags: z.array(z.string()).describe("2-4 warning signs"),
  contrarian_argument: z.string().describe("The case against the crowd"),
  historical_parallel: z.string().optional().describe("A comparable past episode"),
});

function riskFor(prob: number): (typeof BUBBLE_RISKS)[number] {
  if (prob >= 75) return "extreme";
  if (prob >= 50) return "high";
  if (prob >= 25) return "medium";
  return "low";
}

const FALLBACK: ReverseOutput = {
  bubble_probability: 50,
  bubble_risk: "medium",
  red_flags: [],
  contrarian_argument: "Contrarian analysis unavailable — limited data.",
};

export async function execute(input: ReverseInput): Promise<ReverseOutput> {
  const out = await runStructured({
    tier: "flash",
    schema,
    system: REVERSE_SYSTEM,
    prompt: reversePrompt(input.scout, input.narrative),
    fallback: FALLBACK,
  });
  const bubble_probability = clamp(out.bubble_probability);
  return { ...out, bubble_probability, bubble_risk: riskFor(bubble_probability) };
}
