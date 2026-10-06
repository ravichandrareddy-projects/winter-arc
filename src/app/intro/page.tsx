"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Moon,
  Sun,
  Dumbbell,
  Utensils,
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
  ExternalLink,
  Sliders,
  Award,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { requireAuth } from "@/lib/auth-guard";
import { useTheme } from "@/lib/theme-provider";

function markSeen(): void {
  try {
    window.localStorage.setItem("wa-seen-intro", "1");
  } catch {
    /* ignore */
  }
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Particle Canvas Background modeled after SDES
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.5 + 0.6,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity * 0.45})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-60"
    />
  );
}

const NAV_LINKS = [
  { id: "hero", label: "Home" },
  { id: "how-it-works", label: "How To Use" },
  { id: "modules", label: "Modules" },
  { id: "pillars", label: "Pillars" },
  { id: "faq", label: "FAQ" },
];

const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    badge: "Step 1: Set Your Goals",
    title: "Pick Your Non-Negotiables",
    action: "Tap '+' on any tracker to customize targets",
    desc: "Define what matters for the next 90 days: Water (liters), Sleep (hours), Workouts (splits), or Reading (pages). Don't overcomplicate — choose 4 to 6 core habits that transform you.",
    icon: ListTodo,
    tip: "Tip: Start with Sleep + Hydration as your base foundation.",
  },
  {
    num: "02",
    badge: "Step 2: Log Daily",
    title: "1-Tap Quick Increments",
    action: "Tap '+' buttons on your cards throughout the day",
    desc: "No endless forms or laggy menus. Completed 500ml water? Tap +0.5L. Finished a workout? Tap the checkmark. Done in under 5 seconds so logging never breaks your flow.",
    icon: MousePointerClick,
    tip: "Tip: Real-time visual rings show instant feedback as you hit 100%.",
  },
  {
    num: "03",
    badge: "Step 3: Review & Lock In",
    title: "Track Phase Streaks & Sync",
    action: "Watch your 90-day phase roadmap light up",
    desc: "Check your progress chart at night. Move through Foundation (Days 1–30), Momentum (Days 31–60), and Mastery (Days 61–90). Connect with Supabase to save your streak across all devices.",
    icon: Flame,
    tip: "Tip: Never break two days in a row to protect your streak.",
  },
];

const FEATURES = [
  {
    icon: Flame,
    title: "90-Day Arc Blueprint",
    tag: "Protocol",
    desc: "A systematic transformation framework divided into Foundation, Momentum, and Mastery phases. Track consistency percentage, current streak, and daily compliance effortlessly.",
    img: "/video-assets/real/01_home_initial.png",
    stat: "90 Days",
    statLabel: "Total Duration",
    userAction: "Select your active date on the top date-strip, see active streaks, and hit your daily targets.",
  },
  {
    icon: Moon,
    title: "Sleep & Circadian Rhythm",
    tag: "Recovery",
    desc: "Smart sleep latency, wake consistency, deep sleep tracking, and custom sleep target optimization to make sure your discipline matches high physical recovery.",
    img: "/video-assets/real/04_sleep.png",
    stat: "8.5 hrs",
    statLabel: "Target Window",
    userAction: "Log bedtime and wake times to compute recovery scores and lock in consistent sunrise schedules.",
  },
  {
    icon: Dumbbell,
    title: "Fitness & Strength Logs",
    tag: "Training",
    desc: "Track progressive overload, workout sessions, volume targets, and routine split compliance with clean visual metrics and zero clutter.",
    img: "/video-assets/real/06_fitness.png",
    stat: "100%",
    statLabel: "Volume Logged",
    userAction: "Check off your daily lifts, track your sets, and log physique photos securely over 90 days.",
  },
  {
    icon: Utensils,
    title: "Nutrition & Macro Balance",
    tag: "Fuel",
    desc: "Log daily calories, protein, hydration, and meal timings. Fuel your body with clarity instead of guesswork.",
    img: "/video-assets/real/07_food.png",
    stat: "160g",
    statLabel: "Protein Target",
    userAction: "Enter breakfast, lunch, and dinner to stay in your caloric deficit or surplus targets.",
  },
  {
    icon: TrendingUp,
    title: "Visual Progress & Analytics",
    tag: "Insights",
    desc: "Interactive radar charts, heatmaps, streak milestones, and weekly comparison cards reveal your actual behavioral trends over time.",
    img: "/video-assets/real/08_progress.png",
    stat: "+34%",
    statLabel: "Consistency Delta",
    userAction: "Visit /progress anytime to see your consistency graphs and celebrate streak achievements.",
  },
];

