"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { LiveUserCount } from "@/components/LiveUserCount";
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
  Activity,
  Layers,
  ArrowUpRight,
  Clock,
  Compass,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { useTheme } from "@/lib/theme-provider";
import { setHasSeenIntro } from "@/lib/intro-storage";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// ============================================================================
// Canvas Atmospheric Particles (Winter Mountain Dust / Stars)
// ============================================================================
function MountainAtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Subtle restrained particles (frost dust / quiet embers)
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.1, // gently rising
      radius: Math.random() * 1.4 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;

        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 197, 255, ${currentOpacity * 0.6})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-70"
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Interactive Dynamic Motion Graphs (User requested live increase/decrease motions)
// ============================================================================
function InteractiveLiveGraph() {
  const [activeMetric, setActiveMetric] = useState<"consistency" | "sleep" | "volume" | "focus">("consistency");

  // Dynamic animated datasets showing increases/decreases over 7 days
  const DATASETS = {
    consistency: {
      label: "90-Day Arc Compliance",
      sub: "Steady upward trajectory over the 3 core phases",
      current: "94.2%",
      delta: "+18.4%",
      trend: "up",
      points: [62, 68, 74, 71, 85, 89, 94],
      labels: ["Day 10", "Day 25", "Day 40", "Day 55", "Day 70", "Day 80", "Day 90"],
      color: "#2e9bff",
      stroke: "rgba(46, 155, 255, 1)",
      fill: "rgba(46, 155, 255, 0.15)",
    },
    sleep: {
      label: "Sleep & Wake Patterns",
      sub: "Bedtime patterns & wake-up schedule consistency",
      current: "8.2 hrs",
      delta: "+1.4 hrs",
      trend: "up",
      points: [5.8, 6.2, 7.1, 6.9, 7.8, 8.0, 8.2],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      color: "#818cf8",
      stroke: "rgba(129, 140, 248, 1)",
      fill: "rgba(129, 140, 248, 0.15)",
    },
    volume: {
      label: "Workout Volume & Intensity",
      sub: "Progressive overload curve across training blocks",
      current: "24,800 kg",
      delta: "+3,200 kg",
      trend: "up",
      points: [16200, 17800, 19400, 18900, 22100, 23400, 24800],
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
      color: "#34d399",
      stroke: "rgba(52, 211, 153, 1)",
      fill: "rgba(52, 211, 153, 0.15)",
    },
    focus: {
      label: "Distraction Dropoff & Latency",
      sub: "Decreasing screen procrastination time daily",
      current: "38 min",
      delta: "-72 min",
      trend: "down",
      points: [110, 95, 82, 65, 54, 42, 38],
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
      color: "#38bdf8",
      stroke: "rgba(56, 189, 248, 1)",
      fill: "rgba(56, 189, 248, 0.15)",
    },
  };

  const currentData = DATASETS[activeMetric];

  // Compute SVG Path coordinates for SVG chart
  const minVal = Math.min(...currentData.points) * 0.9;
  const maxVal = Math.max(...currentData.points) * 1.05;
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 24;
  const paddingY = 20;

  const points = currentData.points.map((val, idx) => {
    const x = paddingX + (idx / (currentData.points.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - paddingY * 2);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className="w-full rounded-3xl border border-border/80 bg-card/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-accent uppercase">
            Live Pattern Engine
          </span>
          <h3 className="mt-1 text-xl sm:text-2xl font-black text-foreground">
            {currentData.label}
          </h3>
          <p className="text-xs sm:text-sm text-muted">{currentData.sub}</p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border/80 bg-card-2/60 p-1.5">
          {(
            [
              { key: "consistency", label: "Consistency" },
              { key: "sleep", label: "Sleep Recovery" },
              { key: "volume", label: "Volume" },
              { key: "focus", label: "Distraction Drop" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveMetric(tab.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeMetric === tab.key
                  ? "bg-accent text-white shadow-md scale-102"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Line & Increase / Decrease indicator */}
      <div className="mt-6 flex flex-wrap items-baseline gap-4">
        <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          {currentData.current}
        </span>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
            currentData.trend === "up"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-sky-500/15 text-sky-400 border border-sky-500/30"
          }`}
        >
          <span>{currentData.trend === "up" ? "▲" : "▼"}</span>
          <span>{currentData.delta} this arc</span>
        </div>
        <span className="text-xs text-muted ml-auto font-medium hidden sm:inline-block">
          Interactive motion preview · Updates continuously
        </span>
      </div>

      {/* Dynamic Animated SVG Line Graph */}
      <div className="relative mt-6 w-full overflow-hidden rounded-2xl bg-black/40 border border-border/60 p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-36 sm:h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentData.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={currentData.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2={svgWidth} y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2={svgWidth} y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

          {/* Area fill */}
          <path d={areaD} fill={`url(#grad-${activeMetric})`} className="transition-all duration-700 ease-out" />

          {/* Line stroke with subtle animated glow */}
          <path
            d={pathD}
            fill="none"
            stroke={currentData.stroke}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-out filter drop-shadow-[0_0_8px_rgba(46,155,255,0.5)]"
          />

          {/* Data Points / Dots */}
          {points.map((p, i) => (
            <g key={i} className="transition-all duration-700 ease-out">
              <circle cx={p.x} cy={p.y} r="5" fill={currentData.color} />
              <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />
            </g>
          ))}
        </svg>

        {/* X Axis Labels */}
        <div className="mt-2 flex justify-between px-3 text-[10px] sm:text-xs font-mono text-muted">
          {currentData.labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Landing Page Structure
// ============================================================================
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const scrollPos = window.scrollY + 140;

      const sections = ["hero", "problem", "system", "features", "data-arc", "final-cta"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground antialiased selection:bg-accent/25 selection:text-accent font-sans">
      {/* Background Mountain Image & Aurora Backdrop */}
      <div aria-hidden="true" className="app-bg fixed inset-0 pointer-events-none" />
      <MountainAtmosphereCanvas />

      {/* ==================================================================== */}
      {/* SECTION 00: Navigation Bar                                           */}
      {/* ==================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/80 bg-background/85 shadow-[0_4px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "border-b border-transparent bg-background/35 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo brand */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 bg-transparent border-0 p-0 text-left cursor-pointer group"
          >
            <WinterArcLogo className="h-6 w-9 text-accent transition-transform group-hover:scale-105" />
            <div className="flex items-center">
              <span className="text-[19px] font-black tracking-[-0.02em] text-foreground">
                WINTER<span className="text-accent ml-1">ARC</span>
              </span>
            </div>
          </button>

          {/* Minimal Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "hero", label: "Overview" },
              { id: "problem", label: "The Shift" },
              { id: "system", label: "Philosophy" },
              { id: "features", label: "Features" },
              { id: "data-arc", label: "Your Arc" },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-foreground bg-foreground/[0.08] border border-foreground/[0.12]"
                      : "text-muted hover:text-foreground hover:bg-foreground/[0.04] border border-transparent"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 block h-[2px] w-4 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Single Dominant Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => setHasSeenIntro(true)}
              className="hidden sm:inline-flex text-xs font-semibold text-muted hover:text-foreground transition-colors"
            >
              Open Dashboard
            </Link>
            <Link
              href="/intro"
              id="header-start-btn"
              className="flex items-center gap-2 rounded-xl border border-accent/50 bg-gradient-to-r from-accent/25 via-accent/15 to-accent/25 px-5 py-2 text-xs sm:text-sm font-bold text-accent shadow-[0_0_20px_rgba(46,155,255,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(46,155,255,0.45)] hover:border-accent active:translate-y-0"
            >
              <span>START WINTER ARC</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* SECTION 01: Hero Section                                             */}
      {/* ==================================================================== */}
      <section
        id="hero"
        className="relative mx-auto flex min-h-[96svh] max-w-6xl flex-col items-center justify-center px-4 pt-28 pb-16 text-center sm:px-6 sm:pt-36 sm:pb-24"
      >
        {/* Small Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-xs font-mono font-bold tracking-[0.15em] uppercase text-accent shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>Personal Progress System</span>
        </div>

        {/* Primary Single H1 for Search & Users */}
        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] text-foreground">
          Winter Arc Tracker
          <span className="mt-3 block text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-accent via-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            See What You&apos;re Becoming.
          </span>
        </h1>

        {/* Supporting Copy Naturally Explaining the System */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
          A personal progress tracking app designed to help you build consistency over your 90-day arc. Track sleep, wake-up schedule, workouts, meals, daily habits, and long-term trends — completely on-device, private, and free.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/intro"
            id="hero-start-cta"
            className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-10 text-base font-black tracking-wide text-white shadow-[0_0_35px_rgba(46,155,255,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(46,155,255,0.7)] active:translate-y-0"
          >
            <span>START WINTER ARC</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/"
            onClick={() => setHasSeenIntro(true)}
            id="hero-direct-dashboard-btn"
            className="flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border border-border/80 bg-card/70 px-7 text-sm font-bold text-foreground transition duration-200 hover:bg-card hover:border-accent/50 hover:text-accent backdrop-blur active:scale-95"
          >
            <Activity className="h-4 w-4 text-accent" />
            <span>Launch Dashboard Directly</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Local-First & Offline Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Zero Sign-Up Required to Start</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Pure Data · Zero Gimmicks</span>
          </div>
        </div>

        {/* Hero Product Visual (Revealing Real UI cleanly) */}
        <div className="relative mt-14 w-full max-w-5xl overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-2 sm:p-4 shadow-2xl backdrop-blur-2xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/90">
            <Image
              src="/video-assets/real/01_home_initial.webp"
              alt="Winter Arc Live Application Dashboard"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-top transition duration-700 hover:scale-[1.01]"
            />
            {/* Live badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-good animate-ping" />
              Real Application Dashboard
            </div>
            <Link
              href="/intro"
              className="absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/90 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white backdrop-blur shadow-lg transition hover:bg-accent hover:scale-105 active:scale-95"
            >
              Start Exploring <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 02: The Problem (CHAOS → SYSTEM)                             */}
      {/* ==================================================================== */}
      <section id="problem" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 scroll-mt-20">
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
            The Fundamental Shift
          </span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl tracking-tight text-foreground">
            Motivation fades. Data doesn&apos;t.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            You don&apos;t need another streak counter or another burst of motivation. You need a way to see what you&apos;re actually doing.
          </p>
        </div>

        {/* Chaos to System Visual Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Chaos Side */}
          <div className="relative rounded-3xl border border-rose-500/25 bg-rose-950/10 p-7 backdrop-blur-xl">
            <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
              Phase 0: Chaos & Guesswork
            </span>
            <h3 className="mt-3 text-xl font-bold text-foreground">Fragmented & Scattered Habits</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Scattered apps, missed gym sessions, erratic sleep cycles, and zero visual feedback of where energy is lost.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Random Bedtimes", "Uncounted Calories", "Broken Routines", "No Baseline", "Foggy Energy", "Guilt Cycles"].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-mono text-rose-300"
                >
                  ✕ {item}
                </span>
              ))}
            </div>
          </div>

          {/* System Side */}
          <div className="relative rounded-3xl border border-accent/40 bg-accent-soft/20 p-7 backdrop-blur-xl">
            <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase">
              Phase 1: The Winter Arc System
            </span>
            <h3 className="mt-3 text-xl font-bold text-foreground">Single Unified Discipline Engine</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Unified tracking for your entire 90-day protocol. One-tap logging with immediate feedback and phase progression.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Sleep Consistent", "Macro Verified", "Phase Milestones", "Daily Logged", "Peak Recovery", "Identity Formed"].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-mono text-accent font-semibold"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 03: The System (LOG → SEE → UNDERSTAND → IMPROVE)            */}
      {/* ==================================================================== */}
      <section id="system" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 scroll-mt-20">
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
            The Winter Arc Method
          </span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl tracking-tight text-foreground">
            LOG → SEE → UNDERSTAND → IMPROVE
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto">
            A quiet, disciplined cycle that turns subjective feelings into objective data.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "LOG",
              action: "Record what actually happened.",
              desc: "No fluff, no subjective essays. Fast 1-tap logging for sleep, workouts, hydration, and nutrition in seconds.",
            },
            {
              step: "02",
              title: "SEE",
              action: "Turn daily entries into visible data.",
              desc: "Color-coded completion rings, streak counts, and phase progress roadmaps reveal reality without self-deception.",
            },
            {
              step: "03",
              title: "UNDERSTAND",
              action: "Recognize patterns and trends.",
              desc: "Spot circadian drift, fatigue spikes after skipped meals, and consistency correlations over consecutive weeks.",
            },
            {
              step: "04",
              title: "IMPROVE",
              action: "Make better decisions daily.",
              desc: "Lock in non-negotiables, make micro-adjustments, and build the physical baseline that lasts beyond the winter.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/70 p-7 backdrop-blur-xl transition hover:border-accent/40 hover:bg-card"
            >
              <div>
                <span className="text-2xl font-mono font-black text-accent">{item.step}</span>
                <h3 className="mt-4 text-xl font-black text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs font-bold text-accent">{item.action}</p>
                <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 04 & 05: Product Features & Live Graphs                      */}
      {/* ==================================================================== */}
      <section id="features" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 scroll-mt-20">
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
            Built For Reality
          </span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl tracking-tight text-foreground">
            Track Everything That Matters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto">
            Zero fake modules. Real specialized screens engineered around the core pillars of physical discipline.
          </p>
        </div>

        {/* Feature Cards Grid (Using Real Screenshots) */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* SLEEP CARD */}
          <div className="glow-card flex flex-col rounded-3xl border border-border/80 bg-card/75 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden">
              <Image
                src="/video-assets/real/04_sleep.webp"
                alt="Winter Arc Sleep Screen"
                fill
                className="object-cover object-top transition duration-700 hover:scale-104"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-400" />
                <h3 className="text-xl font-black">SLEEP</h3>
              </div>
              <p className="mt-2 text-sm text-muted">
                Track your bedtime and see your sleep patterns. Review average times, sleep duration trends, and schedule consistency.
              </p>
            </div>
          </div>

          {/* WAKE UP CARD */}
          <div className="glow-card flex flex-col rounded-3xl border border-border/80 bg-card/75 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden">
              <Image
                src="/video-assets/real/05_wake_up.webp"
                alt="Winter Arc Wake Up Screen"
                fill
                className="object-cover object-top transition duration-700 hover:scale-104"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-400" />
                <h3 className="text-xl font-black">WAKE UP</h3>
              </div>
              <p className="mt-2 text-sm text-muted">
                Record your wake time and understand consistency. Win the morning window without hitting snooze and capture peak mental clarity.
              </p>
            </div>
          </div>

          {/* FITNESS CARD */}
          <div className="glow-card flex flex-col rounded-3xl border border-border/80 bg-card/75 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden">
              <Image
                src="/video-assets/real/06_fitness.webp"
                alt="Winter Arc Fitness Screen"
                fill
                className="object-cover object-top transition duration-700 hover:scale-104"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-emerald-400" />
                <h3 className="text-xl font-black">FITNESS</h3>
              </div>
              <p className="mt-2 text-sm text-muted">
                Track steps, workouts, weight, push-ups, running, and physical transformations with secure encrypted physique milestones.
              </p>
            </div>
          </div>

          {/* FOOD CARD */}
          <div className="glow-card flex flex-col rounded-3xl border border-border/80 bg-card/75 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden">
              <Image
                src="/video-assets/real/07_food.webp"
                alt="Winter Arc Food Screen"
                fill
                className="object-cover object-top transition duration-700 hover:scale-104"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-400" />
                <h3 className="text-xl font-black">FOOD & NUTRITION</h3>
              </div>
              <p className="mt-2 text-sm text-muted">
                Track meals, calorie budgets, and daily protein targets. Keep nutrition honest to fuel intense performance.
              </p>
            </div>
          </div>
        </div>


        {/* Live Interactive Motion Graph Suite (Requested Increase/Decrease Motions) */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
              See Your Patterns
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black">
              Dynamic Visual Feedback Over Time
            </h3>
          </div>
          <InteractiveLiveGraph />
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 06: "Your Data" Philosophy Section (DATA → PATTERN → ARC)   */}
      {/* ==================================================================== */}
      <section id="data-arc" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 scroll-mt-20">
        <div className="rounded-3xl border border-border/80 bg-card/60 p-8 sm:p-14 backdrop-blur-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
              Grounded Philosophy
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-foreground">
              Your data. Your patterns. Your arc.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
              Winter Arc is designed around your own verified inputs. No pseudo-scientific AI predictions, no exaggerated medical claims, and no fake promises. Just an honest mirror of your daily discipline.
            </p>
          </div>

          {/* Visual Arc Metaphor: DATA → PATTERN → ARC */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-border/60 pt-8">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-muted uppercase">Stage 01</span>
              <h4 className="mt-1 text-lg font-bold text-foreground">DATA</h4>
              <p className="mt-2 text-xs text-muted">
                Individual raw inputs: hours slept, liters drank, workout completed.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-mono text-muted uppercase">Stage 02</span>
              <h4 className="mt-1 text-lg font-bold text-foreground">PATTERN</h4>
              <p className="mt-2 text-xs text-muted">
                Points connecting into curves: weekly trends, recovery correlations, and momentum.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-mono text-muted uppercase">Stage 03</span>
              <h4 className="mt-1 text-lg font-bold text-accent">ARC</h4>
              <p className="mt-2 text-xs text-muted">
                The 90-day transformation: disciplined identity that echoes the strength of the mountains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 07: Final CTA                                                */}
      {/* ==================================================================== */}
      <section id="final-cta" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-br from-card via-card-2 to-card p-10 sm:p-16 shadow-2xl backdrop-blur-2xl">
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-accent/20 blur-3xl pointer-events-none"
          />

          <WinterArcLogo className="mx-auto h-12 w-16 text-accent" />
          <h2 className="mt-6 text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            START SEEING YOURSELF.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base sm:text-lg text-muted">
            Your progress is already happening. Start tracking it.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/intro"
              id="footer-start-cta"
              className="flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-10 text-base font-black text-white shadow-[0_0_35px_rgba(46,155,255,0.45)] transition duration-200 hover:scale-105 active:scale-95"
            >
              <span>START WINTER ARC</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              onClick={() => setHasSeenIntro(true)}
              className="flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border border-border/80 bg-card/70 px-7 text-sm font-bold text-foreground hover:bg-card hover:border-accent/50 transition backdrop-blur active:scale-95"
            >
              <Activity className="h-4 w-4 text-accent" />
              <span>Enter Dashboard</span>
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted">
            Free guest access · Instant interactive dashboard · No barriers
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background/90 py-8 text-center text-xs text-muted">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p>© {new Date().getFullYear()} Winter Arc Protocol. Discipline Builds Freedom.</p>
            <LiveUserCount />
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/intro" className="font-semibold text-accent hover:underline">
              Enter Winter Arc
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
