"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDaysKey,
  monthDayShort,
  weekdayShort,
  todayKey,
} from "@/lib/dates";

const WINDOW = 10;

export function DateStrip({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (d: string) => void;
}) {
  const today = todayKey();
  // window starts 5 days before selection so selected sits mid-strip like Image 2
  const [offset, setOffset] = useState(0);
  const base = addDaysKey(selectedDate, -5 + offset);
  const days = Array.from({ length: WINDOW }, (_, i) => addDaysKey(base, i));

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOffset((o) => o - WINDOW)}
        aria-label="Previous days"
        className="flex h-12 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card"
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
