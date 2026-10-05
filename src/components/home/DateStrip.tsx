"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDaysKey,
  monthDayShort,
  weekdayShort,
  todayKey,
  parseKey,
} from "@/lib/dates";
import { differenceInCalendarDays } from "date-fns";
import { useWinterArc } from "@/lib/store";

const WINDOW = 10;

export function DateStrip({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (d: string) => void;
}) {
  const arc = useWinterArc((s) => s.arc);
  const today = todayKey();
  const arcStart = arc?.startDate ?? today;
  const [offset, setOffset] = useState(0);

  // Never show dates before arcStart (no yesterday or pre-arc dates)
  const diffFromStart = Math.max(0, differenceInCalendarDays(parseKey(selectedDate), parseKey(arcStart)));
  const back = Math.min(diffFromStart, 2);
  const rawBase = addDaysKey(selectedDate, -back + offset);
  const base = rawBase < arcStart ? arcStart : rawBase;
  const days = Array.from({ length: WINDOW }, (_, i) => addDaysKey(base, i));

  const atStart = base <= arcStart;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOffset((o) => Math.max(0, o - WINDOW))}
        disabled={atStart}
        aria-label="Previous days"
        className={`flex h-12 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card transition-opacity ${
          atStart ? "opacity-30 cursor-not-allowed" : "hover:border-accent"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="nice-scroll flex flex-1 gap-2 overflow-x-auto" role="tablist" aria-label="Select date">
        {days.map((d) => {
          const selected = d === selectedDate;
          const isToday = d === today;
          return (
            <button
              key={d}
              role="tab"
              aria-selected={selected}
              onClick={() => {
                onSelect(d);
                setOffset(0);
              }}
              className={`flex min-h-[56px] min-w-[76px] flex-1 flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-xs backdrop-blur-sm transition-colors ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-foreground/20 bg-white/[0.05] text-muted"
              }`}
            >
              <span className={selected ? "opacity-80" : ""}>{weekdayShort(d)}</span>
              <span className={`font-bold ${selected ? "text-white" : "text-foreground"}`}>
                {monthDayShort(d)}
              </span>
              {isToday && !selected && <span className="mt-0.5 h-1 w-1 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setOffset((o) => o + WINDOW)}
        aria-label="Next days"
        className="flex h-12 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
