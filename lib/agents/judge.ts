// ─── Judge Agent (Gemini 2.5 Pro via gateway) ────────────────────────────────
// The final decision-maker — synthesizes all four signals into BUY/SELL/WATCH.
// This is the reasoning that sells the demo, so it always uses the "pro" tier.
// Even on failure it must return a decision (WATCH, confidence 0).

import { z } from "zod";
import { runStructured } from "@/lib/llm";
import { clamp } from "@/lib/utils";
import { JUDGE_SYSTEM, judgePrompt } from "./prompts";
import type { JudgeInput, JudgeOutput } from "@/types/agents";

const DECISIONS = ["BUY", "SELL", "WATCH"] as const;

const schema = z.object({
  decision: z.enum(DECISIONS),
  confidence: z.number().describe("Calibrated confidence in the decision, 0-100"),
  reasoning: z.string().describe("Why this verdict, synthesizing all signals"),
  bull_case: z.string(),
  bear_case: z.string(),
  key_insight: z.string().describe("One-line standout insight"),
  time_horizon: z.string().describe("Suggested holding window, e.g. '3-7 days'"),
});

const FALLBACK: JudgeOutput = {
  decision: "WATCH",
  confidence: 0,
  reasoning: "Insufficient signal to reach a confident verdict — limited data.",
  bull_case: "Not enough data to argue the bull case.",
  bear_case: "Not enough data to argue the bear case.",
  key_insight: "Treat this as low-confidence; gather more data before acting.",
  time_horizon: "N/A",
};

export async function execute(input: JudgeInput): Promise<JudgeOutput> {
  const out = await runStructured({
    tier: "pro",
    schema,
    system: JUDGE_SYSTEM,
    prompt: judgePrompt(input.scout, input.narrative, input.crowd, input.reverse),
    fallback: FALLBACK,
  });
  return { ...out, confidence: clamp(out.confidence) };
}
