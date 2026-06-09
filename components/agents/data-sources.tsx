import {
  DATA_SOURCES,
  resolveSources,
  type SourcePlatform,
} from "@/lib/data-sources";
import SourceIcon from "./source-icon";
import { cn } from "@/lib/utils";

interface DataSourcesProps {
  sources: SourcePlatform[];
  /** "compact" = small glyph pills (feed cards). "detailed" = labelled, linked rows. */
  variant?: "compact" | "detailed";
  /** Optional heading shown above the row */
  label?: string;
  className?: string;
}

/**
 * Renders the platforms an agent consulted. Every glyph links to the source's
 * public site so a user can verify the signal themselves — transparency over
 * black-box scoring.
 */
export default function DataSources({
  sources,
  variant = "compact",
  label = "Sources",
  className,
}: DataSourcesProps) {
  if (sources.length === 0) return null;
  const resolved = resolveSources(sources);

  if (variant === "detailed") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {label}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {resolved.map((src) => (
            <a
              key={src.id}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full",
                "border border-[var(--border)] bg-white text-xs font-medium",
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                "hover:border-[var(--text-muted)] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
              )}
            >
              <span
                className="flex items-center justify-center w-4 h-4 rounded-[5px]"
                style={{ background: src.bg, color: src.color }}
              >
                <SourceIcon platform={src.id} size={11} />
              </span>
              {src.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // compact
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-[11px] text-[var(--text-muted)] shrink-0">{label}</span>
      <div className="flex items-center gap-1">
        {resolved.map((src) => (
          <a
            key={src.id}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${src.name} · ${src.kind}`}
            aria-label={src.name}
            className={cn(
              "flex items-center justify-center w-5 h-5 rounded-md transition-transform",
              "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
            )}
            style={{ background: src.bg, color: src.color }}
          >
            <SourceIcon platform={src.id} size={11} />
          </a>
        ))}
      </div>
    </div>
  );
}

/** Static count helper for marketing copy ("12 sources, 6 social platforms"). */
export const TOTAL_SOURCE_COUNT = Object.keys(DATA_SOURCES).length;
