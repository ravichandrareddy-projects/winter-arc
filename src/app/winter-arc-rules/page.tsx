import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  HelpCircle,
  Lightbulb,
  Moon,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { AppFooter } from "@/components/AppFooter";

const CANONICAL_URL = "https://winterarc.indevs.in/winter-arc-rules";

export const metadata: Metadata = {
  title: "Winter Arc Rules & Principles — DO's, DON'Ts & Tracking System",
  description:
    "Explore the essential rules and principles for a sustainable Winter Arc. Learn how to choose custom dates, set measurable goals, avoid burnout, and track real progress.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "Winter Arc Rules & Principles — DO's, DON'Ts & Tracking System",
    description:
      "Explore the essential rules and principles for a sustainable Winter Arc. Learn how to choose custom dates, set measurable goals, avoid burnout, and track real progress.",
    url: CANONICAL_URL,
    siteName: "Winter Arc Tracker",
    type: "article",
    images: [
      {
        url: "https://winterarc.indevs.in/logo-512.png",
        width: 512,
        height: 512,
        alt: "Winter Arc Rules and Instructions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winter Arc Rules & Principles — DO's, DON'Ts & Tracking System",
    description:
      "Explore the essential rules and principles for a sustainable Winter Arc. Learn how to choose custom dates, set measurable goals, and avoid burnout.",
    images: ["https://winterarc.indevs.in/logo-512.png"],
  },
};

const RULES = [
  {
    num: "01",
    title: "Choose Your Arc Period",
    headline: "Custom timeline — not an inflexible universal calendar",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          The popular convention for a Winter Arc spans the final stretch of the year, commonly starting on{" "}
          <strong className="text-foreground">October 1 and concluding on January 1</strong>. However, there is no central
          bureaucracy mandating exact dates.
        </p>
        <p className="mt-3 text-muted leading-relaxed">
          You can start October 1, launch mid-November, or define an entirely customized 60, 90, or 100-day window that
          matches your actual work rhythm or school term. What matters is a defined start and finish, not an arbitrary calendar dogma.
        </p>
      </>
    ),
    badge: "Flexible Dates",
  },
  {
    num: "02",
    title: "Choose Your Own Goals",
    headline: "Focus on 3 to 6 high-leverage habits instead of an exhaustive 20-item checklist",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          A Winter Arc is self-authored. Do not copy someone else’s massive daily spreadsheet. Pick a small handful of
          commitments across four core pillars:
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-lg border border-border/70 bg-card/60 p-2.5">
            <span className="font-semibold text-accent">BODY</span>
            <ul className="mt-1 space-y-0.5 text-muted">
              <li>• Strength training</li>
              <li>• Daily step target</li>
              <li>• Running & mobility</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-2.5">
            <span className="font-semibold text-accent">HEALTH</span>
            <ul className="mt-1 space-y-0.5 text-muted">
              <li>• Consistent sleep window</li>
              <li>• Hydration target</li>
              <li>• Daily protein goal</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-2.5">
            <span className="font-semibold text-accent">MIND</span>
            <ul className="mt-1 space-y-0.5 text-muted">
              <li>• Reading 10–20 pages</li>
              <li>• Deliberate study</li>
              <li>• Daily journaling</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/60 p-2.5">
            <span className="font-semibold text-accent">FOCUS</span>
            <ul className="mt-1 space-y-0.5 text-muted">
              <li>• 90m deep work block</li>
              <li>• Screen time limits</li>
              <li>• Morning daily planning</li>
            </ul>
          </div>
        </div>
      </>
    ),
    badge: "Personal Sovereignty",
  },
  {
    num: "03",
    title: "Make Goals Measurable",
    headline: "Ambiguity breeds procrastination — define the finish line with numbers",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          A goal cannot be accurately tracked if it does not have a binary definition of completion. Convert every wish into a quantifiable metric:
        </p>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-2">
            <span className="text-red-400">✕ &ldquo;Get healthier&rdquo;</span>
            <span className="font-semibold text-emerald-400">✓ &ldquo;Walk 8,000 steps every day&rdquo;</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-2">
            <span className="text-red-400">✕ &ldquo;Study more&rdquo;</span>
            <span className="font-semibold text-emerald-400">✓ &ldquo;Study for 60 focused minutes&rdquo;</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-2">
            <span className="text-red-400">✕ &ldquo;Sleep better&rdquo;</span>
            <span className="font-semibold text-emerald-400">✓ &ldquo;In bed by 11:00 PM without screens&rdquo;</span>
          </div>
        </div>
      </>
    ),
    badge: "Quantified Targets",
  },
  {
    num: "04",
    title: "Track What Actually Happened",
    headline: "Record reality with zero distortion — no vanity padding",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          A tracker is an instrument of self-honesty, not social media performance. Record the exact numbers: what was completed,
          what was missed, real workout times, and actual calories.
        </p>
        <p className="mt-2 text-muted leading-relaxed">
          Fabricating a green checkmark gives a temporary dopamine hit but robs you of the objective feedback needed to adjust your lifestyle.
        </p>
      </>
    ),
    badge: "Honest Metrics",
  },
  {
    num: "05",
    title: "Review Your Data Across 3 Horizons",
    headline: "Logging without reflection is just administrative overhead",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          A successful protocol separates immediate action from strategic evaluation:
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
          <div className="rounded-lg border border-border/80 bg-card/60 p-3">
            <div className="font-bold text-sky-400">DAILY HORIZON</div>
            <p className="mt-1 text-muted">Log values with minimal friction (2 minutes total across morning and evening).</p>
          </div>
          <div className="rounded-lg border border-border/80 bg-card/60 p-3">
            <div className="font-bold text-sky-400">WEEKLY HORIZON</div>
            <p className="mt-1 text-muted">Review 7-day consistency %, detect drop-off days (e.g., Fridays), and plan recovery.</p>
          </div>
          <div className="rounded-lg border border-border/80 bg-card/60 p-3">
            <div className="font-bold text-sky-400">LONG TERM HORIZON</div>
            <p className="mt-1 text-muted">Examine 30-to-90 day trends: body weight trajectory, resting heart rate, and study accumulation.</p>
          </div>
        </div>
      </>
    ),
    badge: "Structured Review",
  },
  {
    num: "06",
    title: "Consistency Over Extremes",
    headline: "Discipline does not require self-destruction",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          The internet often glorifies dangerous routines: 4:00 AM wakeups on 4 hours of sleep, extreme crash dieting, or two-a-day heavy lifting
          every single day.
        </p>
        <p className="mt-2 text-muted leading-relaxed">
          This leads directly to immune breakdown, injury, and quitting by week three. True discipline is maintaining a reasonable, challenging
          baseline for 90 days straight through dark, cold winter mornings.
        </p>
      </>
    ),
    badge: "Sustainability",
  },
  {
    num: "07",
    title: "Missed Days Are Data, Not Failure",
    headline: "Never reset your arc to Day 1 because of a single slip",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          Many people abandon challenges because they believe a broken streak invalidates all previous effort. That is toxic all-or-nothing thinking.
        </p>
        <div className="my-3 flex items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent/10 py-2 font-mono text-xs font-bold text-accent">
          <span>MISS</span>
          <span>→</span>
          <span>RECORD</span>
          <span>→</span>
          <span>LEARN</span>
          <span>→</span>
          <span>CONTINUE</span>
        </div>
        <p className="text-muted leading-relaxed">
          Log the miss, identify the friction trigger (e.g., staying up too late, unexpected work travel), adjust tomorrow’s setup, and keep going.
        </p>
      </>
    ),
    badge: "Resilience",
  },
  {
    num: "08",
    title: "Personalize the Arc to Your Reality",
    headline: "Match habits to your season of life, not someone else's viral video",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          A parent with two young kids, a university student studying for winter finals, and a software engineer working full-time have vastly different
          schedules, energy reserves, and recovery profiles.
        </p>
        <p className="mt-2 text-muted leading-relaxed">
          Design your Winter Arc around your actual responsibilities. An arc that fits your life 85% of the time will always outperform a brutal fantasy routine that collapses on day four.
        </p>
      </>
    ),
    badge: "Custom Context",
  },
  {
    num: "09",
    title: "Rest and Recovery Are Non-Negotiable",
    headline: "Muscles grow and focus renews when you rest, not when you push beyond exhaustion",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          Building high consistency requires honoring sleep hygiene, active recovery sessions (walking, light stretching), and planned rest days
          between heavy lifts.
        </p>
        <p className="mt-2 text-muted leading-relaxed">
          If you feel illness coming on or severe chronic fatigue, adjust your target downward for 48 hours rather than forcing an unsafe workout.
        </p>
      </>
    ),
    badge: "Active Recovery",
  },
  {
    num: "10",
    title: "Track Multi-Dimensional Progress",
    headline: "Success is more than the bathroom scale or a social media physique check",
    body: (
      <>
        <p className="text-muted leading-relaxed">
          Your transformation should be judged across multiple dimensions:
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-4">
          <li className="rounded border border-border/70 bg-card/40 p-2">
            <span className="font-semibold text-foreground">Sleep Consistency:</span> Waking at the same hour each day.
          </li>
          <li className="rounded border border-border/70 bg-card/40 p-2">
            <span className="font-semibold text-foreground">Cognitive Depth:</span> Completing 30 hours of quiet, focused study.
          </li>
          <li className="rounded border border-border/70 bg-card/40 p-2">
            <span className="font-semibold text-foreground">Physical Strength:</span> Added 5 push-ups or cut 30s from a 5K time.
          </li>
          <li className="rounded border border-border/70 bg-card/40 p-2">
            <span className="font-semibold text-foreground">Mental Calm:</span> Ending the year with confidence and momentum.
          </li>
        </ul>
      </>
    ),
    badge: "Holistic Growth",
  },
];

