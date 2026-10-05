"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Footprints, Moon, Scale, Sun } from "lucide-react";
import { LineChart } from "../LineChart";
import { DeltaPill } from "./KpiCards";
import { addDaysKey, formatNumber, monthDayShort } from "@/lib/dates";
import { formatTime12 } from "@/lib/dates";
import { displayUnit, displayValue } from "@/lib/units";
import {
  delta,
  selectDailyTotal,
  selectEntriesFor,
  sleepDurationHours,
  useWinterArc,
  wakeMinutes,
  type Delta,
} from "@/lib/store";

function fmtDurAxis(v: number): string {
  return `${Math.round(v)}h`;
}
function fmtClockAxis(v: number): string {
  const h = Math.round(v / 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}
function fmtMinOfDay(v: number): string {
  const h = Math.floor(v / 60);
  const m = Math.round(v % 60);
  return formatTime12(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

function Card({
  icon,
  name,
  color,
  values,
  days,
  formatY,
  avgLabel,
  d,
}: {
  icon: React.ReactNode;
  name: string;
  color: string;
  values: (number | null)[];
  days: string[];
  formatY: (v: number) => string;
  avgLabel: string;
  d: Delta;
}) {
  const gid = `pt-${name.replace(/[^a-z0-9]/gi, "")}`;
  const ticks = [0, 1, 2, 3].map((k) => Math.round(((days.length - 1) / 3) * k));
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <p className="flex-1 text-[13px] font-bold">{name}</p>
      </div>
      <LineChart values={values} color={color} height={76} gid={gid} formatY={formatY} />
      <div className="flex justify-between text-[10px] text-muted">
        {ticks.map((i) => (
          <span key={i}>{monthDayShort(days[i])}</span>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-[13px] font-bold">
          Avg: <span className="font-extrabold">{avgLabel}</span>
        </p>
        <DeltaPill d={d} />
      </div>
    </div>
  );
}

export function ProgressTrends({ endDate }: { endDate: string }) {
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const [range, setRange] = useState<7 | 14 | 30>(14);

  const days = useMemo(
    () => Array.from({ length: range }, (_, i) => addDaysKey(endDate, i - (range - 1))),
    [endDate, range]
  );
  const prevDays = useMemo(
    () => Array.from({ length: range }, (_, i) => addDaysKey(days[0], i - range)),
    [days]
  );

  const stepsTracker = trackers.find((t) => t.name.toLowerCase() === "steps");
  const weightTracker = trackers.find((t) => t.name.toLowerCase() === "weight");
  const units = useWinterArc((s) => s.preferences.units);

  const durVals = days.map((d) => {
    const v = sleepDurationHours(entries, trackers, d);
    return v == null ? null : +v.toFixed(2);
  });
  const wakeVals = days.map((d) => wakeMinutes(entries, trackers, d));
  const stepsVals = days.map((d) => {
    if (!stepsTracker) return null;
    const list = selectEntriesFor(entries, stepsTracker.id, d);
    return list.length === 0 ? null : +selectDailyTotal(stepsTracker, list).toFixed(0);
  });
  const weightVals = days.map((d) => {
    if (!weightTracker) return null;
    const list = selectEntriesFor(entries, weightTracker.id, d);
    return list.length === 0 ? null : +displayValue(weightTracker, selectDailyTotal(weightTracker, list), units).toFixed(1);
  });

  const avgOf = (vals: (number | null)[]) => {
    const n = vals.filter((v): v is number => v != null);
    return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
  };
  const avgDur = avgOf(durVals);
  const avgWake = avgOf(wakeVals);
  const avgSteps = avgOf(stepsVals);
  const avgWeight = avgOf(weightVals);

  const prevAvg = (fn: (d: string) => number | null) => {
    const n = prevDays.map(fn).filter((v): v is number => v != null);
    return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
  };
  const dDur = delta(avgDur, prevAvg((d) => sleepDurationHours(entries, trackers, d)), (v) => `${+v.toFixed(1)}h`, "up");
  const dWake = delta(avgWake, prevAvg((d) => wakeMinutes(entries, trackers, d)), (v) => {
    const m = Math.round(v);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
  }, "down");
  const dSteps = delta(avgSteps, prevAvg((d) => {
    if (!stepsTracker) return null;
    const list = selectEntriesFor(entries, stepsTracker.id, d);
    return list.length === 0 ? null : selectDailyTotal(stepsTracker, list);
  }), (v) => `+${formatNumber(Math.round(v))}`.replace("++", "+"), "up");
  const dWeight = delta(avgWeight, prevAvg((d) => {
    if (!weightTracker) return null;
    const list = selectEntriesFor(entries, weightTracker.id, d);
    return list.length === 0 ? null : displayValue(weightTracker, selectDailyTotal(weightTracker, list), units);
  }), (v) => `${+v.toFixed(1)} ${displayUnit(weightTracker ?? { unit: "kg" }, units) ?? "kg"}`, "down");

  // delta() already prefixes +/−; strip accidental doubles for steps
  const fixSteps = { ...dSteps, text: dSteps.text.replace("++", "+") };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setRange((r) => (r === 7 ? 14 : r === 14 ? 30 : 7))}
          aria-label="Change range"
          className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold"
        >
          Last {range} Days
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={<Moon className="h-4 w-4 text-violet-400" />}
          name="Sleep Trend"
          color="#a78bfa"
          values={durVals}
          days={days}
          formatY={fmtDurAxis}
          avgLabel={avgDur != null ? `${+avgDur.toFixed(1)} h` : "—"}
          d={dDur}
        />
        <Card
          icon={<Sun className="h-4 w-4 text-amber-400" />}
          name="Wake Up Trend"
          color="#fbbf24"
          values={wakeVals}
          days={days}
          formatY={fmtClockAxis}
          avgLabel={avgWake != null ? fmtMinOfDay(avgWake) : "—"}
          d={dWake}
        />
        <Card
          icon={<Footprints className="h-4 w-4 text-green-400" />}
          name="Steps Trend"
          color="#4ade80"
          values={stepsVals}
          days={days}
          formatY={(v) => (v >= 1000 ? `${+(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${Math.round(v)}`)}
          avgLabel={avgSteps != null ? formatNumber(Math.round(avgSteps)) : "—"}
          d={fixSteps}
        />
        <Card
          icon={<Scale className="h-4 w-4 text-green-400" />}
          name="Weight Trend"
          color="#34d399"
          values={weightVals}
          days={days}
          formatY={(v) => `${Math.round(v)}`}
          avgLabel={avgWeight != null ? `${+avgWeight.toFixed(1)} ${displayUnit(weightTracker ?? { unit: "kg" }, units) ?? "kg"}` : "—"}
          d={dWeight}
        />
      </div>
    </div>
  );
}
