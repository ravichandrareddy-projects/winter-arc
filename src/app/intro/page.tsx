"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Moon,
  Sun,
  Dumbbell,
  UtensilsCrossed,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Target,
  ChevronRight,
  Droplets,
  Smartphone,
  MousePointerClick,
  PlusCircle,
  CalendarDays,
  Lock,
  ListTodo,
  Layers,
  Compass,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";

function markSeenAndEnter(): void {
  try {
    window.localStorage.setItem("wa-seen-intro", "1");
  } catch {
    /* ignore */
  }
}

const ONBOARDING_STEPS = [
  {
    step: "01",
    badge: "Step 1: Set Goals",
    title: "Define Your Non-Negotiables",
    action: "Tap '+' on any tracker card to set targets",
    desc: "Lock in what matters across your 90 days: Water (liters), Sleep (hours), Workouts (splits), or Reading (pages). Focus on 4 to 6 foundational habits that build discipline.",
    tip: "Recommendation: Start with Sleep + Hydration as your core anchor.",
    icon: ListTodo,
    color: "#2e9bff",
  },
  {
    step: "02",
    badge: "Step 2: Log Daily",
    title: "1-Tap Quick Increments",
    action: "Tap '+' on your dashboard throughout the day",
    desc: "No long forms. Drank 500ml of water? Tap +0.5L. Completed your morning workout? Tap the checkmark. Done in under 3 seconds so logging never breaks your daily focus.",
    tip: "Real-time visual completion rings show instant feedback as you hit 100%.",
    icon: MousePointerClick,
    color: "#34d399",
  },
  {
    step: "03",
    badge: "Step 3: Review & Lock In",
    title: "Phase Roadmaps & Streaks",
    action: "Watch your 90-day progress arc light up",
    desc: "Review your consistency at night. Progress through Phase 1: Foundation (Days 1–30), Phase 2: Momentum (Days 31–60), and Phase 3: Mastery (Days 61–90). Protect your streak every single day.",
    tip: "Rule of the Arc: Never allow two missed days in a row.",
    icon: Flame,
    color: "#f59e0b",
  },
];

const MODULE_GUIDES = [
  {
    title: "Sleep & Circadian Rhythm",
    icon: Moon,
    color: "#818cf8",
    img: "/video-assets/real/04_sleep.png",
    how: "Log your bedtime and morning wake time. The system calculates your sleep latency, quality scores, and displays your circadian consistency.",
  },
  {
    title: "Wake Up Discipline",
    icon: Sun,
    color: "#fbbf24",
    img: "/video-assets/real/05_wake_up.png",
    how: "Hit the morning check-in to confirm your rise time without snooze excuses. Lock in sunrise mental clarity.",
  },
  {
    title: "Fitness & Training Splits",
    icon: Dumbbell,
    color: "#34d399",
    img: "/video-assets/real/06_fitness.png",
    how: "Check off your daily lifts, track reps and weights, log daily steps, and record physique milestone photos securely.",
  },
  {
    title: "Food & Nutrition Fuel",
    icon: UtensilsCrossed,
    color: "#f97316",
    img: "/video-assets/real/07_food.png",
    how: "Log breakfast, lunch, and dinner to stay in your calorie and protein targets with zero guesswork.",
  },
  {
    title: "Progress & Analytics",
    icon: TrendingUp,
    color: "#2e9bff",
    img: "/video-assets/real/08_progress.png",
    how: "Visit the Progress tab to inspect radar charts, weekly consistency deltas, and streak achievements over your 90-day arc.",
  },
];

