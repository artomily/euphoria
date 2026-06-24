import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import DashboardExperience from "@/components/dashboard/dashboard-experience";
import LiveMarkets from "@/components/dashboard/live-markets";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)]">
      <Sidebar />

      {/* Full-width main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Dashboard" />

        <main
          className="flex-1 overflow-y-auto bg-[var(--bg-app)]"
          id="main-content"
        >
          <div className="flex flex-col h-full min-h-full px-8 py-8 gap-8">

            {/* Idle hero ↔ inline chat-style analysis (client-driven) */}
            <DashboardExperience>
              <LiveMarkets />
            </DashboardExperience>

            {/* Disclaimer */}
            <p className="text-xs text-[var(--text-muted)] text-center pb-2">
              Signals are for research purposes only — not financial advice.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
