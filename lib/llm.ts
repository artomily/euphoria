// ─── LLM Provider Abstraction ────────────────────────────────────────────────
// Euphoria's agents don't care which gateway serves the model. This module hides
// the provider behind two tiers ("pro" | "flash") so agents just ask for a tier.
//
// Two providers are wired and selected by the LLM_PROVIDER env var:
//
//   • "9router"    (default) — a local OpenAI-compatible gateway running at
//                  http://localhost:20128/v1 that routes to free Claude/GPT/
//                  Gemini via your connected providers. Great for local dev +
//                  hackathon demos. NOTE: it lives on localhost, so it is NOT
//                  reachable from a deployed Vercel function — flip the env to
//                  "openrouter" for production.
//
//   • "openrouter" — the hosted OpenRouter gateway. Works anywhere, needs a key.
//
// Both are OpenAI-compatible, so we use a single client shape via the AI SDK and
// always produce structured output with generateObject + a Zod schema.

import { generateObject, type LanguageModel } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { z } from "zod";

export type ModelTier = "pro" | "flash";
type LlmProvider = "9router" | "openrouter";

const PROVIDER: LlmProvider =
  process.env.LLM_PROVIDER === "openrouter" ? "openrouter" : "9router";

// Per-provider model ids. 9router uses provider aliases (e.g. "claude-sonnet-4.5",
// "gemini-2.5-flash") that depend on which providers you connected in its
// dashboard, so every id is overridable via env.
const MODELS: Record<LlmProvider, Record<ModelTier, string>> = {
  "9router": {
    pro: process.env.NINEROUTER_MODEL_PRO ?? "claude-sonnet-4.5",
    flash: process.env.NINEROUTER_MODEL_FLASH ?? "gemini-2.5-flash",
  },
  openrouter: {
    pro: process.env.OPENROUTER_MODEL_PRO ?? "google/gemini-2.5-pro",
    flash: process.env.OPENROUTER_MODEL_FLASH ?? "google/gemini-2.5-flash",
  },
};

let _model: ((id: string) => LanguageModel) | null = null;

/** Lazily build the active provider client (so missing env only bites at call time). */
function provider(): (id: string) => LanguageModel {
  if (_model) return _model;

  if (PROVIDER === "openrouter") {
    const openrouter = createOpenRouter({
      apiKey: requireEnv("OPENROUTER_API_KEY"),
      compatibility: "strict",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Euphoria",
      },
    });
    _model = (id: string) => openrouter.chat(id);
    return _model;
  }

  // 9router — local OpenAI-compatible gateway
  const ninerouter = createOpenAICompatible({
    name: "9router",
    baseURL: process.env.NINEROUTER_BASE_URL ?? "http://localhost:20128/v1",
    // 9router accepts any non-empty key for local use; real key comes from its dashboard.
    apiKey: process.env.NINEROUTER_API_KEY ?? "local",
  });
  _model = (id: string) => ninerouter.chatModel(id);
  return _model;
}

export function getModel(tier: ModelTier): LanguageModel {
  return provider()(MODELS[PROVIDER][tier]);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

interface RunStructuredArgs<T> {
  tier: ModelTier;
  schema: z.ZodType<T>;
  prompt: string;
  system?: string;
  /** Returned (with confidence 0) if both the call and its single retry fail. */
  fallback: T;
}

/**
 * Run a structured LLM call with the project's standard guarantees:
 * temperature 0.3, one retry with 2s backoff, and a typed neutral fallback on
 * failure. The Zod schema is the validation — malformed output is impossible by
 * construction, so the only failure mode here is network/timeout.
 */
export async function runStructured<T>({
  tier,
  schema,
  prompt,
  system,
  fallback,
}: RunStructuredArgs<T>): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { object } = await generateObject({
        model: getModel(tier),
        schema,
        prompt,
        system,
        temperature: 0.3,
      });
      return object;
    } catch (error) {
      // Don't burn the 2s backoff on errors the provider says are permanent
      // (e.g. a misconfigured model alias / missing credentials) — fail fast.
      const retryable = (error as { isRetryable?: boolean }).isRetryable !== false;
      if (attempt === 0 && retryable) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      console.error(`[llm] ${tier} call failed:`, error);
      break;
    }
  }
  return fallback;
}
