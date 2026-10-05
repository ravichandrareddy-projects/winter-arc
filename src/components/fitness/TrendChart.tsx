"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LineChart } from "../LineChart";
import { TrackerBadge } from "../icons";
import { addDaysKey, monthDayShort } from "@/lib/dates";
import { displayValue } from "@/lib/units";
import { selectDailyTotal, selectEntriesFor, useWinterArc } from "@/lib/store";
import type { Tracker } from "@/lib/types";

export function TrendChart({
  tracker,
  endDate,
}: {
  tracker: Tracker;
  endDate: string;
}) {
  const entries = useWinterArc((s) => s.entries);
  const units = useWinterArc((s) => s.preferences.units);
  const [range, setRange] = useState<7 | 14 | 30>(7);

  const days = useMemo(
    () => Array.from({ length: range }, (_, i) => addDaysKey(endDate, i - (range - 1))),
    [endDate, range]
  );

  const values = useMemo(
    () =>
      days.map((d) => {
        const list = selectEntriesFor(entries, tracker.id, d);
        return list.length === 0 ? null : +displayValue(tracker, selectDailyTotal(tracker, list), units).toFixed(2);
      }),
    [days, entries, tracker, units]
  );

  const n = values.length;
  const ticks = [0, 1, 2, 3].map((k) => Math.round(((n - 1) / 3) * k));
  const gid = `tc-${tracker.id.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <TrackerBadge icon={tracker.icon} color={tracker.color} size="sm" />
        <p className="flex-1 text-[13px] font-bold">
          {tracker.name} Trend
        </p>
        <button
          onClick={() => setRange((r) => (r === 7 ? 14 : r === 14 ? 30 : 7))}
          aria-label="Change range"
          className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-semibold text-muted"
        >
          Last {range} Days
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <LineChart values={values} color={tracker.color} height={76} gid={gid} />
      <div className="flex justify-between pl-11 text-[10px] text-muted">
        {ticks.map((i) => (
          <span key={i}>{monthDayShort(days[i])}</span>
        ))}
      </div>
    </div>
  );
}
