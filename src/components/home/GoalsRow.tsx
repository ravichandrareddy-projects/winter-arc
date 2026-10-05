"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Pencil, Target } from "lucide-react";
import { Sheet } from "../Sheet";
import { TrackerBadge } from "../icons";
import { formatNumber } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import { useWinterArc } from "@/lib/store";
import type { Tracker } from "@/lib/types";

export function goalLabel(t: Tracker): string {
  if (t.target != null) {
    const u = t.unit ? ` ${t.unit}` : "";
    return `${formatNumber(t.target)}${u} / day`;
  }
  if (t.type === "boolean") return "1 session / day";
  if (t.type === "time") return "daily";
  if (t.type === "meals") return "daily";
  return "daily";
}

export function GoalsRow() {
  const trackers = useWinterArc((s) => s.trackers);
  const updateTracker = useWinterArc((s) => s.updateTracker);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const openEditor = () =>
    requireAuth({ route: pathname, label: "Edit Goals", payload: { sheet: "goals" }, replay: () => setOpen(true) });

  useAuthResume((a) => {
    if (a.payload?.sheet === "goals") setOpen(true);
  });

  const active = [...trackers]
    .filter((t) => t.status === "active")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (active.length === 0) return null;

  return (
    <section aria-label="Your goals">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <Target className="h-5 w-5 text-accent" />
          Your Goals
        </h2>
        <button
          onClick={openEditor}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit Goals
        </button>
      </div>

      <div className="nice-scroll flex gap-2 overflow-x-auto pb-1">
        {active.map((t) => (
          <div
            key={t.id}
            className="flex min-w-[150px] flex-1 items-center gap-2.5 rounded-2xl border border-border bg-card px-3 py-2.5"
          >
            <TrackerBadge icon={t.icon} color={t.color} size="sm" />
            <div className="leading-tight">
              <p className="text-[13px] font-bold">{t.name}</p>
              <p className="text-[13px] font-bold" style={{ color: t.color }}>
                {goalLabel(t)}
                <span className="font-normal text-muted"> </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} label="Edit goals">
        <h2 className="mb-1 text-base font-bold">Edit Goals</h2>
        <p className="mb-3 text-xs text-muted">
          Target changes apply from today onward. History is never rewritten.
        </p>
        <div className="flex flex-col gap-2">
          {active.map((t) => (
            <GoalEditor key={t.id} tracker={t} onSave={updateTracker} />
          ))}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          DONE
        </button>
      </Sheet>
    </section>
  );
}

function GoalEditor({
  tracker,
  onSave,
}: {
  tracker: Tracker;
  onSave: (id: string, patch: Partial<Tracker>) => void;
}) {
  const [target, setTarget] = useState(
    tracker.target != null ? String(tracker.target) : ""
  );
  const [unit, setUnit] = useState(tracker.unit ?? "");
  const [step, setStep] = useState(String(tracker.step));

  const commit = () => {
    const patch: Partial<Tracker> = {};
    const n = Number(target);
    if (tracker.target != null || target !== "") {
      if (target !== "" && Number.isFinite(n) && n > 0) patch.target = n;
    }
    if (unit.trim() !== (tracker.unit ?? "")) patch.unit = unit.trim() || undefined;
    const st = Number(step);
    if (Number.isFinite(st) && st > 0 && st !== tracker.step) patch.step = st;
    if (Object.keys(patch).length > 0) onSave(tracker.id, patch);
  };

  const hasTarget = tracker.target != null || tracker.type === "quantity" || tracker.type === "numeric" || tracker.type === "duration" || tracker.type === "meals";

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2.5">
      <TrackerBadge icon={tracker.icon} color={tracker.color} size="sm" />
      <p className="w-20 shrink-0 truncate text-sm font-bold">{tracker.name}</p>
      {hasTarget ? (
        <>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onBlur={commit}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            aria-label={`${tracker.name} target`}
            placeholder="—"
            className="h-10 w-20 rounded-lg border border-border bg-background px-2 text-sm"
          />
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            onBlur={commit}
            maxLength={10}
            aria-label={`${tracker.name} unit`}
            placeholder="unit"
            className="h-10 w-16 rounded-lg border border-border bg-background px-2 text-sm"
          />
        </>
      ) : (
        <span className="text-xs text-muted">
          {tracker.type === "boolean" ? "daily check" : "logged daily"}
        </span>
      )}
      <label className="ml-auto flex items-center gap-1 text-xs text-muted">
        ±
        <input
          value={step}
          onChange={(e) => setStep(e.target.value)}
          onBlur={commit}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          aria-label={`${tracker.name} step`}
          className="h-10 w-16 rounded-lg border border-border bg-background px-2 text-sm"
        />
      </label>
    </div>
  );
}
