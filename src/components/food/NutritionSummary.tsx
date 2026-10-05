"use client";

import { useState } from "react";
import { Beef, Droplet, Leaf, Pencil, Wheat } from "lucide-react";
import { Sheet } from "../Sheet";
import { formatNumber } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { usePathname } from "next/navigation";
import {
  dayNutrition,
  useWinterArc,
  type NutritionTargets,
} from "@/lib/store";

const MACROS = [
  { key: "protein", label: "Protein", unit: "g", color: "#fb7185", icon: Beef },
  { key: "carbs", label: "Carbs", unit: "g", color: "#fbbf24", icon: Wheat },
  { key: "fats", label: "Fats", unit: "g", color: "#a78bfa", icon: Droplet },
  { key: "fiber", label: "Fiber", unit: "g", color: "#4ade80", icon: Leaf },
] as const;

function KcalRing({
  protein,
  carbs,
  fats,
  fiber,
  calories,
}: {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  calories: number;
}) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const total = protein + carbs + fats + fiber;
  const segs = [
    { v: protein, color: "#fb7185" },
    { v: carbs, color: "#fbbf24" },
    { v: fats, color: "#a78bfa" },
    { v: fiber, color: "#4ade80" },
  ];
  let acc = 0;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
        <circle cx="42" cy="42" r={R} fill="none" strokeWidth="10" className="stroke-track" />
        {total > 0 &&
          segs.map((s, i) => {
            const frac = s.v / total;
            const el = (
              <circle
                key={i}
                cx="42"
                cy="42"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="10"
                strokeDasharray={`${Math.max(0, frac * C - 1.5)} ${C}`}
                strokeDashoffset={-acc * C}
                strokeLinecap="butt"
              />
            );
            acc += frac;
            return el;
          })}
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <span className="text-xl font-extrabold">{formatNumber(Math.round(calories))}</span>
        <span className="text-xs font-semibold text-muted">kcal</span>
      </span>
    </div>
  );
}

export function NutritionSummary({ dateKey }: { dateKey: string }) {
  const meals = useWinterArc((s) => s.meals);
  const targets = useWinterArc((s) => s.nutritionTargets);
  const setNutritionTargets = useWinterArc((s) => s.setNutritionTargets);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<keyof NutritionTargets, string>>({
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    fiber: "",
  });

  const t = dayNutrition(meals, dateKey);

  const openEditor = () => {
    setDraft({
      calories: String(targets.calories),
      protein: String(targets.protein),
      carbs: String(targets.carbs),
      fats: String(targets.fats),
      fiber: String(targets.fiber),
    });
    setOpen(true);
  };

  const saveTargets = () => {
    const patch: Partial<NutritionTargets> = {};
    (Object.keys(draft) as (keyof NutritionTargets)[]).forEach((k) => {
      const n = Number(draft[k]);
      if (draft[k] !== "" && Number.isFinite(n) && n > 0) patch[k] = Math.round(n);
    });
    if (Object.keys(patch).length === 0) {
      setOpen(false);
      return;
    }
    requireAuth({
      route: pathname,
      label: "Save targets",
      replay: () => {
        setNutritionTargets(patch);
        setOpen(false);
      },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-extrabold">Today&apos;s Nutrition Summary</h2>
        <button
          onClick={openEditor}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit targets
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <KcalRing protein={t.protein} carbs={t.carbs} fats={t.fats} fiber={t.fiber} calories={t.calories} />
        {MACROS.map((m) => {
          const actual = t[m.key];
          const goal = targets[m.key];
          const pct = goal > 0 ? Math.min(100, Math.round((actual / goal) * 100)) : 0;
          const Icon = m.icon;
          return (
            <div key={m.key} className="min-w-[150px] flex-1">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Icon className="h-4 w-4" style={{ color: m.color }} />
                {m.label}
                <span className="ml-auto font-bold text-foreground">{pct}%</span>
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-track">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </div>
              <p className="mt-1 text-sm font-bold">
                {formatNumber(+actual.toFixed(1))} <span className="font-semibold text-muted">/ {formatNumber(goal)} {m.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} label="Edit targets">
        <h2 className="mb-3 text-base font-bold">Daily targets</h2>
        <div className="grid grid-cols-2 gap-2">
          {MACROS.map((m) => (
            <div key={m.key}>
              <label htmlFor={`nt-${m.key}`} className="text-sm font-semibold">
                {m.label} ({m.unit})
              </label>
              <input
                id={`nt-${m.key}`}
                type="number"
                inputMode="numeric"
                min={1}
                value={draft[m.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [m.key]: e.target.value }))}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label htmlFor="nt-calories" className="text-sm font-semibold">
              Calories (kcal)
            </label>
            <input
              id="nt-calories"
              type="number"
              inputMode="numeric"
              min={1}
              value={draft.calories}
              onChange={(e) => setDraft((d) => ({ ...d, calories: e.target.value }))}
              className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4"
            />
          </div>
        </div>
        <button
          onClick={saveTargets}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          SAVE TARGETS
        </button>
      </Sheet>
    </div>
  );
}
