"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { Sheet } from "../Sheet";
import { TrackerGlyph } from "../icons";
import { addDaysKey, formatCompact, formatNumber, monthDayShort, weekdayShort } from "@/lib/dates";
import { displayUnit, displayValue, parseInput } from "@/lib/units";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import {
  selectDailyTotal,
  selectEntriesFor,
  useWinterArc,
} from "@/lib/store";
import type { Tracker } from "@/lib/types";

const COLS = 7;

export function fitnessTrackers(trackers: Tracker[]): Tracker[] {
  return [...trackers]
    .filter((t) => t.status === "active" && t.category === "fitness")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function DayCell({
  tracker,
  date,
  selected,
  onEdit,
}: {
  tracker: Tracker;
  date: string;
  selected: boolean;
  onEdit: () => void;
}) {
  const entries = useWinterArc((s) => s.entries);
  const toggleBoolean = useWinterArc((s) => s.toggleBoolean);
  const dayEntries = selectEntriesFor(entries, tracker.id, date);
  const has = dayEntries.length > 0;
  const units = useWinterArc((s) => s.preferences.units);
  const pathname = usePathname();

  if (tracker.type === "boolean") {
    const done = dayEntries.some((e) => e.value === true);
    return (
      <button
        onClick={() =>
          requireAuth({
            route: pathname,
            label: `Tick ${tracker.name}`,
            payload: { trackerId: tracker.id, date, op: "toggle" },
            replay: () => toggleBoolean(tracker.id, date),
          })
        }
        aria-label={`${tracker.name} ${date}${done ? " (uncheck)" : ""}`}
        className={`flex h-9 w-full items-center justify-center rounded-lg border backdrop-blur-sm ${
          done ? "border-transparent" : "border-foreground/25 bg-white/[0.06]"
        }`}
        style={done ? { backgroundColor: tracker.color } : undefined}
      >
        {done && <Check className="h-4 w-4 text-white" />}
      </button>
    );
  }

  const total = selectDailyTotal(tracker, dayEntries);
  return (
    <button
      onClick={onEdit}
      aria-label={`${tracker.name} ${date}: ${has ? total : "add"}`}
      className={`flex h-9 w-full items-center justify-center rounded-lg border text-[13px] font-bold backdrop-blur-sm transition-colors ${
        has
          ? "border-border bg-card-2/50"
          : "border-foreground/25 bg-white/[0.06] text-foreground/60 hover:border-foreground/40"
      } ${selected ? "ring-1 ring-accent" : ""}`}
    >
      {has ? (
        tracker.type === "time" && typeof dayEntries[0]?.value === "string" ? (
          <span className="px-1 text-[11px]">{String(dayEntries[0].value).slice(0, 5)}</span>
        ) : (
          formatCompact(+displayValue(tracker, total, units).toFixed(2))
        )
      ) : (
        "–"
      )}
    </button>
  );
}

export function FitnessGrid({
  trackers,
  selectedDate,
}: {
  trackers: Tracker[];
  selectedDate: string;
}) {
  const logSingle = useWinterArc((s) => s.logSingle);
  const clearDayEntry = useWinterArc((s) => s.clearDayEntry);
  const entries = useWinterArc((s) => s.entries);
  const units = useWinterArc((s) => s.preferences.units);
  const [editing, setEditing] = useState<{ id: string; date: string } | null>(null);
  const [draft, setDraft] = useState("");
  const pathname = usePathname();

  const openEdit = (t: Tracker, date: string) => {
    requireAuth({
      route: pathname,
      label: `Edit ${t.name}`,
      payload: { trackerId: t.id, date, sheet: "fitness-edit" },
      replay: () => {
        const total = selectDailyTotal(t, selectEntriesFor(useWinterArc.getState().entries, t.id, date));
        const shown = displayValue(t, total, units);
        setDraft(total > 0 ? String(+shown.toFixed(2)) : "");
        setEditing({ id: t.id, date });
      },
    });
  };

  useAuthResume((a) => {
    const p = a.payload ?? {};
    if (p.sheet === "fitness-edit" && typeof p.trackerId === "string" && typeof p.date === "string") {
      const t = useWinterArc.getState().trackers.find((x) => x.id === p.trackerId);
      if (t) openEdit(t, p.date);
    } else if (p.op === "toggle" && typeof p.trackerId === "string" && typeof p.date === "string") {
      const t = useWinterArc.getState().trackers.find((x) => x.id === p.trackerId);
      if (t && t.type === "boolean") useWinterArc.getState().toggleBoolean(t.id, p.date);
    }
  });

  const days = useMemo(
    () => Array.from({ length: COLS }, (_, i) => addDaysKey(selectedDate, i - (COLS - 1))),
    [selectedDate]
  );

  const rows = fitnessTrackers(trackers);
  const editingTracker = rows.find((t) => t.id === editing?.id) ?? null;
  const editingTotal = editingTracker
    ? selectDailyTotal(editingTracker, selectEntriesFor(entries, editingTracker.id, editing!.date))
    : 0;

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
        No fitness trackers yet — tap + Add Item.
      </p>
    );
  }

  return (
    <div className="nice-scroll overflow-x-auto rounded-2xl border border-border bg-card">
      <div className="min-w-[640px]" role="grid" aria-label="Daily fitness tracking">
        <div className="flex items-center gap-1 border-b border-border px-3 py-2">
          <span className="w-36 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Activity
          </span>
          {days.map((d) => (
            <span key={d} className="flex-1 text-center text-[11px] text-muted">
              <span className={`block font-bold ${d === selectedDate ? "text-accent" : "text-foreground"}`}>
                {monthDayShort(d)}
              </span>
              <span className="block">{weekdayShort(d)}</span>
            </span>
          ))}
        </div>
        {rows.map((t) => (
          <div key={t.id} role="row" className="flex items-center gap-1 border-b border-border px-3 py-1.5 last:border-0">
            <span className="flex w-36 shrink-0 items-center gap-2">
              <TrackerGlyph icon={t.icon} className="h-4 w-4 shrink-0" style={{ color: t.color }} />
              <span className="truncate text-[13px] font-semibold">
                {t.name}
                {t.unit ? <span className="font-normal text-muted"> ({displayUnit(t, units)})</span> : ""}
              </span>
            </span>
            {days.map((d) => (
              <span key={d} className={`flex-1 rounded-lg ${d === selectedDate ? "bg-accent-soft px-0.5 py-0.5" : ""}`}>
                <DayCell tracker={t} date={d} selected={d === selectedDate} onEdit={() => openEdit(t, d)} />
              </span>
            ))}
          </div>
        ))}
      </div>

      <Sheet open={!!editing} onClose={() => setEditing(null)} label="Edit value">
        <h2 className="mb-1 text-base font-bold">
          {editingTracker?.name} {editing ? `— ${monthDayShort(editing.date)}` : ""}
        </h2>
        <p className="mb-2 text-xs text-muted">
          Day total{editingTracker?.unit ? ` in ${editingTracker ? displayUnit(editingTracker, units) : ""}` : ""}. Today so far: {formatNumber(+displayValue(editingTracker ?? { unit: undefined }, editingTotal, units).toFixed(2))}
        </p>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="0"
          autoFocus
          className="h-14 w-full rounded-xl border border-border bg-background px-4 text-lg"
        />
        <button
          onClick={() => {
            if (editing && editingTracker && draft !== "") {
              const n = Number(draft);
              if (Number.isFinite(n) && n >= 0) {
                logSingle(editingTracker.id, editing.date, parseInput(editingTracker, n, units), undefined, "12:00");
              }
            }
            setEditing(null);
          }}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          SAVE
        </button>
        <button
          onClick={() => {
            if (editing && editingTracker) clearDayEntry(editingTracker.id, editing.date);
            setEditing(null);
          }}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-semibold"
        >
          CLEAR DAY
        </button>
      </Sheet>
    </div>
  );
}
