"use client";

import { useMemo, useState } from "react";
import { Beef, ChevronDown, Droplet, Flame, Leaf, Wheat } from "lucide-react";
import { LineChart } from "../LineChart";
import { addDaysKey, monthDayShort } from "@/lib/dates";
import {
  nutritionSeries,
  useWinterArc,
  type NutritionMetric,
} from "@/lib/store";

const CHARTS: { metric: NutritionMetric; label: string; color: string; icon: typeof Flame }[] = [
  { metric: "calories", label: "Calories", color: "#fb7185", icon: Flame },
  { metric: "protein", label: "Protein (g)", color: "#fb7185", icon: Beef },
  { metric: "carbs", label: "Carbs (g)", color: "#fbbf24", icon: Wheat },
  { metric: "fats", label: "Fats (g)", color: "#a78bfa", icon: Droplet },
];

export function NutritionTrends({ endDate }: { endDate: string }) {
  const meals = useWinterArc((s) => s.meals);
  const [range, setRange] = useState<7 | 14 | 30>(14);

  const days = useMemo(
    () => Array.from({ length: range }, (_, i) => addDaysKey(endDate, i - (range - 1))),
    [endDate, range]
  );
  const ticks = [0, 1, 2, 3].map((k) => Math.round(((days.length - 1) / 3) * k));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-accent" />
        <h2 className="flex-1 text-base font-extrabold">Nutrition Trends</h2>
        <button
          onClick={() => setRange((r) => (r === 7 ? 14 : r === 14 ? 30 : 7))}
          aria-label="Change range"
          className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
        >
          Last {range} Days
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CHARTS.map((c) => {
          const Icon = c.icon;
          const values = nutritionSeries(meals, c.metric, endDate, range);
          return (
            <div key={c.metric} className="rounded-2xl border border-border p-3">
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-bold">
                <Icon className="h-4 w-4" style={{ color: c.color }} />
                {c.label}
              </p>
              <LineChart values={values} color={c.color} height={76} gid={`nt-${c.metric}`} />
              <div className="flex justify-between text-[10px] text-muted">
                {ticks.map((i) => (
                  <span key={i}>{monthDayShort(days[i])}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
