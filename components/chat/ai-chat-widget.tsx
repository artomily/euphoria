"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Hi — I'm Euphoria's market-psychology assistant. Ask me about FOMO, narratives, bubble risk, or crowd emotion on any BNB Chain token.";

export function AiChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // On a token page (/token/BNB), tell the assistant which token is in view.
  const tokenContext = useMemo(() => {
    const match = pathname?.match(/^\/token\/([^/]+)/);
    return match ? { symbol: decodeURIComponent(match[1]).toUpperCase() } : undefined;
  }, [pathname]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, tokenContext }),
      });
      if (!res.ok || !res.body) throw new Error("request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry — I couldn't reach the model. Please try again.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      {/* Launcher bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className={cn(
            "fixed bottom-5 right-5 z-40 flex items-center justify-center",
            "w-14 h-14 rounded-full text-white shadow-[var(--shadow-elevated)]",
            "motion-safe:transition-transform motion-safe:duration-150 hover:scale-105 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
          )}
          style={{ background: "linear-gradient(135deg, var(--orb-from), var(--orb-to))" }}
        >
          <MessageCircle className="w-5 h-5" aria-hidden />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-5 right-5 z-40 flex flex-col w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-2.5rem))] rounded-2xl glass-elevated overflow-hidden"
          role="dialog"
          aria-label="Euphoria AI assistant"
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle"
            style={{ background: "linear-gradient(135deg, rgba(147,197,253,0.18), rgba(196,181,253,0.18))" }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full text-white shrink-0"
              style={{ background: "linear-gradient(135deg, var(--orb-from), var(--orb-to))" }}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary leading-tight">Euphoria AI</p>
              <p className="text-[11px] text-text-secondary leading-tight">
                {tokenContext ? `Discussing ${tokenContext.symbol}` : "Market psychology assistant"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-black/[0.05] motion-safe:transition-colors"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex gap-2.5">
                <Avatar />
                <p className="text-sm text-text-secondary leading-relaxed max-w-[85%]">{GREETING}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}
              >
                {m.role === "assistant" && <Avatar />}
                <div
                  className={cn(
                    "text-sm leading-relaxed rounded-2xl px-3.5 py-2 max-w-[85%] whitespace-pre-wrap break-words",
                    m.role === "user"
                      ? "bg-accent-emerald text-white rounded-br-sm"
                      : "bg-bg-elevated text-text-primary rounded-bl-sm"
                  )}
                >
                  {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border-subtle p-3">
            <div className="flex items-end gap-2 rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 focus-within:border-accent-emerald/50 motion-safe:transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about FOMO, narratives, risk…"
                className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none max-h-24"
              />
              <button
                onClick={() => void send()}
                disabled={!input.trim() || streaming}
                aria-label="Send message"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-emerald text-white shrink-0 disabled:opacity-40 disabled:pointer-events-none hover:bg-emerald-400 motion-safe:transition-colors"
              >
                <Send className="w-4 h-4" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-text-muted text-center">
              Research &amp; education only — not financial advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Avatar() {
  return (
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full text-white shrink-0 self-end"
      style={{ background: "linear-gradient(135deg, var(--orb-from), var(--orb-to))" }}
      aria-hidden
    >
      <Sparkles className="w-3.5 h-3.5" />
    </span>
  );
}
