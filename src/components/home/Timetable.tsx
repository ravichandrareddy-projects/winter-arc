"use client";

import { Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { TrackerGlyph } from "../icons";
import { formatCompact, formatNumber, formatTime12, currentSlot, isSlotReached } from "@/lib/dates";
import { displayValue } from "@/lib/units";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import {
  selectDailyTotal,
  selectEntriesFor,
  selectProgressPct,
  useWinterArc,
} from "@/lib/store";
import { TIME_SLOTS } from "@/lib/types";
import type { Tracker } from "@/lib/types";

function CellValue({ tracker, date, slot }: { tracker: Tracker; date: string; slot: (typeof TIME_SLOTS)[number]["slot"] }) {
  const entries = useWinterArc((s) => s.entries);
  const list = selectEntriesFor(entries, tracker.id, date).filter((e) => e.slot === slot);
  const toggleSlot = useWinterArc((s) => s.toggleSlot);
  const units = useWinterArc((s) => s.preferences.units);
  const has = list.length > 0;
  const open = has || isSlotReached(date, slot);
  const isLive = !has && open && currentSlot(date, TIME_SLOTS.map((s) => s.slot)) === slot;
  const pathname = usePathname();

  useAuthResume((a) => {
    const p = a.payload ?? {};
    if (p.trackerId !== tracker.id || p.date !== date || p.slot !== slot) return;
    if (p.op === "toggle-slot") {
      useWinterArc.getState().toggleSlot(tracker.id, date, slot);
    }
  });

  let inner: React.ReactNode = null;
  if (has) {
    const v = list.reduce<number>(
      (sum, e) => sum + (typeof e.value === "number" ? e.value : 0),
      0
    );
    const first = list[0].value;
    if (tracker.type === "boolean" || first === true) {
      inner = <Check className="h-4 w-4 text-white" />;
    } else if (typeof first === "string") {
      inner = <span className="px-0.5 text-[10px] font-bold text-white">{formatTime12(first).replace(" ", "")}</span>;
    } else {
      inner = <span className="text-[11px] font-bold text-white">{formatCompact(+displayValue(tracker, v, units).toFixed(2))}{tracker.type === "duration" && tracker.unit === "hours" ? "h" : ""}</span>;
    }
  }

  return (
    <button
      onClick={() =>
        requireAuth({
          route: pathname,
          label: `Log ${tracker.name}`,
          payload: { trackerId: tracker.id, date, slot, op: "toggle-slot" },
          replay: () => toggleSlot(tracker.id, date, slot),
        })
      }
      disabled={!open}
      aria-label={`${tracker.name} at ${slot}${has ? " (remove)" : ""}`}
      className={`flex h-9 min-w-9 flex-1 items-center justify-center rounded-lg border backdrop-blur-sm transition-colors ${
        has
          ? "border-transparent"
          : isLive
            ? "border-accent bg-accent-soft"
            : "border-foreground/25 bg-white/[0.06] hover:border-foreground/40"
      }`}
      style={has ? { backgroundColor: tracker.color } : undefined}
    >
      {inner}
    </button>
  );
}

export function Timetable({ trackers, date }: { trackers: Tracker[]; date: string }) {
  const entries = useWinterArc((s) => s.entries);

  if (trackers.length === 0) {
    return (
      <div className="nice-scroll overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="min-w-[860px]" role="grid" aria-label="Timetable">
          <div className="flex items-center gap-1 border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <span className="w-40 shrink-0">Habit / Tracker</span>
            <span className="w-20 shrink-0">Target</span>
            {TIME_SLOTS.map((s) => (
              <span key={s.slot} className="flex-1 text-center">{s.label}</span>
            ))}
            <span className="w-36 shrink-0 text-right">Progress</span>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} role="row" className="flex items-center gap-1 border-b border-border/50 px-3 py-2.5 last:border-0 opacity-60">
              <span className="flex w-40 shrink-0 items-center gap-2">
                <span className="h-4 w-4 rounded-full border border-dashed border-border" />
                <span className="text-[13px] font-medium text-muted">Empty Slot {i + 1}</span>
              </span>
              <span className="w-20 shrink-0 text-xs text-muted">—</span>
              {TIME_SLOTS.map((s) => (
                <div key={s.slot} className="flex h-9 min-w-9 flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 bg-white/[0.02]" />
              ))}
              <span className="flex w-36 shrink-0 items-center justify-end gap-2 text-xs text-muted">
                0%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="nice-scroll overflow-x-auto rounded-2xl border border-border bg-card">
      <div className="min-w-[860px]" role="grid" aria-label="Timetable">
        {/* head */}
        <div className="flex items-center gap-1 border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <span className="w-40 shrink-0">Habit / Tracker</span>
          <span className="w-20 shrink-0">Target</span>
          {TIME_SLOTS.map((s) => (
            <span key={s.slot} className="flex-1 text-center">{s.label}</span>
          ))}
          <span className="w-36 shrink-0 text-right">Progress</span>
        </div>
        {trackers.map((t) => {
          const dayEntries = selectEntriesFor(entries, t.id, date);
          const total = selectDailyTotal(t, dayEntries);
          const pct = selectProgressPct(t, dayEntries);
          const targetLabel =
            t.target != null ? `${formatNumber(t.target)}${t.unit ? ` ${t.unit}` : ""}` : t.type === "boolean" ? "1 session" : t.type === "time" ? "daily" : "—";
          return (
            <div key={t.id} role="row" className="flex items-center gap-1 border-b border-border px-3 py-2 last:border-0">
              <span className="flex w-40 shrink-0 items-center gap-2">
                <TrackerGlyph icon={t.icon} className="h-4 w-4 shrink-0" style={{ color: t.color }} />
                <span className="truncate text-[13px] font-semibold">{t.name}</span>
              </span>
              <span className="w-20 shrink-0 text-xs text-muted">{targetLabel}</span>
              {TIME_SLOTS.map((s) => (
                <CellValue key={s.slot} tracker={t} date={date} slot={s.slot} />
              ))}
              <span className="flex w-36 shrink-0 items-center justify-end gap-2">
                <span className="text-xs font-bold">
                  {t.type === "time"
                    ? typeof dayEntries[0]?.value === "string"
                      ? formatTime12(dayEntries[0].value as string)
                      : "—"
                    : t.type === "boolean"
                      ? `${total} / 1`
                      : `${formatNumber(+total.toFixed(2))}${t.target != null && t.unit ? ` / ${formatNumber(t.target)}` : ""}`}
                </span>
                <span className="h-1 w-14 overflow-hidden rounded-full bg-track">
                  <span className="block h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: t.color }} />
                </span>
                <span className="w-8 text-right text-[11px] font-bold" style={{ color: t.color }}>{t.type === "time" ? "–" : `${pct}%`}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
