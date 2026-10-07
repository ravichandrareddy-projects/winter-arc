"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, ChevronDown, Moon, Sun, Sunrise } from "lucide-react";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { dismissFire, useReminderFire } from "@/lib/notify";
import { requireAuth } from "@/lib/auth-guard";
import { useAuthResume } from "@/lib/auth";
import { arcDayNumber } from "@/lib/dates";
import { Sheet } from "../Sheet";
import { DefaultAvatar } from "../brand";
import { greetingForHour, monthDayYear } from "@/lib/dates";
import {
  selectEntriesFor,
  selectIsCompleted,
  selectTrackersForDate,
  useWinterArc,
} from "@/lib/store";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/** Server and client can disagree on hour/timezone — render clock bits client-only. */
function useNowHour(): number | null {
  const mounted = useMounted();
  const [hour, setHour] = useState<number | null>(null);
  if (mounted && hour === null) {
    // setState during render after mount is safe here (runs once, then stabilizes)
    setHour(new Date().getHours());
  }
  return hour;
}

function GreetingIcon({ hour }: { hour: number | null }) {
  const h = hour ?? 9; // deterministic fallback matches server
  if (h < 12) return <Sunrise className="h-8 w-8 text-amber-400" />;
  if (h < 17) return <Sun className="h-8 w-8 text-amber-400" />;
  return <Moon className="h-8 w-8 text-indigo-300" />;
}

export function HomeHeader({ selectedDate }: { selectedDate: string }) {
  const arc = useWinterArc((s) => s.arc);
  const profile = useWinterArc((s) => s.profile);
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const dataMode = useWinterArc((s) => s.dataMode);
  const setProfile = useWinterArc((s) => s.setProfile);
  const [nameOpen, setNameOpen] = useState(false);
  const [draft, setDraft] = useState(profile.name);
  const [dueOpen, setDueOpen] = useState(false);
  const fire = useReminderFire();
  const pathname = usePathname();

  useAuthResume((a) => {
    const name = a.payload?.name;
    if (typeof name === "string" && name.trim()) {
      useWinterArc.getState().setProfile({ name: name.trim() });
    }
  });

  const hour = useNowHour();
  const greeting = greetingForHour(hour ?? 9); // deterministic fallback matches server
  const remaining = selectTrackersForDate(trackers, selectedDate).filter(
    (t) => !selectIsCompleted(t, selectEntriesFor(entries, t.id, selectedDate))
  );

  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <GreetingIcon hour={hour} />
        <div className="min-w-0">
          <p className="text-sm text-muted">{greeting},</p>
          <button
            onClick={() => {
              setDraft(profile.name);
              setNameOpen(true);
            }}
            className="max-w-full truncate text-3xl font-extrabold tracking-tight"
            aria-label="Edit your name"
          >
            {profile.name}
          </button>
          <p className="mt-0.5 text-sm text-muted">
            Stay consistent. Your future self is watching.
          </p>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
        {dataMode !== "user" && (
          <Link
            href="/settings"
            title="Local device mode — 100% on-device private storage"
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-extrabold tracking-wider text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ON-DEVICE (PRIVATE)
          </Link>
        )}
        {arc && (
          <div className="order-last flex w-full min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs sm:order-none sm:w-auto">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted" />
            <span className="min-w-0 flex-1 font-medium">
              {monthDayYear(arc.startDate)} - {monthDayYear(arc.endDate)}
            </span>
            <span className="rounded-full bg-card-2 px-2 py-0.5 font-semibold">
              ({arc ? arcDayNumber(arc.startDate, arc.endDate) : 90} Days)
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted" />
          </div>
        )}
        <button
          onClick={() => {
            dismissFire();
            setDueOpen(true);
          }}
          aria-label="Remaining today"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card"
        >
          <Bell className="h-5 w-5" />
          {remaining.length > 0 && !fire && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
              {remaining.length}
            </span>
          )}
          {fire && (
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-ping rounded-full bg-accent opacity-75" />
          )}
          {fire && (
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-accent" />
          )}
        </button>
        <Link href="/settings" title="Profile & Settings" className="rounded-full transition-transform hover:scale-105">
          <DefaultAvatar name={profile.name} />
        </Link>
      </div>

      {/* edit name */}
      <Sheet open={nameOpen} onClose={() => setNameOpen(false)} label="Edit name">
        <h2 className="mb-3 text-base font-bold">Your name</h2>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={30}
          className="h-12 w-full rounded-xl border border-border bg-background px-4"
        />
        <button
          onClick={() => {
            const v = draft.trim();
            if (!v) {
              setNameOpen(false);
              return;
            }
            requireAuth({
              route: pathname,
              label: "Change profile",
              payload: { name: v },
              replay: () => {
                setProfile({ name: v });
                setNameOpen(false);
              },
            });
          }}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background"
        >
          SAVE
        </button>
      </Sheet>

      {/* remaining today */}
      <Sheet open={dueOpen} onClose={() => setDueOpen(false)} label="Remaining">
        <h2 className="mb-1 text-base font-bold">Still open</h2>
        <p className="mb-3 text-sm text-muted">
          {remaining.length === 0
            ? "All done for this day. 🎉"
            : `${remaining.length} tracker${remaining.length === 1 ? "" : "s"} left.`}
        </p>
        <ul className="flex flex-col gap-2">
          {remaining.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border border-border px-4 py-3 text-sm font-semibold"
            >
              {t.name}
            </li>
          ))}
        </ul>
      </Sheet>
    </header>
  );
}
