"use client";

interface GreetingProps {
  userName?: string;
  subtitle?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Greeting({
  userName = "Trader",
  subtitle = "AI-powered market psychology · BNB Chain",
}: GreetingProps) {
  const greeting = getGreeting();
  const date = formatDate();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
      </div>
      <span className="text-sm text-[var(--text-muted)] mt-1 shrink-0">{date}</span>
    </div>
  );
}
