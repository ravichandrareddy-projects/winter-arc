"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet } from "../Sheet";
import { monthDayShort, weekdayShort, currentSlot, todayKey } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import {
  bedtimeMinutes,
  selectBedtime,
  sleepBand,
  wakeBand,
  SLEEP_BAND_COLORS,
  WAKE_BAND_COLORS,
  useWinterArc,
} from "@/lib/store";
import { buildSleepRows, DEFAULT_SLEEP_WINDOW, DEFAULT_WAKE_WINDOW } from "@/lib/types";
import type { Tracker } from "@/lib/types";

const ROW_H = 44; // px, vertical only — horizontal stretches fluidly
const MIN_COL = 44;

export type TimeMode = "sleep" | "wake";

export function TimeGrid({
  tracker,
  days,
  selectedDate,
  onSelectDate,
  mode,
}: {
  tracker: Tracker;
  days: string[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  mode: TimeMode;
}) {
  const entries = useWinterArc((s) => s.entries);
  const logSingle = useWinterArc((s) => s.logSingle);
  const clearDayEntry = useWinterArc((s) => s.clearDayEntry);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  // user-chosen window — grid rebuilds from it.
  // sleep: reversed (latest on top). wake: chrono (earliest on top).
  const defaults = mode === "sleep" ? DEFAULT_SLEEP_WINDOW : DEFAULT_WAKE_WINDOW;
  const winStart = tracker.windowStart ?? defaults.start;
  const winEnd = tracker.windowEnd ?? defaults.end;
  const baseHour = Number(winStart.split(":")[0]);
  const chrono = mode === "wake";
  const bandFor = mode === "sleep" ? sleepBand : wakeBand;
  const bandColors = mode === "sleep" ? SLEEP_BAND_COLORS : WAKE_BAND_COLORS;
  const noun = mode === "sleep" ? "Bedtime" : "Wake up";
  const rows = useMemo(
    () => buildSleepRows(winStart, winEnd, chrono ? "chrono" : "reversed"),
    [winStart, winEnd, chrono]
  );
  const ROWS = rows.length;
  const H = ROWS * ROW_H;
  const yRow = (mins: number): number => {
    const y = chrono ? 0.5 + mins / 60 : ROWS - 0.5 - mins / 60;
    return Math.max(0.12, Math.min(ROWS - 0.12, y));
  };

  const points = useMemo(
    () =>
      days.map((d) => {
        const v = selectBedtime(entries, tracker.id, d);
        const mins = v ? bedtimeMinutes(v, baseHour) : null;
        return { date: d, value: v, mins };
      }),
    [days, entries, tracker.id, baseHour]
  );

  // point runs in column/row units: consecutive logged days only (gaps break the line)
  const runs = useMemo(() => {
    const out: { x: number; y: number }[][] = [];
    let cur: { x: number; y: number }[] = [];
    let lastIdx = -10;
    points.forEach((p, i) => {
      if (p.mins == null) {
        if (cur.length > 1) out.push(cur);
        cur = [];
        lastIdx = -10;
        return;
      }
      if (i - lastIdx > 1 && cur.length > 0) {
        if (cur.length > 1) out.push(cur);
        cur = [];
      }
      cur.push({ x: i + 0.5, y: yRow(p.mins) });
      lastIdx = i;
    });
    if (cur.length > 1) out.push(cur);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, ROWS]);

  /** Catmull-Rom -> cubic Bezier: smooth curve through every dot. */
  const smoothPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const W = days.length;

  const openEdit = (date: string) => {
    setDraft(selectBedtime(entries, tracker.id, date) ?? "");
    setEditDate(date);
  };
  const pathname = usePathname();

  const tapCell = (d: string, slot: string, logged: boolean) => {
    if (logged) {
      const date = d;
      requireAuth({
        route: pathname,
        label: `Edit ${tracker.name}`,
        payload: { trackerId: tracker.id, date, sheet: "time-edit" },
        replay: () => openEdit(date),
      });
      return;
    }
    const value = `${slot.slice(0, 2)}:00`;
    requireAuth({
      route: pathname,
      label: `Log ${tracker.name}`,
      payload: { trackerId: tracker.id, date: d, op: "log-slot", slot, value },
      replay: () => logSingle(tracker.id, d, value, true, slot),
    });
  };

  useAuthResume((a) => {
    const p = a.payload ?? {};
    if (p.trackerId !== tracker.id) return;
    const st = useWinterArc.getState();
    if (p.sheet === "time-edit" && typeof p.date === "string") {
      openEdit(p.date);
    } else if (
      p.op === "log-slot" &&
      typeof p.date === "string" &&
      typeof p.slot === "string" &&
      typeof p.value === "string"
    ) {
      st.logSingle(tracker.id, p.date, p.value, true, p.slot);
    }
  });

  // the live box right now (today's column, latest passed hour) — glows, the rest don't
  const live = currentSlot(todayKey(), rows.map((r) => r.slot));
  const today = todayKey();

  return (
    <div className="nice-scroll overflow-x-auto rounded-2xl border border-border bg-card p-3">
      <div style={{ minWidth: 56 + days.length * MIN_COL }}>
        {/* day headers */}
        <div className="flex">
          <span className="w-14 shrink-0" />
          {days.map((d) => (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`flex min-w-[44px] flex-1 flex-col items-center rounded-lg py-1 text-[11px] ${
                d === selectedDate ? "bg-accent-soft font-bold" : "text-muted"
              }`}
            >
              <span className={d === selectedDate ? "" : "text-foreground"}>{monthDayShort(d)}</span>
              <span>{weekdayShort(d)}</span>
            </button>
          ))}
        </div>

        <div className="flex">
          {/* time labels */}
          <div className="w-14 shrink-0">
            {rows.map((r) => (
              <div key={r.slot} className="flex h-11 items-center text-[11px] text-muted">
                {r.label}
              </div>
            ))}
          </div>

          {/* grid + line + dots */}
          <div className="relative flex-1" style={{ minWidth: days.length * MIN_COL, height: H }}>
            {/* cells */}
            {rows.map((r) => (
              <div key={r.slot} className="flex h-11">
                {days.map((d, di) => {
                  const logged = points[di]?.mins != null;
                  const isLive = !logged && d === today && r.slot === live;
                  return (
                    <button
                      key={`${d}-${r.slot}`}
                      onClick={() => tapCell(d, r.slot, logged)}
                      aria-label={`${monthDayShort(d)} ${r.label}${logged ? " (edit)" : ""}`}
                      className="flex min-w-[44px] flex-1 items-center justify-center"
                    >
                      <span
                        className={`block h-6 w-6 rounded-md border backdrop-blur-sm ${
                          isLive
                            ? "border-accent"
                            : d === selectedDate
                              ? "border-foreground/30 bg-white/[0.05]"
                              : "border-foreground/25 bg-white/[0.05]"
                        } ${logged ? "opacity-0" : "opacity-100"}`}
                        style={
                          isLive
                            ? { boxShadow: "0 0 10px 1px var(--accent)", backgroundColor: "var(--accent-soft)" }
                            : undefined
                        }
                      />
                    </button>
                  );
                })}
              </div>
            ))}
            {/* selected column tint */}
            {days.map((d, di) =>
              d === selectedDate ? (
                <div
                  key={`tint-${d}`}
                  className="pointer-events-none absolute inset-y-0 rounded-lg bg-accent-soft"
                  style={{ left: `${(di / W) * 100}%`, width: `${100 / W}%` }}
                />
              ) : null
            )}
            {/* trend line */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${W} ${ROWS}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sleepCurveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="35%" stopColor="#4ade80" />
                  <stop offset="65%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              {runs.map((run, ri) => (
                <g key={ri}>
                  <path
                    d={smoothPath(run)}
                    fill="none"
                    stroke="url(#sleepCurveGrad)"
                    strokeOpacity="0.35"
                    strokeWidth="7"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={smoothPath(run)}
                    fill="none"
                    stroke="url(#sleepCurveGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>
            {/* dots */}
            {points.map((p, di) => {
              if (p.mins == null || !p.value) return null;
              const [h, m] = p.value.split(":").map(Number);
              const band = bandFor(h * 60 + m);
              const color = bandColors[band];
              return (
                <button
                  key={`dot-${p.date}`}
                  onClick={() => openEdit(p.date)}
                  aria-label={`${monthDayShort(p.date)} bedtime ${p.value} (edit)`}
                  className="absolute z-10 block rounded-[6px]"
                  style={{
                    left: `${((di + 0.5) / W) * 100}%`,
                    top: `${(yRow(p.mins) / ROWS) * 100}%`,
                    width: 20,
                    height: 20,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: color,
                    boxShadow: `0 0 12px 2px ${color}`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* edit sheet */}
      <Sheet open={!!editDate} onClose={() => setEditDate(null)} label={`Edit ${noun.toLowerCase()}`}>
        <h2 className="mb-1 text-base font-bold">
          {noun} {editDate ? `— ${monthDayShort(editDate)}` : ""}
        </h2>
        <input
          type="time"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-2 h-14 w-full rounded-xl border border-border bg-background px-4 text-lg"
        />
        <button
          onClick={() => {
            if (editDate && draft) {
              const hh = draft.slice(0, 2);
              logSingle(tracker.id, editDate, draft, true, `${hh}:00`);
            }
            setEditDate(null);
          }}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          SAVE
        </button>
        <button
          onClick={() => {
            if (editDate) clearDayEntry(tracker.id, editDate);
            setEditDate(null);
          }}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-semibold"
        >
          CLEAR
        </button>
      </Sheet>
    </div>
  );
}
