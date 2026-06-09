import { ReactNode } from "react";
import Sidebar from "./sidebar";

interface TwoColumnLayoutProps {
  feed: ReactNode;
  main: ReactNode;
}

export default function TwoColumnLayout({ feed, main }: TwoColumnLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)]">
      <Sidebar />

      {/* Left feed panel */}
      <div className="w-[340px] shrink-0 flex flex-col bg-white border-r border-[var(--border)] overflow-y-auto">
        {feed}
      </div>

      {/* Right main panel — subtle radial ambient matches orb */}
      <div
        className="flex-1 overflow-y-auto relative"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(147,197,253,0.10) 0%, transparent 70%), #f5f6fa",
        }}
      >
        {main}
      </div>
    </div>
  );
}