const DOS = [
  "Choose a small, meaningful set of commitments (3–6 goals)",
  "Make every target binary, measurable, and specific",
  "Track with unflinching honesty — even on difficult days",
  "Review weekly consistency rates and trend graphs",
  "Focus on gradual, sustainable habit adaptation",
  "Prioritize 7–9 hours of quality sleep and recovery",
  "Continue immediately after a missed habit instead of resetting",
  "Compare your today only with your own past performance",
];

const DONTS = [
  "Don't overwhelm yourself with an impossible 20-item checklist",
  "Don't chase flawless perfection or panic over a single slip",
  "Don't copy an influencer's extreme routine without testing suitability",
  "Don't sacrifice sleep to wake up at 4:00 AM just for aesthetic videos",
  "Don't crash diet, dehydrate, or employ unsafe weight loss schemes",
  "Don't overtrain to the point of joint pain or chronic exhaustion",
  "Don't treat one missed day as a reason to abandon the entire challenge",
  "Don't fabricate checkmarks just to make your chart look impressive",
  "Don't compare your behind-the-scenes effort to someone else's highlight reel",
];

const APP_FEATURES = [
  {
    name: "Home Dashboard",
    href: "/",
    desc: "Daily goals checklist, quick log cards, active metrics, and today’s consistency percentage at a glance.",
  },
  {
    name: "Sleep Tracking",
    href: "/sleep",
    desc: "Bedtime, wake time, total sleep duration, and 7-day sleep consistency tracking.",
  },
  {
    name: "Wake Up Schedule",
    href: "/wake-up",
    desc: "Wake-up time consistency, circadian alignment, and morning routine streak indicators.",
  },
  {
    name: "Fitness & Workouts",
    href: "/fitness",
    desc: "Daily steps, strength training sessions, running distance, push-up counts, and body weight logs.",
  },
  {
    name: "Transformation Photos",
    href: "/fitness/photos",
    desc: "Private before, milestone, and current photo comparisons stored locally in your browser storage.",
  },
  {
    name: "Food & Macros",
    href: "/food",
    desc: "Log daily meals, calories, protein, carbs, fats, and fiber to ensure proper athletic recovery.",
  },
  {
    name: "90-Day Progress Trends",
    href: "/progress",
    desc: "Full protocol analytics, completion rates, category-by-category charts, and historical heatmaps.",
  },
  {
    name: "Settings & Customization",
    href: "/settings",
    desc: "Configure custom targets, set custom start/end dates, toggle dark mode, and export/import backup data.",
  },
];

