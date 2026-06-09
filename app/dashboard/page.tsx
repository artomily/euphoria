import TwoColumnLayout from "@/components/layout/two-column-layout";
import Greeting from "@/components/layout/greeting";
import FomoOrb from "@/components/dashboard/fomo-orb";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import AgentActivityCard from "@/components/agents/agent-activity-card";
import ScoreBar from "@/components/ui/score-bar";

function FeedHeader() {
  return (
    <div className="px-5 py-4 border-b border-[var(--border)] sticky top-0 bg-white z-10">
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">Agent Activity</h2>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">Recent analyses</p>
    </div>
  );
}

function DemoFeed() {
  return (
    <div className="flex flex-col gap-3 p-4">
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
          <p className="text-xs text-[var(--text-secondary)]">CAKE/BNB · 24 data points processed</p>
          <ScoreBar label="Volume Score" value={82} />
          <ScoreBar label="Momentum Score" value={71} />
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
  );
}

function MainPanel() {
  return (
    <div className="flex flex-col h-full min-h-screen px-10 py-8">
      {/* Top: greeting */}
      <Greeting />

      {/* Center: orb — takes all remaining space */}
      <div className="flex-1 flex items-center justify-center py-8">
        <FomoOrb
          level="ready"
          label="AI is ready"
          sublabel="Waiting for your instructions or voice command"
        />
      </div>

      {/* Bottom: chips + search + disclaimer */}
      <div className="flex flex-col gap-4 pb-2">
        <QuickChips />
        <TokenSearchBar />
        <p className="text-xs text-[var(--text-muted)] text-center">
          Signals are for research purposes only — not financial advice.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <TwoColumnLayout
      feed={
        <>
          <FeedHeader />
          <DemoFeed />
        </>
      }
      main={<MainPanel />}
    />
  );
}
