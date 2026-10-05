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
  return <>{children}</>;
}
