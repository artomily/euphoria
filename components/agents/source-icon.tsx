import {
  Send,
  LineChart,
  BarChart3,
  Coins,
  Boxes,
  Scale,
  Newspaper,
} from "lucide-react";
import type { SourcePlatform } from "@/lib/data-sources";

interface SourceIconProps {
  platform: SourcePlatform;
  size?: number;
}

/**
 * Brand glyphs for each data source. lucide covers most platforms; X, TikTok,
 * and Reddit ship as inline SVG paths since lucide has no faithful mark.
 * `currentColor` lets the parent tint each glyph with its brand color.
 */
export default function SourceIcon({ platform, size = 13 }: SourceIconProps) {
  switch (platform) {
    case "x":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
          <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.01 13.07c.02.16.03.32.03.49 0 2.5-2.91 4.53-6.5 4.53s-6.5-2.03-6.5-4.53c0-.17.01-.33.03-.49a1.49 1.49 0 0 1-.86-1.35 1.49 1.49 0 0 1 2.53-1.07 7.32 7.32 0 0 1 3.98-1.26l.76-3.56a.32.32 0 0 1 .38-.25l2.5.53a1.04 1.04 0 1 1-.13.62l-2.23-.47-.68 3.2a7.3 7.3 0 0 1 3.92 1.26 1.49 1.49 0 0 1 2.06.42 1.49 1.49 0 0 1-.6 2.15ZM8.4 12.46a1.04 1.04 0 1 0 2.08 0 1.04 1.04 0 0 0-2.08 0Zm5.5 2.96c-.7.7-2.06.76-2.46.76-.4 0-1.76-.05-2.46-.76a.27.27 0 0 1 .38-.38c.44.44 1.4.6 2.08.6.68 0 1.63-.16 2.08-.6a.27.27 0 1 1 .38.38Zm-.18-1.92a1.04 1.04 0 1 1 0-2.08 1.04 1.04 0 0 1 0 2.08Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
          <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.16.56.55.9 1.11 1.16 1.77.25.64.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.16 1.77c-.55.56-1.11.9-1.77 1.16-.64.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.25-.64-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.79.47-2.43.26-.66.6-1.22 1.16-1.77.55-.56 1.11-.9 1.77-1.16.64-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.51.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.31.88-.35 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.21 1.51.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.31 1.86.35 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.51-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.31-.88.35-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.21-1.51-.35-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.14-.88-.31-1.86-.35-1.05-.05-1.37-.06-4.04-.06Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-3.24a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
        </svg>
      );
    case "telegram":
      return <Send width={size} height={size} aria-hidden />;
    case "dexscreener":
      return <LineChart width={size} height={size} aria-hidden />;
    case "coinmarketcap":
      return <BarChart3 width={size} height={size} aria-hidden />;
    case "coingecko":
      return <Coins width={size} height={size} aria-hidden />;
    case "bscscan":
      return <Boxes width={size} height={size} aria-hidden />;
    case "polymarket":
      return <Scale width={size} height={size} aria-hidden />;
    case "news":
      return <Newspaper width={size} height={size} aria-hidden />;
    default:
      return null;
  }
}
