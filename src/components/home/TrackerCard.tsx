"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Ellipsis, Minus, Plus } from "lucide-react";
import { Sheet } from "../Sheet";
import { TrackerBadge } from "../icons";
import { formatNumber, formatTime12 } from "@/lib/dates";
import { displayUnit, displayValue } from "@/lib/units";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import {
  selectDailyTotal,
  selectEntriesFor,
  selectIsCompleted,
  selectProgressPct,
  useWinterArc,
} from "@/lib/store";
import type { Tracker } from "@/lib/types";
import { dispatchToast } from "@/lib/notify";

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold text-muted">{pct}%</span>
    </div>
  );
}

function Stepper({
  display,
  onMinus,
  onPlus,
  label,
}: {
  display: string;
  onMinus: () => void;
  onPlus: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onMinus}
        aria-label={`Less ${label}`}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-2"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex-1 text-center text-sm font-semibold">{display}</span>
      <button
        onClick={onPlus}
        aria-label={`More ${label}`}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-2"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function TrackerCard({
  tracker,
  date,
  onEdit,
}: {
  tracker: Tracker;
  date: string;
  onEdit: (t: Tracker) => void;
}) {
  const entries = useWinterArc((s) => s.entries);
  const nudge = useWinterArc((s) => s.nudge);
  const toggleBoolean = useWinterArc((s) => s.toggleBoolean);
  const logSingle = useWinterArc((s) => s.logSingle);
  const units = useWinterArc((s) => s.preferences.units);
  const [timeOpen, setTimeOpen] = useState(false);
  const [timeDraft, setTimeDraft] = useState("");
  const pathname = usePathname();

  const guard = (
    label: string,
    payload: Record<string, string | number>,
    run: () => void
  ) =>
    requireAuth({
      route: pathname,
      label,
      payload: { trackerId: tracker.id, date, ...payload },
      replay: run,
    });

  useAuthResume((a) => {
    const p = a.payload ?? {};
    if (p.trackerId !== tracker.id) return;
    const st = useWinterArc.getState();
    if (p.sheet === "time") {
      setTimeDraft(typeof p.value === "string" ? p.value : "");
      setTimeOpen(true);
    } else if (p.sheet === "edit") {
      onEdit(tracker);
    } else if (p.op === "nudge") {
      st.nudge(tracker.id, date, p.dir === -1 ? -1 : 1);
    } else if (p.op === "toggle") {
      st.toggleBoolean(tracker.id, date);
    } else if (p.op === "logTime" && typeof p.value === "string") {
      st.logSingle(tracker.id, date, p.value, true);
    }
  });

  const dayEntries = selectEntriesFor(entries, tracker.id, date);
  const total = selectDailyTotal(tracker, dayEntries);
  const done = selectIsCompleted(tracker, dayEntries);
  const pct = selectProgressPct(tracker, dayEntries);

  const head = (
    <div className="flex items-center gap-2">
      <TrackerBadge icon={tracker.icon} color={tracker.color} size="sm" />
      <p className="flex-1 truncate text-sm font-bold">{tracker.name}</p>
      <button
        onClick={() => guard(`Edit ${tracker.name}`, { sheet: "edit" }, () => onEdit(tracker))}
        aria-label={`Edit ${tracker.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted"
      >
        <Ellipsis className="h-4 w-4" />
      </button>
    </div>
  );

  // ---- boolean: completed card vs mark-done card ----
  if (tracker.type === "boolean") {
    return (
      <div className="flex min-h-[175px] flex-col justify-between gap-2.5 rounded-2xl border border-border bg-card p-3.5">
        {head}
        {done ? (
          <>
            <p className="flex items-center gap-2 text-sm font-bold" style={{ color: tracker.color }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-good text-white">
                <Check className="h-4 w-4" />
              </span>
              Completed today
            </p>
            <button
              onClick={() =>
                guard(`Tick ${tracker.name}`, { op: "toggle" }, () =>
                  toggleBoolean(tracker.id, date)
                )
              }
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border text-xs font-semibold text-muted"
            >
              ↺ Mark as Not Done
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">
              {tracker.target != null ? `0 / ${tracker.target}` : "Not done yet"}
            </p>
            <button
              onClick={() =>
                guard(`Tick ${tracker.name}`, { op: "toggle" }, () => {
                  toggleBoolean(tracker.id, date);
                  dispatchToast({
                    title: `${tracker.name} Completed! 🔥`,
                    body: "Daily discipline logged. Consistency creates momentum.",
                    icon: "check",
                  });
                })
              }
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl font-semibold text-white transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: tracker.color }}
            >
              <Check className="h-4 w-4" /> Mark Done
            </button>
          </>
        )}
      </div>
    );
  }

  // ---- time: big clock value + add/edit ----
  if (tracker.type === "time") {
    const val = dayEntries[0]?.value;
    return (
      <div className="flex min-h-[175px] flex-col justify-between gap-2.5 rounded-2xl border border-border bg-card p-3.5">
        {head}
        <p className="py-1 text-center text-xl font-extrabold">
          {typeof val === "string" && val ? formatTime12(val) : "--:--"}
        </p>
        <button
          onClick={() =>
            guard(`Log ${tracker.name}`, { sheet: "time" }, () => {
              setTimeDraft(typeof val === "string" ? val : "");
              setTimeOpen(true);
            })
          }
          className="flex h-10 items-center justify-center gap-1 rounded-xl border border-border text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" /> Add / Edit
        </button>
        <Sheet open={timeOpen} onClose={() => setTimeOpen(false)} label={`Log ${tracker.name}`}>
          <h2 className="mb-3 text-base font-bold">{tracker.name}</h2>
          <input
            type="time"
            value={timeDraft}
            onChange={(e) => setTimeDraft(e.target.value)}
            className="h-14 w-full rounded-xl border border-border bg-background px-4 text-lg"
          />
          <button
            onClick={() => {
              if (!timeDraft) {
                setTimeOpen(false);
                return;
              }
              const v = timeDraft;
              guard(`Log ${tracker.name}`, { op: "logTime", value: v }, () => {
                logSingle(tracker.id, date, v, true);
                setTimeOpen(false);
              });
            }}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
          >
            SAVE
          </button>
        </Sheet>
      </div>
    );
  }

  // ---- meals: segmented dots + stepper ----
  if (tracker.type === "meals") {
    const target = tracker.target ?? 4;
    const segs = Math.min(target, 8);
    return (
      <div className="flex min-h-[175px] flex-col justify-between gap-2.5 rounded-2xl border border-border bg-card p-3.5">
        {head}
        <p className="text-center text-sm">
          <span className="text-base font-extrabold">{formatNumber(total)}</span>
          <span className="text-muted"> / {target} meals</span>
        </p>
        <div className="flex items-center gap-1" aria-label={`${total} of ${target} meals`}>
          {Array.from({ length: segs }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < total ? "" : "bg-track"}`}
              style={i < total ? { backgroundColor: tracker.color } : undefined}
            />
          ))}
        </div>
        <p className="-mt-1 text-right text-xs font-bold text-muted">
          {target > 0 ? Math.round((Math.min(total, target) / target) * 100) : 0}%
        </p>
        <Stepper
          display={`${formatNumber(total)} / ${target}`}
          onMinus={() =>
            guard(`Log ${tracker.name}`, { op: "nudge", dir: -1 }, () =>
              nudge(tracker.id, date, -1)
            )
          }
          onPlus={() =>
            guard(`Log ${tracker.name}`, { op: "nudge", dir: 1 }, () =>
              nudge(tracker.id, date, 1)
            )
          }
          label={tracker.name}
        />
      </div>
    );
  }

  // ---- numeric / quantity / duration ----
  const shown = displayValue(tracker, total, units);
  const shownTarget = tracker.target != null ? displayValue(tracker, tracker.target, units) : null;
  const unit = displayUnit(tracker, units) ? ` ${displayUnit(tracker, units)}` : "";
  const big = (
    <p className="text-center text-sm">
      <span className="text-base font-extrabold" style={{ color: tracker.color }}>
        {formatNumber(+shown.toFixed(2))}
      </span>
      <span className="text-muted">
        {shownTarget != null ? ` / ${formatNumber(+shownTarget.toFixed(2))}${unit}` : unit}
      </span>
    </p>
  );
  return (
    <div className="flex min-h-[175px] flex-col justify-between gap-2.5 rounded-2xl border border-border bg-card p-3.5">
      {head}
      {big}
      <Bar pct={pct} color={tracker.color} />
      <Stepper
        display={`${formatNumber(+shown.toFixed(2))}${unit}`}
        onMinus={() =>
          guard(`Log ${tracker.name}`, { op: "nudge", dir: -1 }, () =>
            nudge(tracker.id, date, -1)
          )
        }
        onPlus={() =>
          guard(`Log ${tracker.name}`, { op: "nudge", dir: 1 }, () => {
            nudge(tracker.id, date, 1);
            dispatchToast({
              title: `${tracker.name} Updated ⚡`,
              body: `Daily progress logged. Keep the momentum high.`,
              icon: "flame",
            });
          })
        }
        label={tracker.name}
      />
      <div className="flex h-4 items-center">
        {done ? (
          <p className="flex items-center gap-1 text-xs font-bold" style={{ color: tracker.color }}>
            <Check className="h-3.5 w-3.5" /> Completed
          </p>
        ) : (
          <span className="text-[11px] text-muted">
            {total === 0 ? "Empty • Tap + to log" : "In progress"}
          </span>
        )}
      </div>
    </div>
  );
}
