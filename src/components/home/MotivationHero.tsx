"use client";

import { useMemo, useState } from "react";
import { Flame, RefreshCw, ShieldAlert, Sparkles, Trophy, Zap } from "lucide-react";
import { arcDayNumber, todayKey } from "@/lib/dates";
import { dispatchToast } from "@/lib/notify";
import { useWinterArc, selectEntriesFor, selectIsCompleted } from "@/lib/store";
import {
  getArcPhase,
  MOTIVATION_QUOTES,
  type MotivationQuote,
} from "@/lib/motivation";

export function MotivationHero() {
  const arc = useWinterArc((s) => s.arc);
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const today = todayKey();

  const totalDays = arc ? arcDayNumber(arc.startDate, arc.endDate) : 90;
  const dayN = arc ? Math.min(totalDays, Math.max(1, arcDayNumber(arc.startDate, today))) : 1;
  const phase = getArcPhase(dayN);

  // Daily seed quote + shuffle capability
  const [quoteIndex, setQuoteIndex] = useState(() => (dayN * 3) % MOTIVATION_QUOTES.length);
  const [isRotating, setIsRotating] = useState(false);
  const [lockedIn, setLockedIn] = useState(false);

  const activeQuote: MotivationQuote = MOTIVATION_QUOTES[quoteIndex] ?? MOTIVATION_QUOTES[0];

  // Calculate today's completed trackers
  const todayCompleted = useMemo(() => {
    return trackers.filter((t) => {
      if (t.status !== "active") return false;
      const list = selectEntriesFor(entries, t.id, today);
      return selectIsCompleted(t, list);
    }).length;
  }, [trackers, entries, today]);

  const activeTrackersCount = trackers.filter((t) => t.status === "active").length;
  const streakPct = activeTrackersCount > 0 ? Math.round((todayCompleted / activeTrackersCount) * 100) : 0;

  const shuffleQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length);
      setIsRotating(false);
      dispatchToast({
        title: "Mindset Refreshed",
        body: "New Winter Arc directive loaded. Lock in.",
        icon: "sparkles",
      });
    }, 200);
  };

  const handleLockIn = () => {
    setLockedIn(true);
    dispatchToast({
      title: "Protocol Engaged 🔥",
      body: `Day ${dayN} commitment confirmed. Win this day without compromise.`,
      icon: "flame",
    });
  };

  return (
    <section
      aria-label="Winter Arc Motivation Hub"
      className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-card/90 via-card/60 to-card/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl sm:p-6"
    >
      {/* Ambient background glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Top Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase text-white shadow-sm"
              style={{ backgroundColor: phase.badgeColor }}
            >
              <Zap className="h-3.5 w-3.5" />
              Phase {phase.phase}: {phase.name}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card-2 px-3 py-1 text-xs font-bold text-foreground">
              Day {dayN} of {totalDays}
            </span>
          </div>

          {/* Streak Flame / Momentum Meter */}
          <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
            </span>
            <div className="text-left leading-none">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                Momentum
              </p>
              <p className="text-xs font-black text-amber-500">
                {streakPct > 0 ? `${streakPct}% Locked` : "Starting Today"}
              </p>
            </div>
          </div>
        </div>

        {/* Stoic Quote & Mission Directive */}
        <div className="rounded-2xl border border-border/70 bg-card-2/50 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent">
                DAILY MINDSET DIRECTIVE
              </span>
              <blockquote className="mt-1 text-base font-extrabold italic text-foreground leading-snug sm:text-lg">
                &ldquo;{activeQuote.quote}&rdquo;
              </blockquote>
              <p className="mt-1.5 text-xs font-bold text-muted">
                — {activeQuote.author}
              </p>
            </div>

            {/* Shuffle Button */}
            <button
              onClick={shuffleQuote}
              aria-label="Shuffle motivational quote"
              title="Get another quote"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted hover:border-accent hover:text-accent transition-all duration-200"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRotating ? "animate-spin text-accent" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Action Bar: Lock in & Daily Progress */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-muted">
            <span className="font-bold text-foreground">
              {todayCompleted} of {activeTrackersCount}
            </span>{" "}
            tasks checked today. Every rep counts towards transformation.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLockIn}
              disabled={lockedIn}
              className={`flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-extrabold transition-all duration-200 shadow-sm ${
                lockedIn
                  ? "bg-good text-white cursor-default"
                  : "bg-foreground text-background hover:opacity-90 active:scale-95"
              }`}
            >
              {lockedIn ? (
                <>
                  <Trophy className="h-4 w-4" /> PROTOCOL LOCKED IN
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 text-amber-400" /> LOCK IN FOR TODAY
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
