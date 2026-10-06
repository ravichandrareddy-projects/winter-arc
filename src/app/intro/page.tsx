"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Moon,
  Dumbbell,
  Utensils,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Play,
  Award,
  ChevronRight,
  Sun,
  Droplets,
  Layers,
  Smartphone,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { requireAuth } from "@/lib/auth-guard";

function markSeen(): void {
  try {
    window.localStorage.setItem("wa-seen-intro", "1");
  } catch {
    /* ignore */
  }
}

const FEATURES = [
  {
    icon: Flame,
    title: "90-Day Arc Blueprint",
    tag: "Protocol",
    desc: "A systematic transformation framework divided into Foundation, Momentum, and Mastery phases. Track consistency percentage, current streak, and daily compliance effortlessly.",
    img: "/video-assets/real/01_home_initial.png",
    stat: "90 Days",
    statLabel: "Total Duration",
  },
  {
    icon: Moon,
    title: "Sleep & Circadian Rhythm",
    tag: "Recovery",
    desc: "Smart sleep latency, wake consistency, deep sleep tracking, and custom sleep target optimization to make sure your discipline matches high physical recovery.",
    img: "/video-assets/real/04_sleep.png",
    stat: "8.5 hrs",
    statLabel: "Target Window",
  },
  {
    icon: Dumbbell,
    title: "Fitness & Strength Logs",
    tag: "Training",
    desc: "Track progressive overload, workout sessions, volume targets, and routine split compliance with clean visual metrics and zero clutter.",
    img: "/video-assets/real/06_fitness.png",
    stat: "100%",
    statLabel: "Volume Logged",
  },
  {
    icon: Utensils,
    title: "Nutrition & Macro Balance",
    tag: "Fuel",
    desc: "Log daily calories, protein, hydration, and meal timings. Fuel your body with clarity instead of guesswork.",
    img: "/video-assets/real/07_food.png",
    stat: "160g",
    statLabel: "Protein Target",
  },
  {
    icon: TrendingUp,
    title: "Visual Progress & Analytics",
    tag: "Insights",
    desc: "Interactive radar charts, heatmaps, streak milestones, and weekly comparison cards reveal your actual behavioral trends over time.",
    img: "/video-assets/real/08_progress.png",
    stat: "+34%",
    statLabel: "Consistency Delta",
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
    q: "What is the Winter Arc protocol?",
    a: "The Winter Arc is a dedicated 90-day seasonal sprint where you eliminate distractions, lock into non-negotiable daily routines (sleep, nutrition, training, deep work), and build identity-level discipline before the new year arrives.",
  },
  {
    q: "Do I need to pay or create an account immediately?",
    a: "No. You can tap 'Start Winter Arc Challenge' right now and test all interactive trackers in demo mode immediately. Sign in with Supabase only when you're ready to backup your personal journey across devices.",
  },
  {
    q: "Can I customize my goals and habits?",
    a: "Yes. Every tracker supports customized daily targets, step increments, frequency schedules, and personalized notification reminders.",
  },
  {
    q: "Is it mobile friendly?",
    a: "Completely. It is engineered with modern responsive touch interactions and functions as an installable Progressive Web App (PWA).",
  },
];

export default function IntroLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground antialiased selection:bg-accent/25 selection:text-accent">
      {/* Background backdrop with atmospheric gradient */}
      <div aria-hidden="true" className="app-bg fixed inset-0 pointer-events-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/intro" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <WinterArcLogo className="h-7 w-10 text-accent" />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-wider leading-none">
                WINTER <span className="text-accent">ARC</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-muted">DISCIPLINE PROTOCOL</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                markSeen();
                requireAuth({ route: "/", label: "Sign in" });
              }}
              className="hidden sm:inline-flex rounded-full border border-border/80 bg-card/60 px-4 py-2 text-xs font-semibold text-muted transition hover:bg-card hover:text-foreground"
            >
              Sign In
            </button>
            <Link
              href="/"
              onClick={markSeen}
              id="header-start-btn"
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[0_0_24px_rgba(46,155,255,0.4)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(46,155,255,0.6)] active:scale-95"
            >
              Start Tracker <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-1.5 text-xs font-semibold text-accent shadow-sm backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>The Official 90-Day Transformation Challenge</span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl md:text-7xl lg:leading-[1.1]">
          Stop Wishing. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-accent via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Lock In Your Winter Arc.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
          A high-performance discipline tracker built for those who refuse to wait for New Year resolutions. Log sleep, fitness, nutrition, and daily non-negotiables in one seamless interface.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            onClick={markSeen}
            id="hero-start-cta"
            className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-accent px-9 text-base font-extrabold text-white shadow-[0_0_35px_rgba(46,155,255,0.45)] transition duration-200 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(46,155,255,0.7)] active:scale-95"
          >
            Start Winter Arc Challenge
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            id="hero-watch-story-btn"
            className="flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-border bg-card/70 px-7 text-sm font-bold text-foreground backdrop-blur transition hover:bg-card hover:border-accent/40"
          >
            <Play className="h-4 w-4 fill-accent text-accent" />
            Watch Challenge Video
          </button>
        </div>

        {/* Trust Points */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>100% Free Demo Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Zero Sign-Up Required to Start</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-good" />
            <span>Installable Offline PWA</span>
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
              className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-accent/90 px-4 py-2 text-xs font-extrabold text-white backdrop-blur shadow-lg transition hover:bg-accent"
            >
              Open Interactive View <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Tab Section */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <span className="text-xs font-black tracking-[0.25em] text-accent uppercase">Engineered For Consistency</span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Every Aspect of Your Routine. Covered.</h2>
          <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto">
            Switch between purpose-built modules designed to remove decision fatigue and keep you locked in for 90 consecutive days.
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
                className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
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

            {/* Stat Pill */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border/60 bg-card-2/50 p-4">
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
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs sm:text-sm font-bold text-background transition hover:opacity-90"
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
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
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
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <span className="text-xs font-black tracking-[0.25em] text-accent uppercase">FAQ</span>
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

      {/* Bottom Sticky-Feeling High Converting Final Call-to-Action */}
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
              className="flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-accent px-10 text-base font-extrabold text-white shadow-[0_0_30px_rgba(46,155,255,0.5)] transition duration-200 hover:scale-105 active:scale-95"
            >
              Start Winter Arc Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted">
            No credit card needed · Zero barrier to entry · Immediate dashboard access
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background/90 py-8 text-center text-xs text-muted">
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

      {/* Video Modal */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card p-2 sm:p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Winter Arc Challenge Story
              </span>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="rounded-full bg-card-2 p-1.5 text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <video
              className="aspect-video w-full rounded-2xl bg-black object-cover"
              controls
              autoPlay
              playsInline
              preload="auto"
              poster="/video-assets/winter-arc-ad-poster.png"
            >
              <source src="/winter-arc-ad.mp4" type="video/mp4" />
              <track kind="captions" srcLang="en" label="English" src="/video-assets/captions.vtt" default />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
