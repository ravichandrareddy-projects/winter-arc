"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Plus, Upload, UtensilsCrossed } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DateStrip } from "@/components/home/DateStrip";
import { MealTable } from "@/components/food/MealTable";
import { NutritionSummary } from "@/components/food/NutritionSummary";
import { NutritionTrends } from "@/components/food/NutritionTrends";
import { fullDateLong } from "@/lib/dates";
import { dayNutrition, mealsFor, useWinterArc } from "@/lib/store";
import { requireAuth } from "@/lib/auth-guard";

export default function FoodPage() {
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const setSelectedDate = useWinterArc((s) => s.setSelectedDate);
  const meals = useWinterArc((s) => s.meals);
  const [addOpen, setAddOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const pathname = usePathname();

  const share = async () => {
    const t = dayNutrition(meals, selectedDate);
    const rows = mealsFor(meals, selectedDate);
    const lines = rows.map(
      (m) => `• ${m.name}: ${m.items || "—"} (${m.calories} kcal)`
    );
    const text =
      `Food — ${fullDateLong(selectedDate)}:\n` +
      (lines.length > 0 ? lines.join("\n") + "\n" : "No meals logged.\n") +
      `Total: ${t.calories} kcal · P ${t.protein}g · C ${t.carbs}g · F ${t.fats}g · Fib ${t.fiber}g — Winter Arc`;
    try {
      const nav = navigator as Navigator & {
        share?: (d: { title: string; text: string }) => Promise<void>;
      };
      if (nav.share) {
        await nav.share({ title: "Food Day — Winter Arc", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />

        <div className="flex items-center gap-3">
          <UtensilsCrossed className="h-9 w-9 text-sky-300" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Food</h1>
            <p className="text-sm text-muted">
              Track your meals, monitor nutrition and build better eating habits.
            </p>
          </div>
        </div>

        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

        <section aria-label="Today's food log" className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-base font-extrabold">
              <UtensilsCrossed className="h-5 w-5 text-accent" />
              Today&apos;s Food Log
            </h2>
            <span className="text-sm text-muted">Add your meals and track nutrition.</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setAddOpen(true)}
                className="flex h-9 items-center gap-1 rounded-xl bg-accent px-3 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" /> Add Meal
              </button>
              <button
                onClick={() => requireAuth({ route: pathname, label: "Share progress", replay: () => void share() })}
                className="flex h-9 items-center gap-1.5 rounded-xl border-2 border-accent px-3 text-xs font-bold text-accent"
              >
                <Upload className="h-3.5 w-3.5" />
                {shared ? "Copied ✓" : "Share Day"}
              </button>
            </div>
          </div>
          <MealTable dateKey={selectedDate} addOpen={addOpen} onAddClose={() => setAddOpen(false)} />
        </section>

        <NutritionSummary dateKey={selectedDate} />
        <NutritionTrends endDate={selectedDate} />
      </main>
    </AppShell>
  );
}
