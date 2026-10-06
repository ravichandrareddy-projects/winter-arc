"use client";

import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { MotivationHero } from "@/components/home/MotivationHero";
import { DateStrip } from "@/components/home/DateStrip";
import { GoalsRow } from "@/components/home/GoalsRow";
import { TodayTrack } from "@/components/home/TodayTrack";
import { ArcPhaseRoadmap } from "@/components/home/ArcPhaseRoadmap";
import { Summary } from "@/components/home/Summary";
import { useWinterArc } from "@/lib/store";

export function HomeDashboard() {
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const setSelectedDate = useWinterArc((s) => s.setSelectedDate);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />
        <MotivationHero />
        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
        <GoalsRow />
        <TodayTrack date={selectedDate} />
        <ArcPhaseRoadmap selectedDate={selectedDate} />
        <Summary date={selectedDate} />
      </main>
    </AppShell>
  );
}
