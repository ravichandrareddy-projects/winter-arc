"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { addDaysKey, monthDayShort } from "@/lib/dates";
import { heatValue, useWinterArc } from "@/lib/store";

const ROWS = [
  { kind: "sleep", label: "Sleep", color: "#a78bfa" },
  { kind: "wake", label: "Wake Up", color: "#fbbf24" },
  { kind: "fitness", label: "Fitness", color: "#38bdf8" },
  { kind: "food", label: "Food", color: "#4ade80" },
] as const;

function cellBg(v: number | null, color: string): React.CSSProperties {
  if (v == null || v <= 0) return {};
  if (v >= 1) return { backgroundColor: color };
  return { backgroundColor: `${color}88` };
}

export function HabitHeatmap({ endDate }: { endDate: string }) {
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const meals = useWinterArc((s) => s.meals);
  const targets = useWinterArc((s) => s.nutritionTargets);
  const [range, setRange] = useState<7 | 14 | 30>(14);

  const days = useMemo(
    () => Array.from({ length: range }, (_, i) => addDaysKey(endDate, i - (range - 1))),
    [endDate, range]
  );
  const labelIdx = [0, 1, 2, 3].map((k) => Math.round(((days.length - 1) / 3) * k));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="flex-1 text-base font-extrabold">Habit Completion</h2>
        <button
          onClick={() => setRange((r) => (r === 7 ? 14 : r === 14 ? 30 : 7))}
          aria-label="Change range"
          className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
        >
          Last {range} Days
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </button>
      </div>
      <p className="mb-3 text-xs text-muted">Daily completion rate for each habit.</p>
      <div className="nice-scroll overflow-x-auto">
        <div style={{ minWidth: Math.max(420, 90 + days.length * 26) }}>
          <div className="flex items-center gap-1.5">
            <span className="w-16 shrink-0" />
            {days.map((d) => (
              <span key={d} className="h-6 flex-1 rounded-md" />
            ))}
          </div>
          {ROWS.map((r) => (
            <div key={r.kind} className="mt-1.5 flex items-center gap-1.5">
              <span className="w-16 shrink-0 truncate text-xs font-semibold">{r.label}</span>
              {days.map((d) => {
                const v = heatValue(r.kind, trackers, entries, meals, targets, d);
                return (
                  <span
                    key={d}
                    title={`${r.label} ${monthDayShort(d)}: ${v == null ? "—" : `${Math.round(v * 100)}%`}`}
                    className="h-6 flex-1 rounded-md border border-border"
                    style={cellBg(v, r.color)}
                  />
                );
              })}
            </div>
          ))}
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted">
            <span className="w-16 shrink-0" />
            {labelIdx.map((i) => (
              <span key={i} className="flex-1">
                {monthDayShort(days[i])}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
