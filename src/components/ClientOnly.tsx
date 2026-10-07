"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { WinterArcWordmark } from "./brand";

const subscribe = () => () => {};

/** Keep browser-local tracking state out of the server hydration snapshot. */
export function ClientOnly({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) {
    return (
      <div role="status" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
        <WinterArcWordmark />
        <p className="text-sm text-muted">Loading your Winter Arc…</p>
      </div>
    );
  }
  return <>{children}</>;
}
