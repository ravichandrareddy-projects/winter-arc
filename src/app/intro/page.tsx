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
  Play,
  Check,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { setHasSeenIntro } from "@/lib/intro-storage";

function markSeenAndEnter(): void {
  setHasSeenIntro(true);
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
    desc: "Review your consistency at night. A 90-day arc progresses through Foundation (Days 1–30), Hardening (Days 31–60), and Transcendence (Days 61–90). Phase lengths adapt to your chosen duration.",
    tip: "Rule of the Arc: Never allow two missed days in a row.",
    icon: Flame,
    color: "#f59e0b",
  },
];

const MODULE_GUIDES = [
  {
    id: "sleep",
    title: "Sleep & Circadian Rhythm",
    tag: "Recovery",
    icon: Moon,
    color: "#818cf8",
    img: "/video-assets/real/04_sleep.webp",
    stat: "8.2 hrs",
    statDesc: "Average deep sleep target window",
    how: "Log your bedtime and morning wake time. Review average bedtime, earliest and latest times, schedule consistency, and sleep duration trends.",
  },
  {
    id: "wake",
    title: "Wake Up Discipline",
    tag: "Circadian",
    icon: Sun,
    color: "#fbbf24",
    img: "/video-assets/real/05_wake_up.webp",
    stat: "05:30 AM",
    statDesc: "Fixed sunrise wake-up lock-in",
    how: "Hit the morning check-in to confirm your rise time without snooze excuses. Lock in sunrise mental clarity.",
  },
  {
    id: "fitness",
    title: "Fitness & Training Splits",
    tag: "Hypertrophy",
    icon: Dumbbell,
    color: "#34d399",
    img: "/video-assets/real/06_fitness.webp",
    stat: "100%",
    statDesc: "Workout compliance milestone",
    how: "Check off your daily lifts, track reps and weights, log daily steps, and record physique milestone photos securely.",
  },
  {
    id: "food",
    title: "Food & Nutrition Fuel",
    tag: "Metabolic",
    icon: UtensilsCrossed,
    color: "#f97316",
    img: "/video-assets/real/07_food.webp",
    stat: "160g",
    statDesc: "Daily protein target intake",
    how: "Log breakfast, lunch, and dinner to stay in your calorie and protein targets with zero guesswork.",
  },
  {
    id: "progress",
    title: "Progress & Analytics",
    tag: "Intelligence",
    icon: TrendingUp,
    color: "#2e9bff",
    img: "/video-assets/real/08_progress.webp",
    stat: "+34%",
    statDesc: "Weekly consistency trajectory",
    how: "Visit the Progress tab to inspect habit completion heatmaps, weekly consistency, and sleep, wake-up, steps, and weight trends across your arc.",
  },
];

