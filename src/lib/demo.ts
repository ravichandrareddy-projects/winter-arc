import { CORE_TRACKER_DEFS } from "./core-trackers";
import { addDaysKey, nowISO, todayKey } from "./dates";
import type { Tracker, TrackerEntry } from "./types";
import type { MealEntry, NutritionTargets } from "./store";

/**
 * Fixed visitor demo (spec §8): realistic numbers, never saved anywhere.
 * Demo ids are prefixed so they can never collide with user rows.
 */
export interface DemoBundle {
  trackers: Tracker[];
  entries: TrackerEntry[];
  meals: MealEntry[];
  targets: NutritionTargets;
}

export function buildDemoBundle(): DemoBundle {
  const today = todayKey();
  const start = addDaysKey(today, -6);
  const end = addDaysKey(start, 89);
  const now = nowISO();

  const trackers: Tracker[] = CORE_TRACKER_DEFS.map((d, i) => ({
    ...d,
    startDate: start,
    endDate: end,
    id: `demo-${d.name.toLowerCase().replace(/\s+/g, "-")}`,
    sortOrder: i,
    createdAt: now,
    updatedAt: now,
  }));
  const byName = Object.fromEntries(trackers.map((t) => [t.name, t]));
  const entries: TrackerEntry[] = [];
  const sub = (
    t: Tracker,
    date: string,
    value: number | string | boolean,
    slot?: string
  ) => {
    entries.push({
      id: `demo-e-${entries.length}`,
      trackerId: t.id,
      date,
      value,
      completed: true,
      slot,
      targetSnapshot: t.target,
      unitSnapshot: t.unit,
      createdAt: now,
      updatedAt: now,
    });
  };

  // spec §8 showcase values live on "today"
  sub(byName.Water, today, 2.5, "12:00");
  sub(byName.Steps, today, 8420, "18:00");
  sub(byName.Workout, today, true, "18:00");
  sub(byName.Sleep, today, "22:28", "22:00");
  sub(byName["Wake Up"], today, "06:12", "06:00");
  sub(byName.Protein, today, 96, "12:00");
  sub(byName.Study, today, 2, "16:00");
  sub(byName.Food, today, 3, "12:00");
  sub(byName.Reading, today, 20, "20:00");
  sub(byName.Meditation, today, 10, "08:00");
  sub(byName.Weight, today, 83.7, "08:00");
  sub(byName["Push Ups"], today, 28, "18:00");
  sub(byName.Running, today, 5.1, "18:00");

  // a few prior days so trends/heatmaps read alive
  const hist: [string, number | string][] = [
    ["Water", 2.0],
    ["Water", 3.0],
    ["Water", 2.2],
    ["Steps", 7500],
    ["Steps", 9100],
    ["Steps", 6800],
    ["Protein", 110],
    ["Protein", 120],
    ["Protein", 95],
  ];
  for (let back = 3; back >= 1; back--) {
    const d = addDaysKey(today, -back);
    const i = 3 - back;
    sub(byName[hist[i * 3][0]], d, hist[i * 3][1] as number, "12:00");
    sub(byName[hist[i * 3 + 1][0]], d, hist[i * 3 + 1][1] as number, "18:00");
    sub(byName[hist[i * 3 + 2][0]], d, hist[i * 3 + 2][1] as number, "08:00");
  }
  for (let back = 3; back >= 1; back--) {
    const d = addDaysKey(today, -back);
    sub(byName.Sleep, d, "22:30", "22:00");
    sub(byName["Wake Up"], d, "06:15", "06:00");
  }

  const meals: MealEntry[] = [
    { id: "demo-m1", dateKey: today, slot: "breakfast", name: "Breakfast", items: "Oats, Banana, Almonds", calories: 420, protein: 16, carbs: 62, fats: 12, fiber: 8, createdAt: now, updatedAt: now },
    { id: "demo-m2", dateKey: today, slot: "lunch", name: "Lunch", items: "Rice, Chicken, Mixed Veg", calories: 620, protein: 38, carbs: 78, fats: 16, fiber: 10, createdAt: now, updatedAt: now },
    { id: "demo-m3", dateKey: today, slot: "snacks", name: "Snacks", items: "Boiled Eggs, Banana", calories: 250, protein: 18, carbs: 28, fats: 8, fiber: 4, createdAt: now, updatedAt: now },
  ];

  return {
    trackers,
    entries,
    meals,
    targets: { calories: 2000, protein: 150, carbs: 220, fats: 70, fiber: 30 },
  };
}
