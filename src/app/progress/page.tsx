"use client";

import { ChartColumn } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DateStrip } from "@/components/home/DateStrip";
import { KpiCards } from "@/components/progress/KpiCards";
import { OverallConsistency } from "@/components/progress/OverallConsistency";
import { HabitHeatmap } from "@/components/progress/HabitHeatmap";
import { ProgressTrends } from "@/components/progress/ProgressTrends";
import { useWinterArc } from "@/lib/store";

export default function ProgressPage() {
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const setSelectedDate = useWinterArc((s) => s.setSelectedDate);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />

        <div className="flex items-center gap-3">
          <ChartColumn className="h-9 w-9 text-sky-400" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Progress</h1>
            <p className="text-sm text-muted">
              See your journey, track your consistency, and become a better you.
            </p>
          </div>
        </div>

        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

        <KpiCards endDate={selectedDate} />

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <OverallConsistency endDate={selectedDate} />
          <HabitHeatmap endDate={selectedDate} />
        </div>

        <ProgressTrends endDate={selectedDate} />
      </main>
    </AppShell>
  );
}
