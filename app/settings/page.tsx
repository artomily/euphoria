import type { Metadata } from "next";
import {
  BrainCircuit,
  Database,
  ShieldCheck,
  Info,
  Zap,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Settings" };

// ─── Types ────────────────────────────────────────────────────────────────────

interface SettingRowProps {
  label: string;
  description: string;
  value: string;
  status: "active" | "soon";
}

interface DataSource {
  name: string;
  category: "social" | "market" | "onchain" | "news";
  description: string;
  used_by: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATA_SOURCES: DataSource[] = [
  { name: "DexScreener", category: "market", description: "Primary BNB Chain DEX price and liquidity data", used_by: ["Scout"] },
  { name: "CoinMarketCap", category: "market", description: "Global market cap and trading volume", used_by: ["Scout"] },
  { name: "CoinGecko", category: "market", description: "Token metadata and market history", used_by: ["Scout"] },
  { name: "BscScan", category: "onchain", description: "On-chain transaction volume and holder data", used_by: ["Scout", "Reverse"] },
  { name: "X (Twitter)", category: "social", description: "Real-time crypto sentiment and influencer signals", used_by: ["Narrative", "Crowd", "Reverse"] },
  { name: "Reddit", category: "social", description: "Community discussions and retail sentiment", used_by: ["Narrative", "Crowd"] },
  { name: "YouTube", category: "social", description: "Video creator signals and tutorial momentum", used_by: ["Narrative", "Crowd"] },
  { name: "TikTok", category: "social", description: "Viral trend detection and retail FOMO signals", used_by: ["Crowd"] },
  { name: "Telegram", category: "social", description: "Community group activity and narrative spread", used_by: ["Crowd"] },
  { name: "Instagram", category: "social", description: "Lifestyle and influencer crypto mentions", used_by: ["Crowd"] },
  { name: "News & Blogs", category: "news", description: "Major crypto publications and press releases", used_by: ["Narrative"] },
];

const CATEGORY_COLORS: Record<DataSource["category"], string> = {
  social: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  market: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  onchain: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  news: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }: {
  icon: typeof BrainCircuit;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle shrink-0">
        <Icon className="w-4 h-4 text-text-secondary" aria-hidden />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function SettingRow({ label, description, value, status }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {status === "soon" && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-text-muted bg-bg-elevated border border-border-subtle rounded px-1.5 py-0.5">
              <Clock className="w-2.5 h-2.5" aria-hidden />
              Soon
            </span>
          )}
        </div>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {status === "active" ? (
          <>
            <span className="text-xs font-mono text-text-secondary">{value}</span>
            <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" aria-hidden />
          </>
        ) : (
          <span className="text-xs text-text-muted">{value}</span>
        )}
      </div>
    </div>
  );
}

function DataSourceRow({ source }: { source: DataSource }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-text-primary">{source.name}</p>
          <span className={`inline-flex items-center text-[10px] font-medium border rounded px-1.5 py-0.5 ${CATEGORY_COLORS[source.category]}`}>
            {source.category}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5">{source.description}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        {source.used_by.map((agent) => (
          <span
            key={agent}
            className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-secondary"
          >
            {agent}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Settings" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="max-w-2xl mx-auto space-y-8">

            {/* Page header */}
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Configure your Euphoria experience and review how signals are generated.
              </p>
            </div>

            {/* ── AI Intelligence ─────────────────────────────────────── */}
            <section aria-labelledby="intelligence-heading">
              <SectionHeader
                icon={BrainCircuit}
                title="AI Intelligence"
                description="Models and reasoning pipeline powering the analysis"
              />
              <Card>
                <CardContent className="p-0 px-5">
                  <SettingRow
                    label="Reasoning tier"
                    description="Core Intelligence uses Gemini Flash for fast agents and Pro for the Judge verdict"
                    value="Core Intelligence"
                    status="active"
                  />
                  <SettingRow
                    label="Analysis pipeline"
                    description="Scout → Narrative → Crowd + Reverse (parallel) → Judge"
                    value="5-agent pipeline"
                    status="active"
                  />
                  <SettingRow
                    label="Judge model"
                    description="The Judge always uses Gemini 2.5 Pro for maximum reasoning quality"
                    value="Gemini 2.5 Pro"
                    status="active"
                  />
                  <SettingRow
                    label="Advanced Pro tier"
                    description="All agents upgraded to Gemini 2.5 Pro for deeper analysis"
                    value="Upgrade coming"
                    status="soon"
                  />
                </CardContent>
              </Card>
            </section>

            {/* ── Analysis Preferences ─────────────────────────────────── */}
            <section aria-labelledby="analysis-heading">
              <SectionHeader
                icon={Zap}
                title="Analysis Preferences"
                description="Customize how and what gets analyzed"
              />
              <Card>
                <CardContent className="p-0 px-5">
                  <SettingRow
                    label="Quick access tokens"
                    description="Tokens shown as quick chips on the dashboard"
                    value="BNB, CAKE, BTC, ETH, PEPE, WRX"
                    status="active"
                  />
                  <SettingRow
                    label="Custom quick chips"
                    description="Set your own default tokens for one-click analysis"
                    value="Configure tokens"
                    status="soon"
                  />
                  <SettingRow
                    label="Auto-refresh dashboard"
                    description="Automatically refresh analysis signals every 5 minutes"
                    value="Auto-refresh"
                    status="soon"
                  />
                  <SettingRow
                    label="Analysis history"
                    description="Save every analysis to your personal history log"
                    value="Requires wallet"
                    status="soon"
                  />
                </CardContent>
              </Card>
            </section>

            {/* ── Data Sources ─────────────────────────────────────────── */}
            <section aria-labelledby="sources-heading">
              <SectionHeader
                icon={Database}
                title="Data Sources"
                description="Every signal is traceable — here's where the data comes from"
              />
              <Card>
                <CardContent className="p-0 px-5">
                  {DATA_SOURCES.map((source) => (
                    <DataSourceRow key={source.name} source={source} />
                  ))}
                </CardContent>
              </Card>
              <p className="text-xs text-text-muted mt-2 ml-0.5">
                Source toggles (enable/disable per-agent data channels) coming in a future release.
              </p>
            </section>

            {/* ── Notifications ─────────────────────────────────────────── */}
            <section aria-labelledby="notifications-heading">
              <SectionHeader
                icon={MessageSquare}
                title="Notifications"
                description="Get alerted when signals cross key thresholds"
              />
              <Card>
                <CardContent className="p-0 px-5">
                  <SettingRow
                    label="FOMO alerts"
                    description="Notify when a token crosses FOMO threshold (score &gt; 60)"
                    value="Set threshold"
                    status="soon"
                  />
                  <SettingRow
                    label="Judge verdict push"
                    description="Push notification when analysis completes on tracked tokens"
                    value="Watch list"
                    status="soon"
                  />
                  <SettingRow
                    label="Narrative breakouts"
                    description="Alert when a new narrative heat crosses into Euphoria (&gt; 80)"
                    value="Radar watch"
                    status="soon"
                  />
                </CardContent>
              </Card>
            </section>

            {/* ── Security ─────────────────────────────────────────────── */}
            <section aria-labelledby="security-heading">
              <SectionHeader
                icon={ShieldCheck}
                title="Security & Privacy"
                description="How your data is protected"
              />
              <Card>
                <CardContent className="p-0 px-5">
                  <SettingRow
                    label="Authentication"
                    description="Wallet-based auth via Privy — no email or password required"
                    value="Wallet auth"
                    status="active"
                  />
                  <SettingRow
                    label="Data storage"
                    description="Analysis history stored with Row Level Security, scoped to your wallet"
                    value="RLS enabled"
                    status="active"
                  />
                  <SettingRow
                    label="Private keys"
                    description="Euphoria never requests, stores, or transmits private keys"
                    value="Read-only"
                    status="active"
                  />
                  <SettingRow
                    label="On-chain transactions"
                    description="No transaction signing — Euphoria is a read-only intelligence layer"
                    value="No transactions"
                    status="active"
                  />
                </CardContent>
              </Card>
            </section>

            {/* ── About ─────────────────────────────────────────────────── */}
            <section aria-labelledby="about-heading">
              <SectionHeader
                icon={Info}
                title="About Euphoria"
                description="Platform information and compliance"
              />
              <Card>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Version", value: "1.0.0-mvp" },
                      { label: "Network", value: "BNB Chain" },
                      { label: "AI Provider", value: "OpenRouter" },
                      { label: "Models", value: "Gemini 2.5" },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg bg-bg-elevated px-3.5 py-3 border border-border-subtle">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-sm font-mono font-medium text-text-primary">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-1">Not Financial Advice</p>
                        <p className="text-xs text-amber-600/90 leading-relaxed">
                          Euphoria outputs are psychological market signals for research and educational purposes only.
                          They do not constitute financial, investment, or trading advice. Always do your own research
                          before making any financial decisions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-text-muted">Built for BNB Chain hackathon</span>
                    <a
                      href="https://bnbchain.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent-emerald hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:rounded"
                    >
                      BNB Chain
                      <ExternalLink className="w-3 h-3" aria-hidden />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
