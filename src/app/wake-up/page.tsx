"use client";

import { useMemo, useState } from "react";
import { BedDouble, ChevronDown, Sun } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DateStrip } from "@/components/home/DateStrip";
import { TimeGrid } from "@/components/sleep/TimeGrid";
import { TimeStats } from "@/components/sleep/TimeStats";
import { Sheet } from "@/components/Sheet";
import { formatTime12, getArcWindowDays, arcDayNumber, todayKey } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useWinterArc } from "@/lib/store";
import { DEFAULT_WAKE_WINDOW, WINDOW_HOURS } from "@/lib/types";

function shortHour(hhmm: string): string {
  return formatTime12(hhmm).replace(":00", "");
}

export default function WakeUpPage() {
  const arc = useWinterArc((s) => s.arc);
  const trackers = useWinterArc((s) => s.trackers);
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const setSelectedDate = useWinterArc((s) => s.setSelectedDate);
  const [range, setRange] = useState<7 | 14 | 30>(14);

  const arcStart = arc?.startDate ?? todayKey();
  const totalDays = arc ? arcDayNumber(arc.startDate, arc.endDate) : 90;

  const wakeTracker =
    trackers.find(
      (t) =>
        (t.name.toLowerCase() === "wake up" || t.name.toLowerCase() === "wake-up") &&
        t.status === "active"
    ) ??
    trackers.find((t) => t.type === "time" && t.status === "active");
  const updateTracker = useWinterArc((s) => s.updateTracker);
  const [windowOpen, setWindowOpen] = useState(false);
  const [fromDraft, setFromDraft] = useState(
    wakeTracker?.windowStart ?? DEFAULT_WAKE_WINDOW.start
  );
  const [toDraft, setToDraft] = useState(
    wakeTracker?.windowEnd ?? DEFAULT_WAKE_WINDOW.end
  );
  const [windowError, setWindowError] = useState("");

  // Show recorded history through the selected day, bounded by the arc and today.
  const days = useMemo(
    () => getArcWindowDays(arcStart, selectedDate, range, totalDays),
    [arcStart, selectedDate, range, totalDays]
  );

  const winLabel = wakeTracker
    ? `${shortHour(wakeTracker.windowStart ?? DEFAULT_WAKE_WINDOW.start)} – ${shortHour(wakeTracker.windowEnd ?? DEFAULT_WAKE_WINDOW.end)}`
    : "";

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />

        <div className="flex items-center gap-3">
          <Sun className="h-9 w-9 text-amber-400" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Wake Up</h1>
            <p className="text-sm text-muted">
              Track when you wake up and build a consistent routine.
            </p>
          </div>
        </div>

        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

        <section aria-label="Wake up time" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-base font-extrabold">
              <BedDouble className="h-5 w-5 text-amber-400" />
              Wake Up Time
            </h2>
            <span className="text-sm text-muted">Tap the box when you woke up.</span>
            {wakeTracker && (
              <button
                onClick={() => {
                  setFromDraft(wakeTracker.windowStart ?? DEFAULT_WAKE_WINDOW.start);
                  setToDraft(wakeTracker.windowEnd ?? DEFAULT_WAKE_WINDOW.end);
                  setWindowError("");
                  setWindowOpen(true);
                }}
                aria-label="Change wake hours"
                className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold"
              >
                {winLabel}
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
            )}
            <button
              onClick={() =>
                setRange((r) => (r === 7 ? 14 : r === 14 ? 30 : 7))
              }
              aria-label="Change range"
              className="ml-auto flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold"
            >
              Last {range} Days
              <ChevronDown className="h-3.5 w-3.5 text-muted" />
            </button>
          </div>

          {wakeTracker ? (
            <>
              <TimeGrid
                mode="wake"
                tracker={wakeTracker}
                days={days}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <TimeStats
                mode="wake"
                tracker={wakeTracker}
                days={days}
                rangeLabel={`last ${range} days`}
              />
              <Sheet open={windowOpen} onClose={() => setWindowOpen(false)} label="Wake hours">
                <h2 className="mb-1 text-base font-bold">Your wake hours</h2>
                <p className="mb-3 text-xs text-muted">
                  Pick your window — e.g. 4 AM to 10 AM. The grid rebuilds its boxes from it.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="win-from" className="text-sm font-semibold">From</label>
                    <select
                      id="win-from"
                      value={fromDraft}
                      onChange={(e) => setFromDraft(e.target.value)}
                      className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3"
                    >
                      {WINDOW_HOURS.map((h) => (
                        <option key={h} value={h}>{shortHour(h)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="win-to" className="text-sm font-semibold">To</label>
                    <select
                      id="win-to"
                      value={toDraft}
                      onChange={(e) => setToDraft(e.target.value)}
                      className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3"
                    >
                      {WINDOW_HOURS.map((h) => (
                        <option key={h} value={h}>{shortHour(h)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {windowError && (
                  <p role="alert" className="mt-2 text-sm font-medium text-red-500">{windowError}</p>
                )}
                <button
                  onClick={() => {
                    if (fromDraft === toDraft) {
                      setWindowError("From and To can't be the same hour.");
                      return;
                    }
                    const id = wakeTracker.id;
                    requireAuth({
                      route: "/wake-up",
                      label: "Save wake hours",
                      payload: { windowStart: fromDraft, windowEnd: toDraft },
                      replay: () => {
                        updateTracker(id, { windowStart: fromDraft, windowEnd: toDraft });
                        setWindowOpen(false);
                      },
                    });
                  }}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
                >
                  SAVE HOURS
                </button>
              </Sheet>
            </>
          ) : (
            <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
              No wake tracker yet — add a Time tracker named “Wake Up” from Home.
            </p>
          )}
        </section>
      </main>
    </AppShell>
  );
}
