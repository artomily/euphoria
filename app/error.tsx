"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
          <AlertCircle className="w-5 h-5 text-signal-sell" aria-hidden />
        </div>
        <h1 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h1>
        <p className="text-sm text-text-secondary mb-6">
          This is usually a network hiccup. The analysis data failed to load.
        </p>
        <Button onClick={reset} variant="outline" className="gap-2 mx-auto">
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          Try again
        </Button>
      </div>
    </div>
  );
}
