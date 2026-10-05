"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Cookie, Ellipsis, Moon, Plus, Sun, UtensilsCrossed } from "lucide-react";
import { Sheet } from "../Sheet";
import { formatNumber } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import {
  mealsFor,
  useWinterArc,
  MEAL_SLOTS,
  type MealEntry,
  type MealSlot,
  type NewMealInput,
} from "@/lib/store";

const SLOT_ICON: Record<MealSlot, typeof Sun> = {
  breakfast: Sun,
  lunch: Sun,
  snacks: Cookie,
  dinner: Moon,
  custom: UtensilsCrossed,
};

const SLOT_COLOR: Record<MealSlot, string> = {
  breakfast: "#fbbf24",
  lunch: "#fb923c",
  snacks: "#a78bfa",
  dinner: "#38bdf8",
  custom: "#4ade80",
};

export function slotLabel(m: MealEntry): string {
  if (m.slot !== "custom") {
    return MEAL_SLOTS.find((s) => s.slot === m.slot)?.label ?? m.name;
  }
  return m.name;
}

const NUM_FIELDS = [
  { key: "calories", label: "Calories", step: "1" },
  { key: "protein", label: "Protein (g)", step: "1" },
  { key: "carbs", label: "Carbs (g)", step: "1" },
  { key: "fats", label: "Fats (g)", step: "1" },
  { key: "fiber", label: "Fiber (g)", step: "1" },
] as const;

function MealForm({
  dateKey,
  initial,
  onClose,
}: {
  dateKey: string;
  initial?: MealEntry;
  onClose: () => void;
}) {
  const addMeal = useWinterArc((s) => s.addMeal);
  const updateMeal = useWinterArc((s) => s.updateMeal);
  const deleteMeal = useWinterArc((s) => s.deleteMeal);

  const [slot, setSlot] = useState<MealSlot>(initial?.slot ?? "breakfast");
  const [name, setName] = useState(initial?.name ?? "");
  const [items, setItems] = useState(initial?.items ?? "");
  const [nums, setNums] = useState({
    calories: initial ? String(initial.calories) : "",
    protein: initial ? String(initial.protein) : "",
    carbs: initial ? String(initial.carbs) : "",
    fats: initial ? String(initial.fats) : "",
    fiber: initial ? String(initial.fiber) : "",
  });
  const [error, setError] = useState("");

  const setNum = (k: keyof typeof nums, v: string) =>
    setNums((p) => ({ ...p, [k]: v }));

  const save = () => {
    const parsed: Record<keyof typeof nums, number> = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    };
    for (const k of Object.keys(parsed) as (keyof typeof nums)[]) {
      const n = nums[k] === "" ? 0 : Number(nums[k]);
      if (!Number.isFinite(n) || n < 0) {
        setError("Numbers must be 0 or more.");
        return;
      }
      parsed[k] = Math.round(n * 10) / 10;
    }
    const label =
      slot === "custom"
        ? name.trim() || "Meal"
        : (MEAL_SLOTS.find((s) => s.slot === slot)?.label ?? "Meal");
    const input: NewMealInput = {
      dateKey,
      slot,
      name: label,
      items: items.trim(),
      ...parsed,
    };
    if (initial) updateMeal(initial.id, input);
    else addMeal(input);
    onClose();
  };

  const input = "h-12 w-full rounded-xl border border-border bg-background px-4 text-base";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold">Meal</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {MEAL_SLOTS.map((s) => (
            <button
              key={s.slot}
              onClick={() => setSlot(s.slot)}
              aria-pressed={slot === s.slot}
              className={`h-10 rounded-full border px-4 text-sm font-medium ${
                slot === s.slot
                  ? "border-foreground bg-foreground text-background"
                  : "border-border"
              }`}
            >
              {s.slot === "custom" ? "Other" : s.label}
            </button>
          ))}
        </div>
      </div>
      {slot === "custom" && (
        <div>
          <label htmlFor="meal-name" className="text-sm font-semibold">Name</label>
          <input
            id="meal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pre-workout shake"
            maxLength={30}
            className={`${input} mt-1`}
          />
        </div>
      )}
      <div>
        <label htmlFor="meal-items" className="text-sm font-semibold">Items</label>
        <input
          id="meal-items"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder="Oats, Banana, Almonds"
          maxLength={80}
          className={`${input} mt-1`}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NUM_FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={`meal-${f.key}`} className="text-sm font-semibold">
              {f.label}
            </label>
            <input
              id={`meal-${f.key}`}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={nums[f.key]}
              onChange={(e) => setNum(f.key, e.target.value)}
              placeholder="0"
              className={`${input} mt-1`}
            />
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-red-500">{error}</p>
      )}
      <button
        onClick={save}
        className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
      >
        {initial ? "SAVE CHANGES" : "ADD MEAL"}
      </button>
      {initial && (
        <button
          onClick={() => {
            deleteMeal(initial.id);
            onClose();
          }}
          className="flex h-12 w-full items-center justify-center rounded-full border border-red-500/50 text-sm font-semibold text-red-500"
        >
          DELETE MEAL
        </button>
      )}
    </div>
  );
}