const PILLARS = [
  {
    icon: Droplets,
    label: "Hydration & Routine",
    sub: "Never miss daily fundamentals with quick single-tap increments.",
  },
  {
    icon: Sun,
    label: "Wake Up Discipline",
    sub: "Fixed sunrise circadian lock-in to capture peak mental clarity.",
  },
  {
    icon: Shield,
    label: "Privacy & Cloud Sync",
    sub: "Local-first speed with end-to-end Supabase encryption backup.",
  },
  {
    icon: Smartphone,
    label: "Native PWA Experience",
    sub: "Installable directly to iOS & Android homescreens with offline capability.",
  },
];

const FAQS = [
  {
    q: "How do I use this website?",
    a: "Click 'Start Winter Arc Tracker' above. You will land directly on the live dashboard. Tap '+' to increment habits like water, sleep, or workouts. You can also customize your goals, adjust targets, or add custom trackers from the Settings tab.",
  },
  {
    q: "Do I have to sign up before using it?",
    a: "No! The tracker opens instantly in full interactive guest mode. All your logs are stored locally on your device. When you want to sync across mobile and desktop, just sign in with Google or Email.",
  },
  {
    q: "What is the 90-day Winter Arc challenge?",
    a: "It's an intense 90-day focus protocol (October through January) to isolate yourself from distractions, lock down healthy physical and mental disciplines, and emerge completely transformed before the new year.",
  },
  {
    q: "Can I install it like an app on my phone?",
    a: "Yes! Open this page on Safari (iOS) or Chrome (Android) and tap 'Add to Home Screen'. It runs full-screen like a native mobile app even when offline.",
  },
];

