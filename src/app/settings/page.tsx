"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { GoalsCard } from "@/components/settings/GoalsCard";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { PrefsCard } from "@/components/settings/PrefsCard";
import { DataCard } from "@/components/settings/DataCard";
import { AboutCard } from "@/components/settings/AboutCard";
import { AccountCard } from "@/components/settings/AccountCard";
import { useWinterArc } from "@/lib/store";

export default function SettingsPage() {
  const selectedDate = useWinterArc((s) => s.selectedDate);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />

        <div className="flex items-center gap-3">
          <SettingsIcon className="h-9 w-9 text-accent" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
            <p className="text-sm text-muted">
              Customize your experience to stay consistent and focused.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <ProfileCard />
          <GoalsCard />
          <NotificationsCard />
          <PrefsCard />
          <DataCard />
          <AccountCard />
          <AboutCard />
        </div>
      </main>
    </AppShell>
  );
}