// Interactive Quick Simulator Card inside Intro
function QuickInteractiveDemo() {
  const [waterCount, setWaterCount] = useState(1.5);
  const [workoutChecked, setWorkoutChecked] = useState(false);
  const [sleepLogged, setSleepLogged] = useState(false);

  const goal = 3.0;
  const pct = Math.min(100, Math.round((waterCount / goal) * 100));

  return (
    <div className="glow-card rounded-3xl border border-accent/40 bg-card/85 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Zap className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-base font-bold text-foreground">Interactive Sandbox: Test 1-Tap Logging</h4>
            <p className="text-xs text-muted">Try clicking these buttons to see how fast logging works</p>
          </div>
        </div>
        <span className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-mono font-bold text-accent">
          Instant Live Feedback
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Habit 1: Hydration Increment */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card-2/60 p-4 transition hover:border-accent/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase">Hydration</span>
              <Droplets className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">{waterCount.toFixed(1)}L</span>
              <span className="text-xs text-muted">/ 3.0L</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWaterCount((prev) => +(Math.min(3.0, prev + 0.5).toFixed(1)))}
            className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-accent text-xs font-bold text-white shadow-sm transition hover:scale-102 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Tap +0.5L
          </button>
        </div>

        {/* Habit 2: Workout Check */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card-2/60 p-4 transition hover:border-emerald-500/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase">Push Day Lift</span>
              <Dumbbell className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">
                {workoutChecked ? "Completed" : "Pending"}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-muted">Chest & Triceps progressive overload split</p>
          </div>
          <button
            type="button"
            onClick={() => setWorkoutChecked((prev) => !prev)}
            className={`mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition hover:scale-102 active:scale-95 cursor-pointer ${
              workoutChecked
                ? "bg-emerald-500 text-white"
                : "border border-border bg-card text-foreground"
            }`}
          >
            {workoutChecked ? (
              <>
                <Check className="h-3.5 w-3.5" /> Done for Today
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-muted" /> Mark Completed
              </>
            )}
          </button>
        </div>

        {/* Habit 3: Sleep Sync */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card-2/60 p-4 transition hover:border-indigo-400/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase">Circadian Lock</span>
              <Moon className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">
                {sleepLogged ? "8.0 hrs" : "--"}
              </span>
              <span className="text-xs text-muted">logged</span>
            </div>
            <p className="mt-2 text-[11px] text-muted">Consistent 10:30 PM bedtime locked</p>
          </div>
          <button
            type="button"
            onClick={() => setSleepLogged((prev) => !prev)}
            className={`mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition hover:scale-102 active:scale-95 cursor-pointer ${
              sleepLogged
                ? "bg-indigo-500 text-white"
                : "border border-border bg-card text-foreground"
            }`}
          >
            {sleepLogged ? "✓ Bedtime Recorded" : "Quick Log Bedtime"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IntroOnboardingPage() {
  const [activeModule, setActiveModule] = useState(0);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground antialiased selection:bg-accent/25 selection:text-accent font-sans">
      {/* Background Mountain Backdrop & Dynamic Aurora */}
      <div aria-hidden="true" className="app-bg fixed inset-0 pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-1.5 sm:gap-3">
            <WinterArcLogo className="h-8 w-8 text-accent transition-transform group-hover:scale-105" />
            <span className="text-sm font-black tracking-tight sm:text-lg">
              WINTER<span className="text-accent ml-1">ARC</span>
            </span>
            <span className="ml-2 hidden rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-accent uppercase sm:inline">
              Official Portal
            </span>
          </Link>

          {/* Primary Action Button directly into Tracker Dashboard */}
          <Link
            href="/"
            onClick={markSeenAndEnter}
            id="intro-top-enter-btn"
            className="flex shrink-0 items-center gap-1 rounded-xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-2 py-2 text-[10px] sm:gap-2 sm:px-5 sm:text-sm font-extrabold text-white shadow-[0_0_24px_rgba(46,155,255,0.35)] transition duration-200 hover:scale-104 active:scale-95"
          >
            <span>ENTER TRACKER</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main Intro Info Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
        {/* ================================================================ */}
        {/* CRAZY CINEMATIC HERO ARTWORK DISPLAY                             */}
        {/* ================================================================ */}
        <section className="relative flex flex-col items-center text-center">
          {/* Animated Ambient Light Rays behind the Emblem */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[380px] w-[380px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-tr from-sky-500/25 via-blue-600/30 to-indigo-500/25 blur-[90px] animate-ray-sweep"
          />

          {/* Master Emblem Centerpiece with Floating Physics & Pulse Glow */}
          <div className="relative z-10 mx-auto w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] aspect-square rounded-[36px] overflow-hidden p-1 shadow-[0_0_80px_rgba(46,155,255,0.35)] animate-pulse-glow">
            <div className="relative h-full w-full rounded-[34px] overflow-hidden border border-white/20 bg-black/80">
              <Image
                src="/winter-arc-hero-art.webp"
                alt="Winter Arc Official Master Artwork"
                fill
                priority
                sizes="(max-width: 640px) 340px, 460px"
                className="object-cover object-center transition duration-700 hover:scale-105"
              />
              {/* Subtle Atmospheric Glass Rim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Badges and Subtext */}
          <div className="relative z-10 mt-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase text-accent shadow-lg animate-float">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>BEST WINTER ARC TRACKER PROTOCOL</span>
            </div>

            <h1 className="mt-5 text-3xl font-black sm:text-5xl md:text-6xl tracking-tight text-foreground">
              Master the Protocol in 3 Simple Steps.
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-muted leading-relaxed">
              Read this short interactive guide before entering your dashboard. Winter Arc takes less than 30 seconds of your day so you spend your energy executing, not logging.
            </p>
          </div>
        </section>

        {/* 3 Step Instruction Cards with Animated Glow Borders */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ONBOARDING_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="glow-card flex flex-col justify-between rounded-3xl border border-border/80 bg-card/80 p-7 shadow-xl backdrop-blur-xl transition hover:border-accent/40"
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

        {/* Interactive Quick Simulator Demo */}
        <div className="mt-16">
          <QuickInteractiveDemo />
        </div>

        {/* Modules Breakdown Section */}
        <section className="mt-20 glow-card rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          <div className="text-center sm:text-left mb-8">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
              Dashboard Modules
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
              What You&apos;ll Be Tracking
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Select any tab below to inspect live screenshots and understand how each specialized tracker works.
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
                  type="button"
                  onClick={() => setActiveModule(idx)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
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
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold text-accent">
                {MODULE_GUIDES[activeModule].tag}
              </span>
              <h3 className="mt-4 text-2xl font-black text-foreground">{MODULE_GUIDES[activeModule].title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {MODULE_GUIDES[activeModule].how}
              </p>

              {/* Key Stat Badge */}
              <div className="mt-6 rounded-2xl border border-accent/25 bg-accent-soft/40 p-4">
                <span className="text-xs font-mono font-bold text-accent uppercase">Target Baseline:</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-black text-foreground">{MODULE_GUIDES[activeModule].stat}</span>
                  <span className="text-xs text-muted">{MODULE_GUIDES[activeModule].statDesc}</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-black/80 lg:col-span-7">
              <Image
                src={MODULE_GUIDES[activeModule].img}
                alt={MODULE_GUIDES[activeModule].title}
                fill
                className="object-cover object-top transition duration-500 hover:scale-103"
              />
            </div>
          </div>
        </section>

        {/* Final Ready Call to Action */}
        <div className="mt-16 text-center rounded-3xl border border-accent/40 bg-gradient-to-br from-card via-card-2 to-card p-10 sm:p-14 shadow-2xl backdrop-blur-2xl">
          <WinterArcLogo className="mx-auto h-12 w-12 text-accent animate-float" />
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