export default function WinterArcRulesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Winter Arc Rules & Principles — DO's, DON'Ts & Tracking System",
    description:
      "A comprehensive, realistic guide to Winter Arc rules and principles. Learn how to set measurable goals, choose custom dates, avoid burnout, and track consistency.",
    author: {
      "@type": "Organization",
      name: "Winter Arc Tracker",
      url: "https://winterarc.indevs.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Winter Arc Tracker",
      logo: {
        "@type": "ImageObject",
        url: "https://winterarc.indevs.in/logo-512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": CANONICAL_URL,
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <WinterArcLogo className="h-7 w-10 text-accent" />
            <span className="text-base font-extrabold tracking-wide">
              WINTER <span className="text-accent">ARC</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/winter-arc-guide"
              className="hidden text-xs font-medium text-muted hover:text-foreground sm:inline-block"
            >
              Beginner Guide
            </Link>
            <Link
              href="/intro"
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:border-accent hover:bg-accent/25"
            >
              <span>Start Your Arc</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Recommended Principles & Guidelines</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Winter Arc <span className="text-accent">Rules & Instructions</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
            Winter Arc has no official governing body or mandatory rulebook. It is a customizable self-improvement
            challenge. Here are the core principles, practices, and guidelines to run your Arc with discipline and sustainability.
          </p>

          {/* Core Philosophy Banner */}
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Core Winter Arc Philosophy</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-extrabold text-foreground sm:gap-4 sm:text-base">
              <span className="text-sky-400">LOG</span>
              <span className="text-muted">→</span>
              <span className="text-sky-300">SEE</span>
              <span className="text-muted">→</span>
              <span className="text-blue-400">UNDERSTAND</span>
              <span className="text-muted">→</span>
              <span className="text-accent">IMPROVE</span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Use a focused period to build better habits, eliminate distractions, understand personal patterns, and enter the new year with unstobbale momentum.
            </p>
          </div>
        </div>

        {/* 10 Core Rules */}
        <section className="mt-16">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                The 10 Core Principles
              </h2>
              <p className="mt-1 text-xs text-muted">
                How to structure an intelligent, sustainable protocol without falling into extreme burnout traps.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {RULES.map((rule) => (
              <article
                key={rule.num}
                className="rounded-xl border border-border/80 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-accent/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-xs font-bold text-accent">
                      {rule.num}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{rule.title}</h3>
                  </div>
                  <span className="rounded-full border border-border bg-card/80 px-2.5 py-0.5 text-[11px] font-medium text-muted">
                    {rule.badge}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-accent/90">{rule.headline}</p>
                <div className="mt-3 text-sm">{rule.body}</div>
              </article>
            ))}
          </div>
        </section>

        {/* DO's and DON'Ts */}
        <section className="mt-16">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Winter Arc DO&apos;s and DON&apos;Ts
            </h2>
            <p className="mx-auto mt-1 max-w-xl text-xs text-muted">
              Discipline is simple, but simple does not mean extreme. Keep these guardrails in mind throughout your season.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* DO */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-emerald-300">DO</h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs text-muted">
                {DOS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">✓</span>
                    <span className="leading-relaxed text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DON'T */}
            <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="text-base font-bold text-red-300">DON&apos;T</h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs text-muted">
                {DONTS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-red-400">✕</span>
                    <span className="leading-relaxed text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Winter Arc Tracking System Workflow */}
        <section className="mt-16 rounded-2xl border border-accent/30 bg-gradient-to-b from-card/80 to-background p-6 text-center sm:p-10">
          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            The Winter Arc Tracking System
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted">
            How these principles connect into a daily operating rhythm inside Winter Arc Tracker.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-border/80 bg-card/60 p-4">
              <span className="text-xs font-bold text-accent">1. CHOOSE</span>
              <p className="mt-1 text-xs text-muted">Select 3–6 habits with quantifiable thresholds.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card/60 p-4">
              <span className="text-xs font-bold text-sky-400">2. LOG</span>
              <p className="mt-1 text-xs text-muted">Record exact daily behavior in under 2 minutes.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card/60 p-4">
              <span className="text-xs font-bold text-sky-300">3. SEE</span>
              <p className="mt-1 text-xs text-muted">Visualize streaks, completion %, and metric curves.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card/60 p-4">
              <span className="text-xs font-bold text-blue-400">4. UNDERSTAND</span>
              <p className="mt-1 text-xs text-muted">Detect drop-off triggers and weekly fatigue cycles.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card/60 p-4">
              <span className="text-xs font-bold text-emerald-400">5. IMPROVE</span>
              <p className="mt-1 text-xs text-muted">Adjust targets for compound, sustainable gains.</p>
            </div>
          </div>
        </section>

        {/* Real Product Features */}
        <section className="mt-16">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Real Winter Arc Product Features
            </h2>
            <p className="mt-1 text-xs text-muted">
              Built specifically around the protocol principles — no bloat, no fake metrics, 100% private.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {APP_FEATURES.map((feat) => (
              <Link
                key={feat.name}
                href={feat.href}
                className="group rounded-xl border border-border/80 bg-card/50 p-4 transition-all hover:border-accent hover:bg-card"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-accent">{feat.name}</h3>
                  <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{feat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-20 text-center">
          <div className="rounded-2xl border border-accent/40 bg-gradient-to-b from-card to-card/40 p-8 sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Ready to Define Your Own Winter Arc?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              Set custom dates, choose measurable habits, and begin logging your daily data with zero friction.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/intro"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-all hover:bg-sky-400"
              >
                <span>START YOUR WINTER ARC →</span>
              </Link>
              <Link
                href="/winter-arc-guide"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-accent"
              >
                <BookOpen className="h-4 w-4 text-accent" />
                <span>Read the Complete Guide</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
