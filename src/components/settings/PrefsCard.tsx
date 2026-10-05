"use client";

import { Globe, LayoutGrid, Link2, Palette, Scale, Sun } from "lucide-react";
import { SettingsCard, field } from "./SettingsCard";
import { ThemeToggle } from "../ThemeToggle";
import { ACCENTS } from "@/lib/accent";
import { requireAuth } from "@/lib/auth-guard";
import { useWinterArc, type Accent, type StartTab, type Units } from "@/lib/store";

const TABS: { v: StartTab; label: string }[] = [
  { v: "/", label: "Home" },
  { v: "/sleep", label: "Sleep" },
  { v: "/wake-up", label: "Wake Up" },
  { v: "/fitness", label: "Fitness" },
  { v: "/food", label: "Food" },
  { v: "/progress", label: "Progress" },
];

export function PrefsCard() {
  const preferences = useWinterArc((s) => s.preferences);
  const setPreferences = useWinterArc((s) => s.setPreferences);

  return (
    <SettingsCard
      icon={<Palette className="h-6 w-6 text-accent" />}
      title="App Preferences"
      sub="Customize the appearance and behavior."
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm">
            <Sun className="h-4 w-4 text-muted" /> Theme
          </p>
          <ThemeToggle />
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm">
            <Link2 className="h-4 w-4 text-muted" /> Accent Color
          </p>
          <div className="flex gap-2">
            {(Object.keys(ACCENTS) as Accent[]).map((a) => (
              <button
                key={a}
                onClick={() => requireAuth({ route: "/settings", label: "Change accent", replay: () => setPreferences({ accent: a }) })}
                aria-pressed={preferences.accent === a}
                aria-label={`${ACCENTS[a].label} accent`}
                className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold capitalize ${
                  preferences.accent === a ? "border-foreground" : "border-border"
                }`}
              >
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: ACCENTS[a].hex }} />
                {ACCENTS[a].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="pf-units" className="flex flex-1 items-center gap-1.5 text-sm">
            <Scale className="h-4 w-4 text-muted" /> Units
          </label>
          <select
            id="pf-units"
            value={preferences.units}
            onChange={(e) => {
              const v = e.target.value as Units;
              requireAuth({ route: "/settings", label: "Change units", replay: () => setPreferences({ units: v }) });
            }}
            className={`${field} max-w-[220px]`}
          >
            <option value="metric">Metric (kg, km)</option>
            <option value="imperial">Imperial (lb, mi)</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="pf-tab" className="flex flex-1 items-center gap-1.5 text-sm">
            <LayoutGrid className="h-4 w-4 text-muted" /> Default Start Tab
          </label>
          <select
            id="pf-tab"
            value={preferences.startTab}
            onChange={(e) => {
              const v = e.target.value as StartTab;
              requireAuth({ route: "/settings", label: "Change start tab", replay: () => setPreferences({ startTab: v }) });
            }}
            className={`${field} max-w-[220px]`}
          >
            {TABS.map((t) => (
              <option key={t.v} value={t.v}>{t.label}</option>
            ))}
          </select>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Globe className="h-3.5 w-3.5" /> English only for now — more languages later.
        </p>
      </div>
    </SettingsCard>
  );
}