export function MealTable({
  dateKey,
  addOpen,
  onAddClose,
}: {
  dateKey: string;
  addOpen: boolean;
  onAddClose: () => void;
}) {
  const meals = useWinterArc((s) => s.meals);
  const [editing, setEditing] = useState<MealEntry | null>(null);

  const rows = mealsFor(meals, dateKey);
  const [adding, setAdding] = useState(false);
  const pathname = usePathname();

  const openAdd = () =>
    requireAuth({ route: pathname, label: "Add Meal", payload: { sheet: "meal-add" }, replay: () => setAdding(true) });
  const openEdit = (m: MealEntry) =>
    requireAuth({
      route: pathname,
      label: `Edit ${m.name}`,
      payload: { sheet: "meal-edit", mealId: m.id },
      replay: () => setEditing(m),
    });

  useAuthResume((a) => {
    const p = a.payload ?? {};
    if (p.sheet === "meal-add") setAdding(true);
    else if (p.sheet === "meal-edit" && typeof p.mealId === "string") {
      const m = useWinterArc.getState().meals.find((x) => x.id === p.mealId);
      if (m) setEditing(m);
    }
  });
  const closeSheet = () => {
    setEditing(null);
    setAdding(false);
    onAddClose();
  };

  // header "+ Add Meal" arrives via prop — route it through the guard once
  const openedRef = useRef(false);
  useEffect(() => {
    if (addOpen && !openedRef.current) {
      openedRef.current = true;
      openAdd();
      onAddClose();
    }
    if (!addOpen) openedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addOpen]);

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/* desktop table */}
      <div className="nice-scroll hidden overflow-x-auto md:block">
        <div className="min-w-[760px]" role="table" aria-label="Meals">
          <div role="row" className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <span role="columnheader" className="w-40 shrink-0">Meal</span>
            <span role="columnheader" className="flex-[2]">Items</span>
            <span role="columnheader" className="w-16 shrink-0 text-right">Calories</span>
            <span role="columnheader" className="w-14 shrink-0 text-right">Protein</span>
            <span role="columnheader" className="w-14 shrink-0 text-right">Carbs</span>
            <span role="columnheader" className="w-14 shrink-0 text-right">Fats</span>
            <span role="columnheader" className="w-14 shrink-0 text-right">Fiber</span>
            <span role="columnheader" className="w-12 shrink-0 text-right">Actions</span>
          </div>
          {rows.map((m) => {
            const Icon = SLOT_ICON[m.slot] ?? UtensilsCrossed;
            return (
              <div key={m.id} role="row" className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-sm last:border-0">
                <span role="cell" className="flex w-40 shrink-0 items-center gap-2 font-semibold">
                  <Icon className="h-4 w-4 shrink-0" style={{ color: SLOT_COLOR[m.slot] }} />
                  {slotLabel(m)}
                </span>
                <span role="cell" className="flex-[2] truncate text-muted">
                  {m.items || "—"}
                </span>
                <span role="cell" className="w-16 shrink-0 text-right font-bold">{formatNumber(m.calories)}</span>
                <span role="cell" className="w-14 shrink-0 text-right">{formatNumber(m.protein)}g</span>
                <span role="cell" className="w-14 shrink-0 text-right">{formatNumber(m.carbs)}g</span>
                <span role="cell" className="w-14 shrink-0 text-right">{formatNumber(m.fats)}g</span>
                <span role="cell" className="w-14 shrink-0 text-right">{formatNumber(m.fiber)}g</span>
                <span role="cell" className="flex w-12 shrink-0 justify-end">
                  <button
                    onClick={() => openEdit(m)}
                    aria-label={`Edit ${slotLabel(m)}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </button>
                </span>
              </div>
            );
          })}
          <button
            onClick={openAdd}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-muted"
          >
            <Plus className="h-4 w-4" /> Add Meal
          </button>
        </div>
      </div>

      {/* mobile cards */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {rows.map((m) => {
          const Icon = SLOT_ICON[m.slot] ?? UtensilsCrossed;
          return (
            <button
              key={m.id}
              onClick={() => setEditing(m)}
              className="rounded-2xl border border-border px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: SLOT_COLOR[m.slot] }} />
                <span className="flex-1 text-sm font-bold">{slotLabel(m)}</span>
                <span className="text-sm font-extrabold">{formatNumber(m.calories)} <span className="text-xs font-semibold text-muted">kcal</span></span>
              </span>
              {m.items ? <span className="mt-0.5 block truncate text-xs text-muted">{m.items}</span> : null}
              <span className="mt-1.5 grid grid-cols-4 gap-1 text-center text-xs">
                <span className="rounded-lg bg-card-2 py-1">P {formatNumber(m.protein)}</span>
                <span className="rounded-lg bg-card-2 py-1">C {formatNumber(m.carbs)}</span>
                <span className="rounded-lg bg-card-2 py-1">F {formatNumber(m.fats)}</span>
                <span className="rounded-lg bg-card-2 py-1">Fib {formatNumber(m.fiber)}</span>
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setAdding(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-foreground/25 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> Add Meal
        </button>
      </div>

      <Sheet open={editing !== null || adding || addOpen} onClose={closeSheet} label="Meal">
        <h2 className="mb-3 text-base font-bold">
          {editing ? `Edit ${slotLabel(editing)}` : "+ ADD MEAL"}
        </h2>
        <MealForm
          dateKey={dateKey}
          initial={editing ?? undefined}
          onClose={closeSheet}
        />
      </Sheet>
    </div>
  );
}
