"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutGrid, Plus, Settings2, Table2 } from "lucide-react";
import { TrackerCard } from "./TrackerCard";
import { Timetable } from "./Timetable";
import { TrackerSheet } from "../trackers/TrackerSheet";
import { ManageSheet } from "../trackers/ManageSheet";
import { fullDateLong } from "@/lib/dates";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import { selectTrackersForDate, useWinterArc } from "@/lib/store";
import type { Tracker } from "@/lib/types";

export function TodayTrack({ date }: { date: string }) {
  const trackers = useWinterArc((s) => s.trackers);
  const view = useWinterArc((s) => s.view);
  const setView = useWinterArc((s) => s.setView);
  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [editing, setEditing] = useState<Tracker | undefined>(undefined);
  const pathname = usePathname();

  const visible = selectTrackersForDate(trackers, date);
  const hasAny = trackers.some((t) => t.status === "active");

  const openAdd = () =>
    requireAuth({ route: pathname, label: "Add Tracker", payload: { sheet: "add" }, replay: () => setAddOpen(true) });
  const openManage = () =>
    requireAuth({ route: pathname, label: "Manage trackers", payload: { sheet: "manage" }, replay: () => setManageOpen(true) });

  useAuthResume((a) => {
    const p = a.payload ?? {};
    if (p.sheet === "add") setAddOpen(true);
    else if (p.sheet === "manage") setManageOpen(true);
    else if (p.sheet === "edit" && typeof p.trackerId === "string") {
      const t = useWinterArc.getState().trackers.find((x) => x.id === p.trackerId);
      if (t) setEditing(t);
    }
  });

  return (
    <section aria-label="Today's track">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <CalendarDays className="h-5 w-5 text-accent" />
          Today&apos;s Track
        </h2>
        <span className="text-sm text-muted">• {fullDateLong(date)}</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-xl border border-border bg-card p-0.5" role="tablist" aria-label="View">
            <button
              role="tab"
              aria-selected={view === "cards"}
              onClick={() => setView("cards")}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold ${view === "cards" ? "bg-foreground text-background" : "text-muted"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Cards
            </button>
            <button
              role="tab"
              aria-selected={view === "timetable"}
              onClick={() => setView("timetable")}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold ${view === "timetable" ? "bg-foreground text-background" : "text-muted"}`}
            >
              <Table2 className="h-3.5 w-3.5" /> Table
            </button>
          </div>
          <button
            onClick={openManage}
            aria-label="Manage trackers"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card"
          >
            <Settings2 className="h-4 w-4" />
          </button>
          <button
            onClick={openAdd}
            className="flex h-9 items-center gap-1 rounded-xl bg-accent px-3 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" /> Add Tracker
          </button>
        </div>
      </div>

      {view === "cards" ? (
        visible.length === 0 ? (
          hasAny ? (
            <EmptyDay onAdd={openAdd} />
          ) : (
            <WelcomeEmpty onAdd={openAdd} />
          )
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visible.map((t) => (
              <TrackerCard key={t.id} tracker={t} date={date} onEdit={setEditing} />
            ))}
          </div>
        )
      ) : (
        <Timetable trackers={visible} date={date} />
      )}

      <TrackerSheet open={addOpen} onClose={() => setAddOpen(false)} />
      <TrackerSheet open={!!editing} initial={editing} onClose={() => setEditing(undefined)} />
      <ManageSheet open={manageOpen} onClose={() => setManageOpen(false)} />
    </section>
  );
}

function WelcomeEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted">DAY ONE</p>
      <p className="text-xl font-extrabold">Your Arc is ready.</p>
      <p className="max-w-md text-sm text-muted">
        Add the first thing you want to track — water, sleep, workouts, anything.
        It will appear here every day.
      </p>
      <button
        onClick={onAdd}
        className="flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background"
      >
        <Plus className="h-4 w-4" /> ADD YOUR FIRST TRACKER
      </button>
    </div>
  );
}

function EmptyDay({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6">
      <p className="text-sm font-bold">Rest day — nothing scheduled.</p>
      <button
        onClick={onAdd}
        className="flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
      >
        <Plus className="h-4 w-4" /> ADD TRACKER
      </button>
    </div>
  );
}
