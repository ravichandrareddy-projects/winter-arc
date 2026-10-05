"use client";

import { BarChart3, Moon } from "lucide-react";
import { Fragment } from "react";
import { LineChart } from "../LineChart";
import { TrackerBadge, TrackerGlyph } from "../icons";
import { addDaysKey, formatNumber, parseKey } from "@/lib/dates";
import { format } from "date-fns";
import {
  selectDayCompletion,
  selectEntriesFor,
  selectIsCompleted,
  selectLastNDays,
  selectTrackersForDate,
  useWinterArc,
  weekdayLetter,
} from "@/lib/store";
import type { DayPoint } from "@/lib/store";
import type { Tracker } from "@/lib/types";

function SummaryCard({ tracker, date }: { tracker: Tracker; date: string }) {
  const entries = useWinterArc((s) => s.entries);
  const points = selectLastNDays(tracker, entries, date, 7);
  const dayEntries = selectEntriesFor(entries, tracker.id, date);
  const total = points[points.length - 1]?.total ?? 0;
  const target = tracker.target;
  const pct =
    target != null && target > 0
      ? Math.min(100, Math.round((total / target) * 100))
      : total > 0
        ? 100
        : 0;
  const unit = tracker.unit ? ` ${tracker.unit}` : "";
  const labels = points.map((p) => format(parseKey(p.date), "d"));

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-2">
        <TrackerBadge icon={tracker.icon} color={tracker.color} size="sm" />
        <p className="flex-1 truncate text-[13px] font-bold">{tracker.name}</p>
        <span className="text-[11px] font-bold" style={{ color: tracker.color }}>
          {pct}%
        </span>
      </div>
      <p className="mt-1.5 text-lg font-extrabold">
        {formatNumber(+total.toFixed(2))}
        <span className="text-sm font-semibold text-muted">
          {target != null ? ` / ${formatNumber(target)}${unit}` : unit}
        </span>
      </p>
      <LineChart
        values={points.map((p) => p.total)}
        color={tracker.color}
        height={56}
        yLabels={false}
        gid={`sg-${tracker.id.replace(/[^a-z0-9]/gi, "")}`}
      />
      <div className="flex justify-between text-[10px] text-muted">
        {labels.map((l, i) => (
          <span key={i}>{i === 0 ? `Oct` : l}</span>
        ))}
      </div>
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
        <circle cx="42" cy="42" r={R} fill="none" strokeWidth="9" className="stroke-track" />
        <circle
          cx="42"
          cy="42"
          r={R}
          fill="none"
          stroke="#4ade80"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (pct / 100) * C}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold">
        {pct}%
      </span>
    </div>
  );
}

function ThisWeek({ date }: { date: string }) {
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  // Monday-start week containing selected date
  const dow = (parseKey(date).getDay() + 6) % 7;
  const monday = addDaysKey(date, -dow);
  const days = Array.from({ length: 7 }, (_, i) => addDaysKey(monday, i));
  const rows = [...trackers]
    .filter((t) => t.status === "active" && t.target != null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5);
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-sm font-bold">This Week</p>
      <div className="grid grid-cols-[auto_repeat(7,1fr)] items-center gap-x-1.5 gap-y-1.5">
        <span />
        {names.map((n) => (
          <span key={n} className="text-center text-[10px] text-muted">
            {n}
          </span>
        ))}
        {rows.map((t) => (
          <Fragment key={t.id}>
            <TrackerGlyph icon={t.icon} className="h-3.5 w-3.5" style={{ color: t.color }} />
            {days.map((d) => {
              const list = selectEntriesFor(entries, t.id, d);
              const done = selectIsCompleted(t, list);
              const partial = !done && list.length > 0;
              return (
                <span key={d} className="flex justify-center">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${!done && !partial ? "bg-track" : ""}`}
                    style={
                      done
                        ? { backgroundColor: t.color }
                        : partial
                          ? { backgroundColor: `${t.color}66` }
                          : undefined
                    }
                  />
                </span>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function Summary({ date }: { date: string }) {
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);

  if (!trackers.some((t) => t.status === "active")) return null;

  const visible = selectTrackersForDate(trackers, date);
  const completion = selectDayCompletion(trackers, entries, date);
  const sparkTrackers = visible
    .filter((t) => t.type !== "time" && t.type !== "boolean")
    .slice(0, 5);
  const keyList = visible.filter((t) => t.target != null).slice(0, 4);

  return (
    <section aria-label="Today's summary" className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-base font-extrabold">
        <BarChart3 className="h-5 w-5 text-accent" />
        Today&apos;s Summary
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {sparkTrackers.map((t) => (
          <SummaryCard key={t.id} tracker={t} date={date} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <Ring pct={completion.pct} />
          <div>
            <p className="text-sm font-bold">
              {completion.done} of {completion.total}
            </p>
            <p className="text-xs text-muted">trackers completed</p>
          </div>
          <div className="flex flex-1 flex-wrap gap-x-6 gap-y-2">
            {keyList.map((t) => {
              const total = selectLastNDays(t, entries, date, 1)[0]?.total ?? 0;
              return (
                <div key={t.id} className="min-w-[110px]">
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <TrackerGlyph icon={t.icon} className="h-3.5 w-3.5" style={{ color: t.color }} />
                    {t.name}
                  </p>
                  <p className="text-sm font-extrabold">
                    {formatNumber(+total.toFixed(2))}
                    <span className="font-semibold text-muted">
                      {" "}
                      / {t.target != null ? formatNumber(t.target) : "—"}
                      {t.unit ? ` ${t.unit}` : ""}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <ThisWeek date={date} />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Moon className="h-3.5 w-3.5" /> {weekdayLetter(date)} — gaps are real gaps, never filled.
      </p>
    </section>
  );
}
