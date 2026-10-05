"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Image as ImageIcon, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { BodyPhotos } from "@/components/fitness/BodyPhotos";
import { formatNumber } from "@/lib/dates";
import { displayWeight, weightUnit } from "@/lib/units";
import { selectEntriesFor, useWinterArc } from "@/lib/store";
import { requireAuth } from "@/lib/auth-guard";

export default function BodyPhotosPage() {
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const photoMeta = useWinterArc((s) => s.photoMeta);
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const units = useWinterArc((s) => s.preferences.units);
  const [shared, setShared] = useState(false);
  const pathname = usePathname();

  const share = async () => {
    const weightId =
      trackers.find((t) => t.name.toLowerCase() === "weight" && t.status !== "archived")?.id ?? null;
    let weightLine = "";
    if (weightId) {
      const vals = entries
        .filter((e) => e.trackerId === weightId && typeof e.value === "number")
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .map((e) => e.value as number);
      if (vals.length > 0) {
        const wu = weightUnit(units);
        weightLine = ` Weight ${formatNumber(displayWeight(vals[0], units))} → ${formatNumber(displayWeight(vals[vals.length - 1], units))} ${wu}.`;
      }
    }
    const text = `My transformation: ${photoMeta.length} progress photo${photoMeta.length === 1 ? "" : "s"}.${weightLine} — Winter Arc`;
    try {
      const nav = navigator as Navigator & {
        share?: (d: { title: string; text: string }) => Promise<void>;
      };
      if (nav.share) {
        await nav.share({ title: "Transformation — Winter Arc", text });
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
          <Link
            href="/fitness"
            aria-label="Back to Fitness"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <ImageIcon className="h-9 w-9 text-sky-400" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Transformation</h1>
            <p className="text-sm text-muted">
              Track your physical transformation over time.
            </p>
          </div>
          <button
            onClick={() => requireAuth({ route: pathname, label: "Share progress", replay: () => void share() })}
            className="flex h-11 items-center gap-2 rounded-xl border-2 border-accent px-5 text-sm font-bold text-accent"
          >
            <Upload className="h-4 w-4" />
            {shared ? "Copied ✓" : "Share"}
          </button>
        </div>
        <BodyPhotos />
      </main>
    </AppShell>
  );
}
