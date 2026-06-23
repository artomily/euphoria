// ─── LLM Provider Abstraction ────────────────────────────────────────────────
// Euphoria's agents don't care which gateway serves the model. This module hides
// the provider behind two tiers ("pro" | "flash") so agents just ask for a tier.
//
// Two providers are wired and selected by the LLM_PROVIDER env var:
//
//   • "9router"    (default) — a local OpenAI-compatible gateway running at
//                  http://localhost:20128/v1 that routes to Claude/GPT/Gemini/
//                  DeepSeek via your connected providers. Great for local dev +
//                  hackathon demos. NOTE: it lives on localhost, so it is NOT
//                  reachable from a deployed Vercel function — flip the env to
//                  "openrouter" for production.
//
//   • "openrouter" — the hosted OpenRouter gateway. Works anywhere, needs a key.
//
// Both are OpenAI-compatible. We call /chat/completions directly with fetch
// (rather than via an AI SDK provider) because 9router can return an SSE-framed
// body even to non-streaming requests, which trips up the SDK's strict parser.
// We parse the completion ourselves and validate with the Zod schema.

import type { z } from "zod";

export type ModelTier = "pro" | "flash";
type LlmProvider = "9router" | "openrouter";

const PROVIDER: LlmProvider =
  process.env.LLM_PROVIDER === "openrouter" ? "openrouter" : "9router";

const REQUEST_TIMEOUT_MS = 45_000;

// Per-provider model ids. 9router uses provider aliases (e.g. "claude-sonnet-4.5",
// "deepseek-v4-flash") that depend on which providers you connected in its
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

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

interface Endpoint {
  url: string;
  apiKey: string;
  headers: Record<string, string>;
}

function endpoint(): Endpoint {
  if (PROVIDER === "openrouter") {
    const base = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";
    return {
      url: `${base}/chat/completions`,
      apiKey: requireEnv("OPENROUTER_API_KEY"),
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Euphoria",
      },
    };
  }
  const base = process.env.NINEROUTER_BASE_URL ?? "http://localhost:20128/v1";
  return {
    url: `${base}/chat/completions`,
    // 9router accepts any non-empty key for local use; real key from its dashboard.
    apiKey: process.env.NINEROUTER_API_KEY ?? "local",
    headers: {},
  };
}

interface ChatCompletion {
  choices?: Array<{ message?: { content?: string } }>;
}

/**
 * Parse a /chat/completions body that may be plain JSON OR an SSE stream
 * ("data: {…}\n\ndata: [DONE]"). Returns the first parseable completion object.
 */
function parseCompletion(body: string): ChatCompletion | null {
  const trimmed = body.trim();
  try {
    return JSON.parse(trimmed) as ChatCompletion;
  } catch {
    // fall through to SSE handling
  }
  for (const line of trimmed.split(/\r?\n/)) {
    const l = line.trim();
    if (!l.startsWith("data:")) continue;
    const payload = l.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      return JSON.parse(payload) as ChatCompletion;
    } catch {
      // ignore non-JSON data lines
    }
  }
  return null;
}

/** Extract a single JSON object from model content (strip fences / trailing text). */
function extractJsonObject(content: string): unknown {
  const t = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new Error("no JSON object in model output");
  }
  return JSON.parse(t.slice(first, last + 1));
}

async function chatComplete(
  tier: ModelTier,
  prompt: string,
  system: string | undefined,
): Promise<string> {
  const { url, apiKey, headers } = endpoint();
  const messages: Array<{ role: string; content: string }> = [];
  if (system) messages.push({ role: "system", content: system });
  // The word "json" must appear for json_object mode on some providers (DeepSeek/OpenAI).
  messages.push({ role: "user", content: `${prompt}\n\nRespond with a single valid JSON object only.` });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...headers,
    },
    body: JSON.stringify({
      model: MODELS[PROVIDER][tier],
      messages,
      temperature: 0.3,
      stream: false,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`gateway ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const completion = parseCompletion(await res.text());
  const content = completion?.choices?.[0]?.message?.content;
  if (!content) throw new Error("empty completion content");
  return content;
}

// ─── Streaming chat (for the floating AI assistant) ──────────────────────────
// Unlike runStructured (which wants one JSON object), the chat widget wants
// incremental tokens. We call the same OpenAI-compatible gateway with
// stream:true and yield content deltas as they arrive. Surfaced as a plain text
// ReadableStream by app/api/chat — no WebSockets (per the project's infra rules).

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface StreamChatArgs {
  tier: ModelTier;
  messages: ChatMessage[];
}

export async function* streamChat({
  tier,
  messages,
}: StreamChatArgs): AsyncGenerator<string> {
  const { url, apiKey, headers } = endpoint();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...headers,
    },
    body: JSON.stringify({
      model: MODELS[PROVIDER][tier],
      messages,
      temperature: 0.4,
      stream: true,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok || !res.body) {
    throw new Error(`gateway ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith("data:")) continue;
      const payload = l.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) yield delta;
      } catch {
        // ignore partial / non-JSON frames
      }
    }
  }
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
 * Run a structured LLM call with the project's standard guarantees: temperature
 * 0.3, one retry with 2s backoff, a 45s timeout, and a typed neutral fallback on
 * failure. The Zod schema is the final validation guardrail.
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
      const content = await chatComplete(tier, prompt, system);
      const parsed = schema.safeParse(extractJsonObject(content));
      if (parsed.success) return parsed.data;
      throw new Error(`schema validation failed: ${parsed.error.message}`);
    } catch (error) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      console.error(`[llm] ${tier} call failed:`, error);
    }
  }
  return fallback;
}
