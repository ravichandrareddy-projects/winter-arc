"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime crashes
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 mb-4 shadow-lg shadow-red-500/10">
        <span className="text-2xl font-bold">!</span>
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight">Winter Arc</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        A temporary display error occurred. Your protocol data is safely preserved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-xs font-extrabold text-background hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
        <button
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "/";
          }}
          className="flex h-11 items-center rounded-full border border-border bg-card px-6 text-xs font-bold text-foreground hover:border-accent transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
