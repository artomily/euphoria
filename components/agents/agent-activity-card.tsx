import { ReactNode } from "react";
import {
  Telescope,
  BookOpen,
  Users,
  TrendingDown,
  Gavel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENT_SOURCES } from "@/lib/data-sources";
import DataSources from "./data-sources";

type AgentType = "scout" | "narrative" | "crowd" | "reverse" | "judge";
type AgentStatus = "pending" | "running" | "complete" | "error";

interface AgentActivityCardProps {
  agentType: AgentType;
  status?: AgentStatus;
  children?: ReactNode;
  /** Show the data-source transparency row for this agent. */
  showSources?: boolean;
  className?: string;
}

const agentConfig: Record<
  AgentType,
  { name: string; role: string; icon: typeof Telescope; color: string; bg: string }
> = {
  scout:     { name: "Scout Agent",     role: "Market Analyst",    icon: Telescope,    color: "#f97316", bg: "#fff7ed" },
  narrative: { name: "Narrative Agent", role: "Story Analyst",     icon: BookOpen,     color: "#8b5cf6", bg: "#f5f3ff" },
  crowd:     { name: "Crowd Agent",     role: "FOMO Detector",     icon: Users,        color: "#3b82f6", bg: "#eff6ff" },
  reverse:   { name: "Reverse Agent",   role: "Contrarian Analyst", icon: TrendingDown, color: "#ef4444", bg: "#fef2f2" },
  judge:     { name: "Judge Agent",     role: "Decision Maker",    icon: Gavel,        color: "#10b981", bg: "#f0fdf4" },
};

const statusConfig: Record<AgentStatus, { label: string; dotClass: string; textClass: string }> = {
  pending:  { label: "Pending",   dotClass: "bg-gray-300",                       textClass: "text-gray-400"    },
  running:  { label: "Analyzing", dotClass: "bg-blue-500 animate-pulse",         textClass: "text-blue-500"    },
  complete: { label: "Complete",  dotClass: "bg-emerald-500",                    textClass: "text-emerald-600" },
  error:    { label: "Failed",    dotClass: "bg-red-500",                        textClass: "text-red-500"     },
};

export default function AgentActivityCard({
  agentType,
  status = "pending",
  children,
  showSources = false,
  className,
}: AgentActivityCardProps) {
  const agent = agentConfig[agentType];
  const Icon = agent.icon;
  const s = statusConfig[status];
  const sources = AGENT_SOURCES[agentType];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[var(--border)]",
        "shadow-[var(--shadow-card)] p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: agent.bg }}
          >
            <Icon size={16} style={{ color: agent.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
              {agent.name}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">{agent.role}</p>
          </div>
        </div>

        <div className={cn("flex items-center gap-1.5 shrink-0 pt-0.5", s.textClass)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", s.dotClass)} />
          <span className="text-xs font-medium">{s.label}</span>
        </div>
      </div>

      {/* Content */}
      {children && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          {children}
        </div>
      )}

      {/* Data-source transparency */}
      {showSources && sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <DataSources sources={sources} variant="compact" />
        </div>
      )}
    </div>
  );
}
