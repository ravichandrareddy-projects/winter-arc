"use client";

import { useState } from "react";
import { CheckCircle2, Compass, Flag, Shield, Sparkles } from "lucide-react";
import { arcDayNumber, todayKey } from "@/lib/dates";
import { dispatchToast } from "@/lib/notify";
import { useWinterArc } from "@/lib/store";
import { ARC_PHASES, getDailyChallenge } from "@/lib/motivation";

export function ArcPhaseRoadmap({ selectedDate }: { selectedDate: string }) {
  const arc = useWinterArc((s) => s.arc);
  const today = todayKey();

  const totalDays = arc ? arcDayNumber(arc.startDate, arc.endDate) : 90;
  const dayN = arc ? Math.min(totalDays, Math.max(1, arcDayNumber(arc.startDate, selectedDate))) : 1;

  const currentPhaseIndex = dayN <= 30 ? 0 : dayN <= 60 ? 1 : 2;
  const dailyChallenge = getDailyChallenge(dayN);
  const [challengeDone, setChallengeDone] = useState(false);

  const toggleChallenge = () => {
    const next = !challengeDone;
    setChallengeDone(next);
    if (next) {
      dispatchToast({
        title: "Daily Challenge Crushed! ⚡",
        body: `${dailyChallenge.title} completed (${dailyChallenge.xp} awarded to your discipline bank).`,
        icon: "sparkles",
      });
    }
  };

  return (
    <section aria-label="Winter Arc Roadmap" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <Compass className="h-5 w-5 text-accent" />
          90-Day Arc Roadmap & Protocol
        </h2>
        <span className="text-xs font-bold text-muted">
          Day {dayN} of {totalDays}
        </span>
      </div>

      {/* 3-Phase Roadmap Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {ARC_PHASES.map((p, idx) => {
          const isCurrent = idx === currentPhaseIndex;
          const isPast = idx < currentPhaseIndex;
          const isFuture = idx > currentPhaseIndex;

          return (
            <div
              key={p.phase}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4.5 transition-all duration-200 ${
                isCurrent
                  ? "border-accent/80 bg-gradient-to-b from-card via-card to-accent/5 shadow-md shadow-accent/5"
                  : "border-border/70 bg-card/60 opacity-85 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: p.badgeColor }}
                  >
                    Phase {p.phase}
                  </span>
                  <span className="text-xs font-bold text-muted">{p.dayRange}</span>
                </div>

                <h3 className="mt-2 text-sm font-extrabold text-foreground">
                  {p.name}
                </h3>
                <p className="text-xs font-semibold text-accent/90">{p.subtitle}</p>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                {isPast ? (
                  <span className="flex items-center gap-1 font-bold text-good">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Conquered
                  </span>
                ) : isCurrent ? (
                  <span className="flex items-center gap-1 font-extrabold text-accent">
                    <Flag className="h-3.5 w-3.5 animate-bounce" /> Current Ground
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-muted">
                    <Shield className="h-3.5 w-3.5" /> Upcoming
                  </span>
                )}
                <span className="text-[11px] font-bold text-muted">
                  {isCurrent ? `Day ${dayN} / 90` : p.dayRange}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Stoic Discipline Challenge Box */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card-2 to-card p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-accent">
                  TODAY&apos;S DISCIPLINE CHALLENGE
                </p>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                  {dailyChallenge.xp}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {dailyChallenge.title}:{" "}
                <span className="font-normal text-muted">{dailyChallenge.target}</span>
              </p>
            </div>
          </div>

          <button
            onClick={toggleChallenge}
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold transition-all duration-200 ${
              challengeDone
                ? "bg-good text-white shadow-sm"
                : "border border-border bg-card hover:border-accent hover:text-accent text-foreground"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {challengeDone ? "CHALLENGE CRUSHED" : "MARK CHALLENGE DONE"}
          </button>
        </div>
      </div>
    </section>
  );
}
