"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { consistencyPct, useWinterArc, weekWindows } from "@/lib/store";

function Ring({ pct }: { pct: number | null }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const v = pct ?? 0;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 124 124" className="h-full w-full -rotate-90">
        <circle cx="62" cy="62" r={R} fill="none" strokeWidth="12" className="stroke-track" />
        <circle
          cx="62"
          cy="62"
          r={R}
          fill="none"
          stroke="#4ade80"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (Math.max(0, Math.min(100, v)) / 100) * C}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <span className="text-2xl font-extrabold">
          {pct == null ? "—" : `${Math.round(pct)}%`}
        </span>
        <span className="text-xs text-muted">Overall</span>
      </span>
    </div>
  );
}

export function OverallConsistency({ endDate }: { endDate: string }) {
  const arc = useWinterArc((s) => s.arc);
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const [mode, setMode] = useState<7 | 30>(7);

  const data = useMemo(() => {
    if (!arc) return { overall: null as number | null, wins: [] as { pct: number | null; label: string; sub: string }[] };
    const wins = weekWindows(arc.startDate, endDate, mode);
    const overall = consistencyPct(trackers, entries, arc.startDate, endDate);
    return {
      overall,
      wins: wins.map((w) => ({
        pct: consistencyPct(trackers, entries, w.from, w.to),
        label: w.label,
        sub: w.sub,
      })),
    };
  }, [arc, trackers, entries, endDate, mode]);

  const maxBars = 12;
  const wins = data.wins.slice(-maxBars);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="flex-1 text-base font-extrabold">Overall Consistency</h2>
        <button
          onClick={() => setMode((m) => (m === 7 ? 30 : 7))}
          aria-label="Change grouping"
          className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
        >
          {mode === 7 ? "Weekly" : "Monthly"}
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </button>
      </div>
      <p className="mb-3 text-xs text-muted">How consistent you&apos;ve been across all habits.</p>
      <div className="flex flex-wrap items-center gap-5">
        <Ring pct={data.overall} />
        <div className="flex min-w-0 flex-1 items-end gap-2">
          <div className="flex w-8 shrink-0 flex-col justify-between self-stretch py-1 text-right text-[10px] leading-none text-muted">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <div className="flex min-w-0 flex-1 items-end gap-1.5">
            {wins.length === 0 && (
              <p className="text-xs text-muted">No weeks yet.</p>
            )}
            {wins.map((w) => (
              <div key={w.label + w.sub} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="flex h-28 w-full items-end rounded-lg bg-card-2/60">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-green-600 to-green-400"
                    style={{ height: `${w.pct ?? 0}%` }}
                    title={`${w.label}: ${w.pct == null ? "—" : `${Math.round(w.pct)}%`}`}
                  />
                </div>
                <span className="text-[10px] font-bold">{w.label}</span>
                <span className="truncate text-[9px] text-muted">{w.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
