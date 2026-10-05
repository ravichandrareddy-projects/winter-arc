"use client";

import { useState } from "react";
import { ICON_OPTIONS, TrackerGlyph } from "../icons";
import { colorForIcon } from "@/lib/store";
import { DEFAULT_SLEEP_WINDOW, WINDOW_HOURS } from "@/lib/types";
import type { Frequency, Tracker, TrackerCategory, TrackerIcon } from "@/lib/types";

export interface TrackerFormValue {
  name: string;
  type: Tracker["type"];
  target?: number;
  unit?: string;
  step: number;
  frequency: Frequency;
  startDate: string;
  endDate: string;
  allowMultiple: boolean;
  icon: TrackerIcon;
  color: string;
  category: TrackerCategory;
  windowStart?: string;
  windowEnd?: string;
}

const TYPES: { v: Tracker["type"]; label: string; hint: string }[] = [
  { v: "quantity", label: "Quantity", hint: "Water (L), Protein (g)" },
  { v: "numeric", label: "Numeric", hint: "Steps, Push-ups" },
  { v: "duration", label: "Duration", hint: "Study, Reading" },
  { v: "boolean", label: "Check", hint: "Workout, No Junk" },
  { v: "time", label: "Time", hint: "Sleep, Wake Up" },
  { v: "meals", label: "Meals", hint: "Food count" },
];

const CATS: { v: TrackerCategory; label: string }[] = [
  { v: "hydration", label: "Hydration" },
  { v: "food", label: "Food" },
  { v: "fitness", label: "Fitness" },
  { v: "sleep", label: "Sleep" },
  { v: "study", label: "Study" },
  { v: "mind", label: "Mind" },
  { v: "custom", label: "Other" },
];

const COLORS = ["#38bdf8", "#fb7185", "#4ade80", "#fb923c", "#a78bfa", "#818cf8", "#fbbf24", "#22d3ee", "#f472b6", "#f87171"];

const NEEDS_TARGET: Tracker["type"][] = ["quantity", "numeric", "duration", "meals"];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function shortHour(hhmm: string): string {
  const h = Number(hhmm.split(":")[0]);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}

