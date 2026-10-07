"use client";

import { useMemo, useState } from "react";
import { BedDouble, ChevronDown, Moon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HomeHeader } from "@/components/home/HomeHeader";
import { DateStrip } from "@/components/home/DateStrip";
import { TimeGrid } from "@/components/sleep/TimeGrid";
import { TimeStats } from "@/components/sleep/TimeStats";
import { Sheet } from "@/components/Sheet";
import { formatTime12, getArcWindowDays, arcDayNumber, todayKey } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useWinterArc } from "@/lib/store";
import { DEFAULT_SLEEP_WINDOW, WINDOW_HOURS } from "@/lib/types";

function shortHour(hhmm: string): string {
  return formatTime12(hhmm).replace(":00", "");
}

export default function SleepPage() {
  const arc = useWinterArc((s) => s.arc);
  const trackers = useWinterArc((s) => s.trackers);
  const selectedDate = useWinterArc((s) => s.selectedDate);
  const setSelectedDate = useWinterArc((s) => s.setSelectedDate);
  const [range, setRange] = useState<7 | 14 | 30>(14);

  const arcStart = arc?.startDate ?? todayKey();
  const totalDays = arc ? arcDayNumber(arc.startDate, arc.endDate) : 90;

  const sleepTracker =
    trackers.find((t) => t.name.toLowerCase() === "sleep" && t.status === "active") ??
    trackers.find((t) => t.type === "time" && t.status === "active");
  const updateTracker = useWinterArc((s) => s.updateTracker);
  const [windowOpen, setWindowOpen] = useState(false);
  const [fromDraft, setFromDraft] = useState(
    sleepTracker?.windowStart ?? DEFAULT_SLEEP_WINDOW.start
  );
  const [toDraft, setToDraft] = useState(
    sleepTracker?.windowEnd ?? DEFAULT_SLEEP_WINDOW.end
  );
  const [windowError, setWindowError] = useState("");

  // Show recorded history through the selected day, bounded by the arc and today.
  const days = useMemo(
    () => getArcWindowDays(arcStart, selectedDate, range, totalDays),
    [arcStart, selectedDate, range, totalDays]
  );

  const winLabel = sleepTracker
    ? `${shortHour(sleepTracker.windowStart ?? DEFAULT_SLEEP_WINDOW.start)} – ${shortHour(sleepTracker.windowEnd ?? DEFAULT_SLEEP_WINDOW.end)}`
    : "";

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6">
        <HomeHeader selectedDate={selectedDate} />

        <div className="flex items-center gap-3">
          <Moon className="h-9 w-9 text-indigo-400" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Sleep</h1>
            <p className="text-sm text-muted">
              Track when you sleep and see your pattern over time.
            </p>
          </div>
        </div>

        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

        <section aria-label="Sleep time" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-base font-extrabold">
              <BedDouble className="h-5 w-5 text-sky-400" />
              Sleep Time
            </h2>
            <span className="text-sm text-muted">Tap the box when you went to sleep.</span>
            {sleepTracker && (
              <button
                onClick={() => {
                  setFromDraft(sleepTracker.windowStart ?? DEFAULT_SLEEP_WINDOW.start);
                  setToDraft(sleepTracker.windowEnd ?? DEFAULT_SLEEP_WINDOW.end);
                  setWindowError("");
                  setWindowOpen(true);
                }}
                aria-label="Change sleep hours"
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

          {sleepTracker ? (
            <>
              <TimeGrid mode="sleep"
                tracker={sleepTracker}
                days={days}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <TimeStats mode="sleep"
                tracker={sleepTracker}
                days={days}
                rangeLabel={`last ${range} days`}
              />
              <Sheet open={windowOpen} onClose={() => setWindowOpen(false)} label="Sleep hours">
                <h2 className="mb-1 text-base font-bold">Your sleep hours</h2>
                <p className="mb-3 text-xs text-muted">
                  Pick your window — e.g. 7 PM to 12 AM, or 7 PM to 2 AM. The grid rebuilds its boxes from it.
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
                    const id = sleepTracker.id;
                    requireAuth({
                      route: "/sleep",
                      label: "Save sleep hours",
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
              No sleep tracker yet — add a Time tracker named “Sleep” from Home.
            </p>
          )}
        </section>
      </main>
    </AppShell>
  );
}
