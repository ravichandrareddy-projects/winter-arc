"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, Eye, Sun, MoonStar, Target, TrendingUp, Upload } from "lucide-react";
import { formatTime12 } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { selectBedtime, sleepStats, useWinterArc } from "@/lib/store";
import type { Tracker } from "@/lib/types";
import type { TimeMode } from "./TimeGrid";

function Tile({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="min-w-[140px] flex-1">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-xl font-extrabold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export function TimeStats({
  tracker,
  days,
  rangeLabel,
  mode,
}: {
  tracker: Tracker;
  days: string[];
  rangeLabel: string;
  mode: TimeMode;
}) {
  const entries = useWinterArc((s) => s.entries);
  const [shared, setShared] = useState(false);
  const pathname = usePathname();

  const sleep = mode === "sleep";
  const noun = sleep ? "sleep" : "wake up";
  const avgLabel = sleep ? "Average Bedtime" : "Average Wake Up";
  const avgIcon = sleep ? (
    <MoonStar className="h-4 w-4 text-sky-400" />
  ) : (
    <Sun className="h-4 w-4 text-amber-400" />
  );
  const latestColor = sleep ? "#a78bfa" : "#fb923c";
  const countNoun = sleep ? "night" : "morning";
  const shareLabel = sleep ? "Share Sleep" : "Share Wake Up";

  const values = days
    .map((d) => selectBedtime(entries, tracker.id, d))
    .filter((v): v is string => !!v);
  const stats = sleepStats(values);

  const text =
    `My ${noun} (${rangeLabel}): ` +
    (stats.count === 0
      ? `no ${countNoun}s logged yet.`
      : `avg ${stats.average ? formatTime12(stats.average) : "—"}, ` +
        `earliest ${stats.earliest ? formatTime12(stats.earliest) : "—"}, ` +
        `latest ${stats.latest ? formatTime12(stats.latest) : "—"}, ` +
        `consistency ${stats.consistency}% over ${stats.count} ${countNoun}${stats.count === 1 ? "" : "s"}. — Winter Arc`);

  const share = async () => {
    try {
      const nav = navigator as Navigator & {
        share?: (d: { title: string; text: string }) => Promise<void>;
      };
      if (nav.share) {
        await nav.share({ title: `My ${noun} — Winter Arc`, text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
      }
    } catch {
      /* user dismissed — nothing to do */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <Tile
        icon={avgIcon}
        label={avgLabel}
        value={stats.average ? formatTime12(stats.average) : "—"}
        color="#38bdf8"
      />
      <Tile
        icon={<TrendingUp className="h-4 w-4 text-green-400" />}
        label="Earliest"
        value={stats.earliest ? formatTime12(stats.earliest) : "—"}
        color="#4ade80"
      />
      <Tile
        icon={<Clock className="h-4 w-4 text-violet-400" />}
        label="Latest"
        value={stats.latest ? formatTime12(stats.latest) : "—"}
        color={latestColor}
      />
      <Tile
        icon={<Target className="h-4 w-4 text-green-400" />}
        label="Consistency"
        value={`${stats.consistency}%`}
        color="#4ade80"
      />
      <span className="hidden items-center gap-1.5 text-xs text-muted xl:flex">
        <Eye className="h-4 w-4" />
        {stats.count} {countNoun}{stats.count === 1 ? "" : "s"} logged
      </span>
      <button
        onClick={() => requireAuth({ route: pathname, label: "Share progress", replay: () => void share() })}
        className="ml-auto flex h-11 items-center gap-2 rounded-xl border-2 border-accent px-5 text-sm font-bold text-accent"
      >
        <Upload className="h-4 w-4" />
        {shared ? "Copied ✓" : shareLabel}
      </button>
    </div>
  );
}