export default function IntroLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeFeature, setActiveFeature] = useState(0);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted ? (theme === "system" ? resolvedTheme === "dark" : theme === "dark") : true;

  // Track scroll position for header blur and active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
      const scrollPos = window.scrollY + 140;

      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const id = NAV_LINKS[i].id;
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

  const toggleThemeMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground antialiased selection:bg-accent/25 selection:text-accent font-sans">
      {/* Background backdrop & interactive particles */}
      <div aria-hidden="true" className="app-bg fixed inset-0 pointer-events-none" />
      <ParticleCanvas />

      {/* SDES-Style Fixed Precision Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] dark:border-white/[0.08] bg-background/80 shadow-[0_4px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo brand (Outfit font weight 900 feel) */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 bg-transparent border-0 p-0 text-left cursor-pointer group"
          >
            <WinterArcLogo className="h-6 w-9 text-accent transition-transform group-hover:scale-105" />
            <div className="flex items-center">
              <span className="text-[19px] font-black tracking-[-0.02em] text-foreground">
                WINTER<span className="text-accent ml-1">ARC</span>
              </span>
              <span className="ml-2 hidden lg:inline-flex rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-accent">
                V3
              </span>
            </div>
          </button>

          {/* Center Navigation Links with Glowing Indicator Pill */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-foreground bg-foreground/[0.08] border border-foreground/[0.12]"
                      : "text-muted hover:text-foreground hover:bg-foreground/[0.04] border border-transparent"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 block h-[2px] w-4 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Suite (Theme Toggle + Sign In + Glowing Action CTA) */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button (SDES 38px rounded square) */}
            <button
              onClick={toggleThemeMode}
              title={isDark ? "Light Mode" : "Dark Mode"}
              aria-label="Toggle dark/light mode"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted transition hover:bg-card hover:text-foreground hover:border-accent/40"
            >
              {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Sign in Trigger */}
            <button
              onClick={() => {
                markSeen();
                requireAuth({ route: "/", label: "Sign in" });
              }}
              className="hidden sm:inline-flex rounded-xl border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-card hover:text-foreground"
            >
              Sign In
            </button>

            {/* Glowing Primary CTA Button (SDES Styled: gradient background + glowing border) */}
            <Link
              href="/"
              onClick={markSeen}
              id="header-start-btn"
              className="flex items-center gap-2 rounded-xl border border-accent/50 bg-gradient-to-r from-accent/25 via-accent/15 to-accent/25 px-4 py-1.5 text-xs sm:text-sm font-bold text-accent shadow-[0_0_20px_rgba(46,155,255,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(46,155,255,0.45)] hover:border-accent active:translate-y-0"
            >
              <span>Start Tracker</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative mx-auto flex min-h-[92svh] max-w-5xl flex-col items-center justify-center px-4 pt-28 pb-16 text-center sm:px-6 sm:pt-36 sm:pb-20"
      >
        {/* SDES-like Ecosystem Showcase Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-xs font-mono font-bold tracking-[0.12em] uppercase text-accent shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>Winter Arc 90-Day Discipline Protocol</span>
        </div>

        {/* Big Impact Headline */}
        <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.03em] sm:text-6xl md:text-7xl leading-[1.1] text-foreground">
          Stop Wishing. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-accent via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Lock In Your Winter Arc.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
          A strict discipline tracking engine engineered to eliminate distractions, enforce active daily routines (sleep, nutrition, training), and build unshakeable focus before the new year arrives.
        </p>

        {/* Primary Call To Action Suite */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            onClick={markSeen}
            id="hero-start-cta"
            className="group flex h-13 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-9 text-sm sm:text-base font-extrabold text-white shadow-[0_0_35px_rgba(46,155,255,0.4)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(46,155,255,0.65)] active:translate-y-0"
          >
            <span>Start Winter Arc Tracker</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
            className="flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-border bg-card/70 px-7 text-xs sm:text-sm font-bold text-foreground backdrop-blur transition hover:bg-card hover:border-accent/40"
          >
            How To Use This App <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Trust Points */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>100% Free Instant Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Zero Sign-Up Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Works Offline (Installable PWA)</span>
          </div>
        </div>

        {/* Hero Interactive App Preview */}
        <div className="relative mt-14 w-full max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-2 sm:p-4 shadow-2xl backdrop-blur-2xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/90">
            <Image
              src="/video-assets/real/01_home_initial.png"
              alt="Winter Arc Tracker Preview"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover object-top transition duration-700 hover:scale-[1.02]"
            />
            {/* Interactive Overlay badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-good animate-ping" />
              Live Winter Arc Dashboard
            </div>
            <Link
              href="/"
              onClick={markSeen}
              className="absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/90 px-4 py-2 text-xs sm:text-sm font-extrabold text-white backdrop-blur shadow-lg transition hover:bg-accent hover:scale-105 active:scale-95"
            >
              Open Live Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW TO USE / STEP BY STEP USER GUIDE SECTION */}
      <section id="how-it-works" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 scroll-mt-20">
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">User Guide</span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl tracking-tight">How To Use The Tracker</h2>
          <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto">
            Everything is designed for speed. You won't spend 15 minutes logging; each habit takes 2 seconds so you can get back to executing.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/70 p-7 shadow-lg backdrop-blur-xl transition hover:border-accent/40 hover:bg-card"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-sm font-mono font-black text-accent">
                      {item.num}
                    </span>
                    <span className="rounded-full border border-border bg-card-2/60 px-3 py-1 text-[11px] font-bold text-muted">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-foreground">{item.title}</h3>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent-soft/70 px-2.5 py-1 text-xs font-semibold text-accent">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.action}</span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4">
                  <p className="text-xs font-semibold text-foreground/80">{item.tip}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual action prompt */}
        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/"
            onClick={markSeen}
            className="flex items-center gap-2 rounded-2xl bg-foreground px-8 py-3.5 text-xs sm:text-sm font-bold text-background transition hover:opacity-90"
          >
            Ready? Open Tracker & Try Step 1 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feature Showcase Tab Section */}
      <section id="modules" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 scroll-mt-20">
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">Everything Inside</span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl tracking-tight">Explore The 5 Core Modules</h2>
          <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto">
            Click through each module below to preview what you'll be tracking every day.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            const isActive = activeFeature === idx;
            return (
              <button
                key={feat.title}
                type="button"
                onClick={() => setActiveFeature(idx)}
                className={`flex items-center gap-2.5 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-accent text-white shadow-[0_0_25px_rgba(46,155,255,0.4)] scale-105"
                    : "border border-border/80 bg-card/60 text-muted hover:bg-card hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{feat.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Display Card */}
        <div className="mt-8 grid grid-cols-1 items-center gap-8 rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-10 shadow-xl backdrop-blur-xl lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-5">
            <span className="inline-block w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold text-accent">
              {FEATURES[activeFeature].tag}
            </span>
            <h3 className="mt-4 text-2xl font-black sm:text-3xl text-foreground">
              {FEATURES[activeFeature].title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {FEATURES[activeFeature].desc}
            </p>

            {/* How to use this specific module */}
            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent-soft/40 p-3.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent">How You Use It:</span>
              <p className="mt-1 text-xs font-medium text-foreground/90">{FEATURES[activeFeature].userAction}</p>
            </div>

            {/* Stat Pill */}
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border/60 bg-card-2/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-foreground">{FEATURES[activeFeature].stat}</p>
                <p className="text-xs font-semibold text-muted">{FEATURES[activeFeature].statLabel}</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                onClick={markSeen}
                className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-xs sm:text-sm font-bold text-background transition hover:opacity-90"
              >
                Try this module now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-black/80 lg:col-span-7">
            <Image
              src={FEATURES[activeFeature].img}
              alt={FEATURES[activeFeature].title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-top transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section id="pillars" className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 scroll-mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">Core Pillars</span>
          <h2 className="mt-2 text-2xl font-black sm:text-4xl">Engineered for Relentless Focus</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="group relative flex flex-col rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur transition hover:border-accent/40 hover:bg-card hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-5 text-base font-extrabold text-foreground">{p.label}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">{p.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 scroll-mt-20">
        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">FAQ</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="mt-10 space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur transition hover:bg-card"
            >
              <h3 className="text-base font-bold text-foreground">{faq.q}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Final Call-to-Action */}
      <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-br from-card via-card-2 to-card p-8 sm:p-14 text-center shadow-2xl backdrop-blur-2xl">
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-accent/20 blur-3xl pointer-events-none"
          />

          <WinterArcLogo className="mx-auto h-12 w-16 text-accent" />
          <h2 className="mt-6 text-3xl font-black sm:text-5xl text-foreground">
            Your 90-Day Arc Starts Today.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-muted">
            The clock is ticking. You can either stay comfortable, or commit to the discipline that builds lasting freedom.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              onClick={markSeen}
              id="footer-start-cta"
              className="flex h-13 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-10 text-base font-extrabold text-white shadow-[0_0_30px_rgba(46,155,255,0.5)] transition duration-200 hover:scale-105 active:scale-95"
            >
              Start Winter Arc Tracker <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted">
            No credit card needed · Zero barrier to entry · Immediate dashboard access
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="site-footer" className="border-t border-border/60 bg-background/90 py-8 text-center text-xs text-muted">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 gap-4">
          <p>© {new Date().getFullYear()} Winter Arc Protocol. Discipline Builds Freedom.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/" onClick={markSeen} className="font-semibold text-accent hover:underline">
              Open Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
