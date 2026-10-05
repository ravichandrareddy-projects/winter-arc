"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell, Image as ImageIcon, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DateStrip } from "@/components/home/DateStrip";
import { FitnessGrid, fitnessTrackers } from "@/components/fitness/FitnessGrid";
import { TrendChart } from "@/components/fitness/TrendChart";
import { TrackerSheet } from "@/components/trackers/TrackerSheet";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import { useWinterArc } from "@/lib/store";

export default function FitnessPage() {
  const trackers = useWinterArc((s) => s.trackers);
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const setSelectedDate = useWinterArc((s) => s.setSelectedDate);
  const [addOpen, setAddOpen] = useState(false);

  const openAdd = () =>
    requireAuth({ route: "/fitness", label: "Add Item", payload: { sheet: "fit-add" }, replay: () => setAddOpen(true) });

  useAuthResume((a) => {
    if (a.payload?.sheet === "fit-add") setAddOpen(true);
  });

  const rows = fitnessTrackers(trackers);
  const chartRows = rows.filter((t) => t.type !== "boolean" && t.type !== "time");

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />

        <div className="flex items-center gap-3">
          <Dumbbell className="h-9 w-9 text-sky-400" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Fitness</h1>
            <p className="text-sm text-muted">
              Track your workouts, steps, weight and build consistency.
            </p>
          </div>
        </div>

        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

        <section aria-label="Daily fitness tracking" className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-base font-extrabold">
              <Dumbbell className="h-5 w-5 text-accent" />
              Daily Fitness Tracking
            </h2>
            <span className="text-sm text-muted">Tick or enter your values for each day.</span>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/fitness/photos"
                className="flex h-9 items-center gap-1 rounded-xl border-2 border-violet-400 px-3 text-xs font-bold text-violet-300"
              >
                <ImageIcon className="h-4 w-4" /> Transformation
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={openAdd}
                className="flex h-9 items-center gap-1 rounded-xl border border-border bg-card px-3 text-xs font-bold"
              >
                <Plus className="h-4 w-4" /> Add Item
              </button>
            </div>
          </div>
          <FitnessGrid trackers={trackers} selectedDate={selectedDate} />
        </section>

        {chartRows.length > 0 && (
          <section aria-label="Trends" className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {chartRows.map((t) => (
              <TrendChart key={t.id} tracker={t} endDate={selectedDate} />
            ))}
          </section>
        )}
      </main>

      <TrackerSheet
        open={addOpen}
        defaults={{ category: "fitness", icon: "dumbbell" }}
        onClose={() => setAddOpen(false)}
      />
    </AppShell>
  );
}