export default function IntroOnboardingPage() {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground antialiased selection:bg-accent/25 selection:text-accent font-sans">
      {/* Background Mountain Backdrop */}
      <div aria-hidden="true" className="app-bg fixed inset-0 pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <WinterArcLogo className="h-6 w-9 text-accent" />
            <span className="text-lg font-black tracking-tight">
              WINTER<span className="text-accent ml-1">ARC</span>
            </span>
            <span className="ml-2 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-accent uppercase">
              Onboarding
            </span>
          </Link>

          {/* Primary Action Button directly into Tracker Dashboard */}
          <Link
            href="/"
            onClick={markSeenAndEnter}
            id="intro-top-enter-btn"
            className="flex items-center gap-2 rounded-xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-[0_0_24px_rgba(46,155,255,0.35)] transition duration-200 hover:scale-103 active:scale-95"
          >
            <span>ENTER TRACKER</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main Intro Info Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Intro Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-1 text-xs font-mono font-bold tracking-widest uppercase text-accent">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>HOW TO USE WINTER ARC</span>
          </div>
          <h1 className="mt-6 text-3xl font-black sm:text-5xl md:text-6xl tracking-tight text-foreground">
            Master the Protocol in 3 Simple Steps.
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
            Read this short guide before entering your dashboard. Winter Arc is engineered to take less than 30 seconds of your day so you spend your energy executing, not logging.
          </p>
        </div>

        {/* 3 Step Instruction Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ONBOARDING_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card/75 p-7 shadow-xl backdrop-blur-xl transition hover:border-accent/40 hover:bg-card"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl text-base font-mono font-black"
                      style={{ backgroundColor: `${s.color}20`, color: s.color }}
                    >
                      {s.step}
                    </span>
                    <span className="rounded-full border border-border bg-card-2/60 px-3 py-1 text-[11px] font-bold text-muted">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-foreground">{s.title}</h3>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-soft/70 px-2.5 py-1 text-xs font-semibold text-accent">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{s.action}</span>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4">
                  <p className="text-xs font-medium text-foreground/80">{s.tip}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modules Breakdown Section */}
        <section className="mt-20 rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          <div className="text-center sm:text-left mb-8">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
              Dashboard Modules
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
              What You&apos;ll Be Tracking
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Select any tab below to understand how each specialized tracker works.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border/60 pb-5">
            {MODULE_GUIDES.map((mod, idx) => {
              const Icon = mod.icon;
              const isActive = activeModule === idx;
              return (
                <button
                  key={mod.title}
                  onClick={() => setActiveModule(idx)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-accent text-white shadow-md scale-102"
                      : "border border-border/80 bg-card-2/50 text-muted hover:text-foreground hover:bg-card-2"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{mod.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Details */}
          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="text-2xl font-black text-foreground">{MODULE_GUIDES[activeModule].title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {MODULE_GUIDES[activeModule].how}
              </p>

              <div className="mt-6 rounded-2xl border border-accent/25 bg-accent-soft/40 p-4">
                <span className="text-xs font-mono font-bold text-accent uppercase">Daily Execution:</span>
                <p className="mt-1 text-xs text-foreground/90">
                  Open this tab daily, tap the action buttons to log values, and observe your consistency rise.
                </p>
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-black/80 lg:col-span-7">
              <Image
                src={MODULE_GUIDES[activeModule].img}
                alt={MODULE_GUIDES[activeModule].title}
                fill
                unoptimized
                className="object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* Final Ready Call to Action */}
        <div className="mt-16 text-center rounded-3xl border border-accent/40 bg-gradient-to-br from-card via-card-2 to-card p-10 sm:p-14 shadow-2xl backdrop-blur-2xl">
          <WinterArcLogo className="mx-auto h-12 w-16 text-accent" />
          <h2 className="mt-5 text-3xl sm:text-4xl font-black text-foreground">
            You Are Ready. Lock In.
          </h2>
          <p className="mt-3 max-w-md mx-auto text-sm sm:text-base text-muted">
            Tap below to enter your live Winter Arc dashboard now. Everything is saved locally to your device.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              onClick={markSeenAndEnter}
              id="intro-bottom-enter-btn"
              className="group flex h-14 items-center justify-center gap-3 rounded-2xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-10 text-base font-extrabold text-white shadow-[0_0_35px_rgba(46,155,255,0.45)] transition duration-200 hover:scale-105 active:scale-95"
            >
              <span>LAUNCH WINTER ARC DASHBOARD</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
