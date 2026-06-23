// POST /api/chat — streaming market-psychology assistant for the floating bubble.
// Body: { messages: {role,content}[], tokenContext?: { symbol, name? } }.
// Streams plain-text deltas back via a ReadableStream (no WebSockets, per infra
// rules). Token metadata is passed only inside a fenced untrusted-data block.
import { z } from "zod";
import { streamChat, type ChatMessage } from "@/lib/llm";
import { CHAT_SYSTEM, chatTokenContextBlock } from "@/lib/agents/prompts";

export const maxDuration = 60;

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
  tokenContext: z
    .object({
      symbol: z.string().min(1).max(20),
      name: z.string().max(80).optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  let parsed: z.infer<typeof chatSchema>;
  try {
    parsed = chatSchema.parse(await request.json());
  } catch {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const system = parsed.tokenContext
    ? `${CHAT_SYSTEM}\n\n${chatTokenContextBlock(parsed.tokenContext)}`
    : CHAT_SYSTEM;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    ...parsed.messages,
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamChat({ tier: "flash", messages })) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n[The assistant is unavailable right now. Please try again shortly.]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
