"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Dumbbell, Minus, Moon, Sun, UtensilsCrossed } from "lucide-react";
import { LineChart } from "../LineChart";
import { addDaysKey } from "@/lib/dates";
import {
  delta,
  foodHealthyPct,
  selectEntriesFor,
  selectIsCompleted,
  selectTrackersForDate,
  sleepDurationHours,
  useWinterArc,
  wakeMinutes,
  windowKeys,
  type Delta,
} from "@/lib/store";
import { formatTime12 } from "@/lib/dates";

function fmtHours(v: number): string {
  return `${+v.toFixed(1)} h`;
}
function fmtMinOfDay(v: number): string {
  const h = Math.floor(v / 60);
  const m = Math.round(v % 60);
  return formatTime12(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}
function fmtPct(v: number): string {
  return `${Math.round(v)}%`;
}
function fmtClockDiff(v: number): string {
  const h = Math.floor(v / 60);
  const m = Math.round(v % 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export function DeltaPill({ d }: { d: Delta }) {
  if (d.good == null) {
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-card-2 px-2 py-0.5 text-[11px] font-bold text-muted">
        <Minus className="h-3 w-3" /> {d.text}
      </span>
    );
  }
  const Icon = d.good ? ArrowUp : ArrowDown;
  return (
    <span
      className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
        d.good ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      {d.text} <Icon className="h-3 w-3" />
    </span>
  );
}

interface Kpi {
  icon: React.ReactNode;
  name: string;
  value: string;
  sub: string;
  delta: Delta;
  spark: (number | null)[];
  color: string;
  gid: string;
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        {kpi.icon}
        <p className="flex-1 text-sm font-bold">{kpi.name}</p>
        <DeltaPill d={kpi.delta} />
      </div>
      <p className="mt-1.5 text-2xl font-extrabold">{kpi.value}</p>
      <p className="text-xs text-muted">{kpi.sub}</p>
      <div className="mt-2">
        <LineChart values={kpi.spark} color={kpi.color} height={52} yLabels={false} gid={kpi.gid} />
      </div>
    </div>
  );
}

export function KpiCards({ endDate }: { endDate: string }) {
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const meals = useWinterArc((s) => s.meals);
  const targets = useWinterArc((s) => s.nutritionTargets);

  const kpis: Kpi[] = useMemo(() => {
    const cur = windowKeys(endDate, 7);
    const prev = windowKeys(addDaysKey(endDate, -7), 7);

    const dur = (keys: string[]) =>
      keys
        .map((d) => sleepDurationHours(entries, trackers, d))
        .filter((v): v is number => v != null);
    const durCur = dur(cur);
    const durPrev = dur(prev);
    const avgDurCur = durCur.length ? durCur.reduce((a, b) => a + b, 0) / durCur.length : null;
    const avgDurPrev = durPrev.length ? durPrev.reduce((a, b) => a + b, 0) / durPrev.length : null;

    const wake = (keys: string[]) =>
      keys
        .map((d) => wakeMinutes(entries, trackers, d))
        .filter((v): v is number => v != null);
    const wakeCur = wake(cur);
    const wakePrev = wake(prev);
    const avgWakeCur = wakeCur.length ? wakeCur.reduce((a, b) => a + b, 0) / wakeCur.length : null;
    const avgWakePrev = wakePrev.length ? wakePrev.reduce((a, b) => a + b, 0) / wakePrev.length : null;

    const fit = (keys: string[]) =>
      keys.map((d) => {
        const vis = selectTrackersForDate(
          trackers.filter((t) => t.category === "fitness"),
          d
        );
        if (vis.length === 0) return null;
        const done = vis.filter((t) =>
          selectIsCompleted(t, selectEntriesFor(entries, t.id, d))
        ).length;
        return (done / vis.length) * 100;
      });

    const fitCur = fit(cur).filter((v): v is number => v != null);
    const fitPrev = fit(prev).filter((v): v is number => v != null);
    const avgFitCur = fitCur.length ? fitCur.reduce((a, b) => a + b, 0) / fitCur.length : null;
    const avgFitPrev = fitPrev.length ? fitPrev.reduce((a, b) => a + b, 0) / fitPrev.length : null;

    const foodCur = foodHealthyPct(meals, targets, cur[0], cur[cur.length - 1]);
    const foodPrev = foodHealthyPct(meals, targets, prev[0], prev[prev.length - 1]);

    const sparkDur = cur.map((d) => {
      const v = sleepDurationHours(entries, trackers, d);
      return v == null ? null : +v.toFixed(2);
    });
    const sparkWake = cur.map((d) => wakeMinutes(entries, trackers, d));
    const sparkFit = fit(cur);
    const sparkFood = cur.map((d) => {
      const t = meals.filter((m) => m.dateKey === d);
      if (t.length === 0) return null;
      const cals = t.reduce((s, m) => s + m.calories, 0);
      const inRange = cals >= targets.calories * 0.8 && cals <= targets.calories * 1.2;
      return inRange && t.length >= 3 ? 100 : 50;
    });

    return [
      {
        icon: <Moon className="h-5 w-5 text-violet-400" />,
        name: "Sleep",
        value: avgDurCur != null ? fmtHours(avgDurCur) : "—",
        sub: "avg this week",
        delta: delta(avgDurCur, avgDurPrev, (v) => `${+v.toFixed(1)}h`, "up"),
        spark: sparkDur,
        color: "#a78bfa",
        gid: "kpi-sleep",
      },
      {
        icon: <Sun className="h-5 w-5 text-amber-400" />,
        name: "Wake Up",
        value: avgWakeCur != null ? fmtMinOfDay(avgWakeCur) : "—",
        sub: "avg this week",
        delta: delta(avgWakeCur, avgWakePrev, fmtClockDiff, "down"),
        spark: sparkWake,
        color: "#fbbf24",
        gid: "kpi-wake",
      },
      {
        icon: <Dumbbell className="h-5 w-5 text-sky-400" />,
        name: "Fitness",
        value: avgFitCur != null ? fmtPct(avgFitCur) : "—",
        sub: "weekly consistency",
        delta: delta(avgFitCur, avgFitPrev, (v) => `${Math.round(v)}%`, "up"),
        spark: sparkFit,
        color: "#38bdf8",
        gid: "kpi-fit",
      },
      {
        icon: <UtensilsCrossed className="h-5 w-5 text-sky-300" />,
        name: "Food",
        value: foodCur != null ? fmtPct(foodCur) : "—",
        sub: "healthy meals",
        delta: delta(foodCur, foodPrev, (v) => `${Math.round(v)}%`, "up"),
        spark: sparkFood,
        color: "#4ade80",
        gid: "kpi-food",
      },
    ];
  }, [endDate, trackers, entries, meals, targets]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <KpiCard key={k.name} kpi={k} />
      ))}
    </div>
  );
}
