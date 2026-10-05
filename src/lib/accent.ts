import type { Accent } from "./store";

export const ACCENTS: Record<Accent, { label: string; hex: string; soft: string }> = {
  blue: { label: "Blue", hex: "#2e9bff", soft: "rgba(46, 155, 255, 0.16)" },
  green: { label: "Green", hex: "#22c55e", soft: "rgba(34, 197, 94, 0.16)" },
  purple: { label: "Purple", hex: "#a78bfa", soft: "rgba(167, 139, 250, 0.18)" },
  orange: { label: "Orange", hex: "#fb923c", soft: "rgba(251, 146, 60, 0.18)" },
};

/** Applies the accent app-wide (wordmark, pills, toggles, rings follow the CSS vars). */
export function applyAccent(accent: Accent): void {
  if (typeof document === "undefined") return;
  const a = ACCENTS[accent] ?? ACCENTS.blue;
  const root = document.documentElement;
  root.style.setProperty("--accent", a.hex);
  root.style.setProperty("--accent-soft", a.soft);
}
