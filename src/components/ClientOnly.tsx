"use client";

import { useEffect, useState, type ReactNode } from "react";
import { WinterArcWordmark } from "./brand";

/**
 * Renders children only after mount. Server and first client render output
 * the identical skeleton, so hydration always matches — browser extensions
 * mutating the live DOM can't break it afterwards (no comparison happens).
 * Right call for a local-first PWA: no SEO content is lost.
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="flex min-h-dvh items-center justify-center bg-background">
        <div className="animate-pulse opacity-70">
          <WinterArcWordmark />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