export function TrackerForm({
  initial,
  defaults,
  defaultStart,
  defaultEnd,
  submitLabel,
  onSubmit,
}: {
  initial?: Tracker;
  defaults?: { category?: TrackerCategory; icon?: TrackerIcon };
  defaultStart: string;
  defaultEnd: string;
  submitLabel: string;
  onSubmit: (v: TrackerFormValue) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<Tracker["type"]>(initial?.type ?? "quantity");
  const [target, setTarget] = useState(initial?.target != null ? String(initial.target) : "");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [step, setStep] = useState(String(initial?.step ?? 1));
  const [freqKind, setFreqKind] = useState<Frequency["kind"]>(initial?.frequency.kind ?? "daily");
  const [days, setDays] = useState<number[]>(initial?.frequency.days ?? [1, 2, 3, 4, 5]);
  const [startDate, setStartDate] = useState(initial?.startDate ?? defaultStart);
  const [endDate, setEndDate] = useState(initial?.endDate ?? defaultEnd);
  const [icon, setIcon] = useState<TrackerIcon>(initial?.icon ?? defaults?.icon ?? "droplet");
  const [color, setColor] = useState(initial?.color ?? colorForIcon(initial?.icon ?? defaults?.icon ?? "droplet"));
  const [category, setCategory] = useState<TrackerCategory>(initial?.category ?? defaults?.category ?? "custom");
  const [windowStart, setWindowStart] = useState(initial?.windowStart ?? DEFAULT_SLEEP_WINDOW.start);
  const [windowEnd, setWindowEnd] = useState(initial?.windowEnd ?? DEFAULT_SLEEP_WINDOW.end);
  const [error, setError] = useState("");

  const needsTarget = NEEDS_TARGET.includes(type);
  const input = "h-12 w-full rounded-xl border border-border bg-background px-4 text-base";

  const submit = () => {
    if (!name.trim()) return setError("Give it a name — e.g. Water.");
    if (needsTarget) {
      const n = Number(target);
      if (!Number.isFinite(n) || n <= 0) return setError("Target must be above 0.");
    }
    const st = Number(step);
    if (!Number.isFinite(st) || st <= 0) return setError("Step must be above 0.");
    if (freqKind === "custom" && days.length === 0) return setError("Pick at least one day.");
    if (startDate > endDate) return setError("Start must be before end.");
    if (type === "time" && windowStart === windowEnd)
      return setError("Sleep hours From and To can't be the same.");
    setError("");
    onSubmit({
      name: name.trim(),
      type,
      target: needsTarget && target !== "" ? Number(target) : undefined,
      unit: unit.trim() || undefined,
      step: st,
      frequency: freqKind === "custom" ? { kind: freqKind, days: [...days].sort() } : { kind: freqKind },
      startDate,
      endDate,
      allowMultiple: type !== "boolean" && type !== "time",
      icon,
      color,
      category,
      ...(type === "time" ? { windowStart, windowEnd } : {}),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="tf-name" className="text-sm font-semibold">Name</label>
        <input id="tf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Water" maxLength={40} className={`${input} mt-1`} />
      </div>

      <div>
        <p className="text-sm font-semibold">Type</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button key={t.v} onClick={() => setType(t.v)} aria-pressed={type === t.v}
              className={`rounded-xl border px-3 py-2 text-left ${type === t.v ? "border-foreground bg-foreground text-background" : "border-border"}`}>
              <span className="block text-sm font-semibold">{t.label}</span>
              <span className={`block text-xs ${type === t.v ? "opacity-70" : "text-muted"}`}>{t.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {needsTarget && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="tf-target" className="text-sm font-semibold">Daily target</label>
            <input id="tf-target" type="number" inputMode="decimal" min={0} step="any" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="3" className={`${input} mt-1`} />
          </div>
          <div className="w-24">
            <label htmlFor="tf-unit" className="text-sm font-semibold">Unit</label>
            <input id="tf-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="L" maxLength={10} className={`${input} mt-1`} />
          </div>
          <div className="w-24">
            <label htmlFor="tf-step" className="text-sm font-semibold">Step ±</label>
            <input id="tf-step" type="number" inputMode="decimal" min={0} step="any" value={step} onChange={(e) => setStep(e.target.value)} className={`${input} mt-1`} />
          </div>
        </div>
      )}

      {type === "time" && (
        <div>
          <p className="text-sm font-semibold">Hours window</p>
          <p className="text-xs text-muted">Grid boxes rebuild from this — e.g. 7 PM to 12 AM, or 7 PM to 2 AM.</p>
          <div className="mt-1 flex gap-2">
            <div className="flex-1">
              <label htmlFor="tf-win-start" className="text-sm font-semibold">From</label>
              <select id="tf-win-start" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} className={`${input} mt-1`}>
                {WINDOW_HOURS.map((h) => (
                  <option key={h} value={h}>{shortHour(h)}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="tf-win-end" className="text-sm font-semibold">To</label>
              <select id="tf-win-end" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} className={`${input} mt-1`}>
                {WINDOW_HOURS.map((h) => (
                  <option key={h} value={h}>{shortHour(h)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold">Icon & color</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {ICON_OPTIONS.map((ic) => (
            <button key={ic} onClick={() => { setIcon(ic); setColor(colorForIcon(ic)); }} aria-pressed={icon === ic} aria-label={ic}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${icon === ic ? "border-foreground bg-card-2" : "border-border"}`}>
              <TrackerGlyph icon={ic} className="h-5 w-5" style={{ color: icon === ic ? color : undefined }} />
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} aria-label={`Color ${c}`}
              className={`h-8 w-8 rounded-full ${color === c ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">Category</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c.v} onClick={() => setCategory(c.v)} aria-pressed={category === c.v}
              className={`h-10 rounded-full border px-4 text-sm font-medium ${category === c.v ? "border-foreground bg-foreground text-background" : "border-border"}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">Repeats</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {(["daily", "weekdays", "weekends", "custom"] as const).map((k) => (
            <button key={k} onClick={() => setFreqKind(k)} aria-pressed={freqKind === k}
              className={`h-10 rounded-full border px-4 text-sm font-medium capitalize ${freqKind === k ? "border-foreground bg-foreground text-background" : "border-border"}`}>
              {k === "custom" ? "Pick days" : k}
            </button>
          ))}
        </div>
        {freqKind === "custom" && (
          <div className="mt-2 flex gap-1.5">
            {DAYS.map((label, d) => (
              <button key={d} onClick={() => setDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))}
                aria-pressed={days.includes(d)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold ${days.includes(d) ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="tf-start" className="text-sm font-semibold">Start</label>
          <input id="tf-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${input} mt-1`} />
        </div>
        <div className="flex-1">
          <label htmlFor="tf-end" className="text-sm font-semibold">End</label>
          <input id="tf-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${input} mt-1`} />
        </div>
      </div>

      {error && <p role="alert" className="text-sm font-medium text-red-500">{error}</p>}
      <button onClick={submit} className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
        {submitLabel}
      </button>
    </div>
  );
}
