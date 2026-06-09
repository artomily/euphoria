export function formatUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) {
    return `$${(n / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toFixed(2)}K`;
  }
  return `$${n.toFixed(2)}`;
}

export function formatPercent(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toFixed(0);
}

export function formatScore(n: number): string {
  return `${Math.round(n)}/100`;
}

export function fomoLevelLabel(score: number): string {
  if (score >= 80) return "Euphoria";
  if (score >= 60) return "FOMO";
  if (score >= 40) return "Bullish";
  if (score >= 20) return "Interest";
  return "Calm";
}

export function fomoLevelColor(score: number): string {
  if (score >= 80) return "text-red-400";
  if (score >= 60) return "text-orange-400";
  if (score >= 40) return "text-yellow-400";
  if (score >= 20) return "text-lime-400";
  return "text-emerald-400";
}

export function fomoLevelBg(score: number): string {
  if (score >= 80) return "bg-red-500/10 border-red-500/20";
  if (score >= 60) return "bg-orange-500/10 border-orange-500/20";
  if (score >= 40) return "bg-yellow-500/10 border-yellow-500/20";
  if (score >= 20) return "bg-lime-500/10 border-lime-500/20";
  return "bg-emerald-500/10 border-emerald-500/20";
}

export function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
