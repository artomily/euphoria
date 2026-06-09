import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-border-subtle mb-5">
          <Compass className="w-5 h-5 text-text-muted" aria-hidden />
        </div>
        <p className="font-mono text-4xl font-semibold text-text-muted mb-3">404</p>
        <h1 className="text-lg font-semibold text-text-primary mb-2">Page not found</h1>
        <p className="text-sm text-text-secondary mb-6">
          This page doesn&apos;t exist. Head back to the dashboard to analyze a token.
        </p>
        <Link href="/dashboard">
          <Button className="mx-auto">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
