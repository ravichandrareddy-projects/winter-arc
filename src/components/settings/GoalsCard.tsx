"use client";

import { useState } from "react";
import { CalendarDays, Target } from "lucide-react";
import { SettingsCard, field } from "./SettingsCard";
import { addDaysKey, arcDayNumber } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useWinterArc } from "@/lib/store";

const DURATIONS = [30, 60, 90] as const;

export function GoalsCard() {
  const arc = useWinterArc((s) => s.arc);
  const setArcDates = useWinterArc((s) => s.setArcDates);
  const [start, setStart] = useState(arc?.startDate ?? "");
  const [end, setEnd] = useState(arc?.endDate ?? "");
  const [total, setTotal] = useState<string>("custom");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!arc) return null;

  const currentTotal = arcDayNumber(start || arc.startDate, end || arc.endDate);

  const pickDuration = (n: number) => {
    setTotal(String(n));
    setEnd(addDaysKey(start || arc.startDate, n - 1));
    setError("");
  };

  const save = () => {
    const s = start || arc.startDate;
    const e = end || arc.endDate;
    if (!s || !e) {
      setError("Pick both dates.");
      return;
    }
    if (e < s) {
      setError("End date must be on or after start date.");
      return;
    }
    const days = arcDayNumber(s, e);
    if (days > 365) {
      setError("Arcs are capped at 365 days.");
      return;
    }
    setError("");
    requireAuth({
      route: "/settings",
      label: "Save Arc dates",
      replay: () => {
        setArcDates(s, e);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      },
    });
  };

  return (
    <SettingsCard
      icon={<Target className="h-6 w-6 text-accent" />}
      title="Goals & Duration"
      sub="Set your Winter Arc goals."
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <label htmlFor="arc-start" className="w-24 shrink-0 text-sm">Start Date</label>
          <input
            id="arc-start"
            type="date"
            value={start || arc.startDate}
            onChange={(e) => {
              setStart(e.target.value);
              setTotal("custom");
              setError("");
              setSaved(false);
            }}
            className={field}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <label htmlFor="arc-end" className="w-24 shrink-0 text-sm">End Date</label>
          <input
            id="arc-end"
            type="date"
            value={end || arc.endDate}
            onChange={(e) => {
              setEnd(e.target.value);
              setTotal("custom");
              setError("");
              setSaved(false);
            }}
            className={field}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <label htmlFor="arc-total" className="flex w-24 shrink-0 items-center gap-1.5 text-sm">
            <CalendarDays className="h-4 w-4 text-muted" /> Total Days
          </label>
          <select
            id="arc-total"
            value={DURATIONS.map(String).includes(total) ? total : "custom"}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setTotal("custom");
              } else {
                pickDuration(Number(e.target.value));
              }
            }}
            className={field}
          >
            {DURATIONS.map((n) => (
              <option key={n} value={n}>
                {n} Days
              </option>
            ))}
            <option value="custom">Custom ({Math.max(0, currentTotal)} Days)</option>
          </select>
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-red-500">{error}</p>
        )}
        <button
          onClick={save}
          className="flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          {saved ? "SAVED ✓" : "SAVE DATES"}
        </button>
      </div>
    </SettingsCard>
  );
}
