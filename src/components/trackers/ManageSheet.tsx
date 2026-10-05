"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Sheet } from "../Sheet";
import { TrackerBadge } from "../icons";
import { useWinterArc } from "@/lib/store";

export function ManageSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const trackers = useWinterArc((s) => s.trackers);
  const setTrackerStatus = useWinterArc((s) => s.setTrackerStatus);
  const reorderTrackers = useWinterArc((s) => s.reorderTrackers);

  const sorted = [...trackers].sort((a, b) => a.sortOrder - b.sortOrder);
  const active = sorted.filter((t) => t.status !== "archived");
  const archived = sorted.filter((t) => t.status === "archived");

  const move = (id: string, dir: -1 | 1) => {
    const ids = active.map((t) => t.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorderTrackers([...ids, ...archived.map((t) => t.id)]);
  };

  return (
    <Sheet open={open} onClose={onClose} label="Manage trackers">
      <h2 className="mb-3 text-base font-bold">Manage Trackers</h2>
      <div className="flex max-h-[65vh] flex-col gap-2 overflow-y-auto">
        {active.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2">
            <TrackerBadge icon={t.icon} color={t.color} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{t.name}</p>
              <p className="text-xs text-muted">{t.status}</p>
            </div>
            <button onClick={() => move(t.id, -1)} aria-label={`Move ${t.name} up`} className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button onClick={() => move(t.id, 1)} aria-label={`Move ${t.name} down`} className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
              <ArrowDown className="h-4 w-4" />
            </button>
            {t.status === "paused" ? (
              <button onClick={() => setTrackerStatus(t.id, "active")} className="h-9 rounded-full border border-border px-3 text-xs font-semibold">RESUME</button>
            ) : (
              <button onClick={() => setTrackerStatus(t.id, "paused")} className="h-9 rounded-full border border-border px-3 text-xs font-semibold">PAUSE</button>
            )}
            <button onClick={() => setTrackerStatus(t.id, "archived")} className="h-9 rounded-full border border-border px-3 text-xs font-semibold">ARCHIVE</button>
          </div>
        ))}
        {archived.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-xs font-semibold tracking-wider text-muted">ARCHIVED — HISTORY KEPT</p>
            {archived.map((t) => (
              <div key={t.id} className="mb-1 flex items-center justify-between rounded-2xl border border-border px-3 py-2 opacity-70">
                <p className="text-sm font-bold">{t.name}</p>
                <button onClick={() => setTrackerStatus(t.id, "active")} className="h-9 rounded-full border border-border px-3 text-xs font-semibold">RESTORE</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
