import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Greeting from "@/components/layout/greeting";
import FomoOrb from "@/components/dashboard/fomo-orb";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import AgentActivityCard from "@/components/agents/agent-activity-card";
import ScoreBar from "@/components/ui/score-bar";

// ─── Recent agent activity (demo) ────────────────────────────────────────────

function RecentActivity() {
  return (
    <section aria-labelledby="activity-heading">
      <h2
        id="activity-heading"
        className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3"
      >
        Recent Agent Activity
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <AgentActivityCard agentType="judge" status="complete">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">BNB Analysis</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                BUY
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Confidence: 74% · 2 min ago</p>
          </div>
        </AgentActivityCard>

        <AgentActivityCard agentType="scout" status="complete" showSources>
          <div className="flex flex-col gap-2.5">
            <p className="text-xs text-[var(--text-secondary)]">CAKE/BNB · 24 data points</p>
            <ScoreBar label="Volume" value={82} />
            <ScoreBar label="Momentum" value={71} />
          </div>
        </AgentActivityCard>

        <AgentActivityCard agentType="narrative" status="complete" showSources>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Narrative detected</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
              DeFi
            </span>
          </div>
        </AgentActivityCard>

        <AgentActivityCard agentType="crowd" status="running" showSources>
          <p className="text-xs text-[var(--text-secondary)]">Analyzing PEPE crowd sentiment…</p>
        </AgentActivityCard>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)]">
      <Sidebar />

      {/* Full-width main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Dashboard" />

        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(147,197,253,0.10) 0%, transparent 65%), #f5f6fa",
          }}
        >
          <div className="flex flex-col h-full min-h-full px-8 py-8 gap-8">

            {/* Greeting */}
            <Greeting />

            {/* Orb hero — fills the available vertical space proportionally */}
            <div className="flex-1 flex items-center justify-center min-h-[280px] max-h-[420px]">
              <FomoOrb
                level="ready"
                label="AI is ready"
                sublabel="Search a token or paste a Polymarket link to begin"
              />
            </div>

            {/* Quick chips + search */}
            <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
              <QuickChips />
              <TokenSearchBar />
            </div>

            {/* Recent activity — full width grid */}
            <RecentActivity />

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
