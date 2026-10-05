"use client";

import { Sheet } from "../Sheet";
import { TrackerForm } from "./TrackerForm";
import { todayKey } from "@/lib/dates";
import { useWinterArc } from "@/lib/store";
import type { Tracker, TrackerCategory, TrackerIcon } from "@/lib/types";

export function TrackerSheet({
  open,
  initial,
  defaults,
  onClose,
}: {
  open: boolean;
  /** undefined = add mode, tracker = edit mode */
  initial?: Tracker;
  /** add-mode presets, e.g. { category: "fitness" } for Add Item */
  defaults?: { category?: TrackerCategory; icon?: TrackerIcon };
  onClose: () => void;
}) {
  const arc = useWinterArc((s) => s.arc);
  const addTracker = useWinterArc((s) => s.addTracker);
  const updateTracker = useWinterArc((s) => s.updateTracker);
  const setTrackerStatus = useWinterArc((s) => s.setTrackerStatus);

  return (
    <Sheet open={open} onClose={onClose} label={initial ? "Edit tracker" : "Add tracker"}>
      <h2 className="mb-3 text-base font-bold">
        {initial ? `Edit ${initial.name}` : "+ ADD TRACKER"}
      </h2>
      <TrackerForm
        initial={initial}
        defaults={defaults}
        defaultStart={todayKey()}
        defaultEnd={arc?.endDate ?? todayKey()}
        submitLabel={initial ? "SAVE CHANGES" : "ADD TO MY ARC"}
        onSubmit={(v) => {
          if (initial) updateTracker(initial.id, v);
          else addTracker(v);
          onClose();
        }}
      />
      {initial && (
        <div className="mt-3 flex gap-2">
          {initial.status === "paused" ? (
            <button
              onClick={() => { setTrackerStatus(initial.id, "active"); onClose(); }}
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-border text-xs font-semibold"
            >
              RESUME
            </button>
          ) : (
            <button
              onClick={() => { setTrackerStatus(initial.id, "paused"); onClose(); }}
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-border text-xs font-semibold"
            >
              PAUSE
            </button>
          )}
          <button
            onClick={() => { setTrackerStatus(initial.id, "archived"); onClose(); }}
            className="flex h-11 flex-1 items-center justify-center rounded-full border border-border text-xs font-semibold"
          >
            ARCHIVE
          </button>
        </div>
      )}
      {!initial && (
        <p className="mt-2 text-xs text-muted">
          Appears every scheduled day until its end date. No re-adding.
        </p>
      )}
    </Sheet>
  );
}
