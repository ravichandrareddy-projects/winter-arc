import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  Repeat,
  RotateCcw,
  Shield,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { AppFooter } from "@/components/AppFooter";

const CANONICAL_URL = "https://winterarc.indevs.in/winter-arc-guide";

export const metadata: Metadata = {
  title: "Winter Arc Beginner Guide — What It Is, How to Start & What to Track",
  description:
    "A complete, practical guide to Winter Arc. Learn what Winter Arc is, why people do it, how to choose measurable goals, structure your daily routine, and build consistency.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "Winter Arc Beginner Guide — What It Is, How to Start & What to Track",
    description:
      "A complete, practical guide to Winter Arc. Learn what Winter Arc is, why people do it, how to choose measurable goals, structure your daily routine, and build consistency.",
    url: CANONICAL_URL,
    siteName: "Winter Arc Tracker",
    type: "article",
    images: [
      {
        url: "https://winterarc.indevs.in/logo-512.png",
        width: 512,
        height: 512,
        alt: "Winter Arc Beginner Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winter Arc Beginner Guide — What It Is, How to Start & What to Track",
    description:
      "A complete, practical guide to Winter Arc. Learn what Winter Arc is, why people do it, how to choose measurable goals, and structure your daily routine.",
    images: ["https://winterarc.indevs.in/logo-512.png"],
  },
};

const STEPS = [
  { num: "01", title: "Choose Your Start Date", desc: "Most people choose early autumn or October, but any date that marks the start of your focused season works." },
  { num: "02", title: "Choose Your End Date", desc: "Set a clear finish line (often January 1 or a 60–90 day target) so you have an intentional, closed window." },
  { num: "03", title: "Pick 3 to 5 Key Life Areas", desc: "Don't overhaul 20 things. Select the few pillars that matter: Sleep, Training, Fuel, Mind, or Focus." },
  { num: "04", title: "Keep Goals Small & Real", desc: "Quality and daily execution beat an unsustainable 25-item checklist that breaks on Day 4." },
  { num: "05", title: "Make Every Goal Measurable", desc: "Turn vague hopes ('get fit') into precise actions ('workout 4x/week, walk 8k steps daily')." },
  { num: "06", title: "Log What Actually Happened", desc: "Take 30 seconds daily to record reality. No fake data, no perfection pressure — just raw honesty." },
  { num: "07", title: "Review Weekly Trends", desc: "Zoom out every Sunday. Look at your 7-day completion averages, sleep regularity, and energy levels." },
  { num: "08", title: "Adjust Intelligently", desc: "If a target causes chronic exhaustion or injury, recalibrate. Sustainability is the real victory." },
  { num: "09", title: "Continue After Setbacks", desc: "Missed a workout or bedtime? Record the slip, learn the friction point, and continue without restarting." },
];

const FAQS = [
  {
    q: "What is Winter Arc?",
    a: "Winter Arc is a customizable personal development period where people use the final months of the year to build discipline, track daily non-negotiables, and enter the new year with momentum instead of waiting for January 1.",
  },
  {
    q: "When does Winter Arc start?",
    a: "A common convention is starting around October 1, but there is no single mandatory start date. You can start in October, November, or whenever you decide to lock in.",
  },
  {
    q: "How long is a Winter Arc?",
    a: "Many people run a seasonal 3-month (approx. 90-day) arc, but the duration is fully flexible. You can choose a 30-day, 60-day, or custom window that fits your goals.",
  },
  {
    q: "Does Winter Arc have official rules?",
    a: "No. Winter Arc is an organic community trend and self-mastery philosophy, not a trademarked corporate entity with mandatory laws. You define your own rules.",
  },
  {
    q: "How many goals should I choose?",
    a: "We recommend choosing 3 to 5 meaningful non-negotiables. Setting 15 goals often leads to burnout within two weeks.",
  },
  {
    q: "What should I track during my Arc?",
    a: "Focus on daily anchors: sleep bedtime and wake consistency, daily movement (steps or workouts), nutrition (protein and hydration), and mental focus (reading or study).",
  },
  {
    q: "Can I start Winter Arc late?",
    a: "Yes. Starting late with genuine consistency is infinitely better than waiting another full year. Set your start date today and run your focused window.",
  },
  {
    q: "What happens if I miss a day?",
    a: "You do not restart from Day 1. You log the day accurately, identify what caused the lapse, and continue your routine the next morning.",
  },
  {
    q: "Is Winter Arc only about fitness and lifting?",
    a: "No. While fitness is popular, Winter Arc encompasses mental discipline, professional projects, reading, sleep repair, and personal lifestyle structure.",
  },
  {
    q: "How does Winter Arc Tracker help?",
    a: "Winter Arc Tracker is a private, on-device web application where you can log habits in seconds, visualize streaks, check sleep and nutrition, and review long-term progress with zero cloud tracking.",
  },
];

export default function WinterArcGuidePage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground selection:bg-accent/25 selection:text-accent font-sans antialiased">
      {/* Background Aurora Glow */}
      <div aria-hidden="true" className="app-bg fixed inset-0 pointer-events-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <WinterArcLogo className="h-7 w-7 text-accent transition-transform group-hover:scale-105" />
            <span className="text-base font-extrabold tracking-tight">
              WINTER<span className="text-accent ml-1">ARC</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/winter-arc-rules"
              className="text-xs font-semibold text-muted hover:text-foreground transition-colors hidden sm:inline-block"
            >
              Rules & Principles
            </Link>
            <Link
              href="/intro"
              className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-4 py-2 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3.5 py-1 text-xs font-mono font-bold tracking-wider uppercase text-accent">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Complete Beginner Blueprint</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            Winter Arc: The Complete Beginner Guide
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted leading-relaxed">
            Everything you need to know about the 90-day seasonal discipline challenge — what it is, why people do it, how to pick realistic targets, and how to track your progress.
          </p>
        </div>

        {/* Core Philosophy Banner */}
        <div className="mt-12 rounded-2xl border border-accent/30 bg-card/60 p-6 sm:p-8 backdrop-blur-md text-center">
          <p className="text-xs font-mono font-bold tracking-[0.2em] text-accent uppercase">
            The Winter Arc Core Loop
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg font-black tracking-wide text-foreground">
            <span className="text-sky-400">CHOOSE</span>
            <span className="text-muted">→</span>
            <span className="text-accent">LOG</span>
            <span className="text-muted">→</span>
            <span className="text-indigo-400">SEE</span>
            <span className="text-muted">→</span>
            <span className="text-emerald-400">UNDERSTAND</span>
            <span className="text-muted">→</span>
            <span className="text-amber-400">IMPROVE</span>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Winter Arc is not about suffering or extreme burnout. It is an intentional feedback loop: you record reality, see your patterns, and make small, daily improvements.
          </p>
        </div>

        {/* Section 1: What is Winter Arc? */}
        <section className="mt-16 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            1. What is Winter Arc?
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-muted">
            <p>
              Winter Arc is a focused period of self-improvement where individuals dedicate the final months of the year to deliberate personal growth instead of waiting for January 1 New Year&apos;s resolutions.
            </p>
            <p>
              While society often slows down and drifts into holiday complacency, those participating in a Winter Arc lock into core habits: regular sleep, focused physical training, clean nutrition, reduced digital distractions, and dedicated study or project hours.
            </p>
            <p className="p-4 rounded-xl border border-border/80 bg-card/40 text-xs sm:text-sm text-foreground/90">
              <strong className="text-accent">Important Note:</strong> Winter Arc has no single governing body or mandatory rulebook. It is an organic, customizable challenge. You design your own non-negotiables to match your lifestyle.
            </p>
          </div>
        </section>

        {/* Section 2: Why Do a Winter Arc? */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            2. Why Do a Winter Arc?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            People embark on a Winter Arc for personal clarity and self-respect, not social validation. Common motivations include:
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              "Building consistency that survives winter mood dips",
              "Entering January with established momentum rather than starting from zero",
              "Repairing fragmented circadian sleep and wake schedules",
              "Making measurable progress on physical strength and body composition",
              "Eliminating doom-scrolling in favor of deep work and reading",
              "Proving to yourself that you can stick to your own word",
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/40 p-3.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-foreground">{reason}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 & 4: Timeline & Duration */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            3. When Does It Start & How Long Does It Last?
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-muted">
            <p>
              The most recognized convention is running from <strong>October 1 to January 1</strong> (approximately 90 days). However, this timeline is not cast in stone.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                  <Calendar className="h-4 w-4" /> October 1 Start
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  The classic 90-day arc finishing on New Year&apos;s Eve. Provides a full quarter of deep focus.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                  <Clock className="h-4 w-4" /> Mid-Season Start
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Starting in late October or November for 45–60 days. Just as potent for building core momentum.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                  <RotateCcw className="h-4 w-4" /> Custom Windows
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Any structured 8 to 12 week period when you commit to strict routine and data tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Step-by-Step Starter Blueprint */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            4. How to Start: The 9-Step Process
          </h2>
          <div className="mt-6 space-y-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-border/80 bg-card/50 p-4 transition hover:border-accent/40"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft font-mono text-xs font-black text-accent">
                    {step.num}
                  </span>
                  <h3 className="text-sm font-bold text-foreground sm:w-56">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 & 7: Goal Setting & Formulas */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            5. Goal Setting: Transforming Vague Desires into Targets
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            The biggest beginner mistake is setting abstract wishes. Winter Arc requires precise, binary definitions:
          </p>

          <div className="mt-6 space-y-3">
            {[
              { bad: "I want to get fit.", good: "Walk 8,000 steps daily + lift weights 4x/week." },
              { bad: "I need to study more.", good: "Complete 60 minutes of uninterrupted study every weekday." },
              { bad: "I want to sleep better.", good: "In bed with screens off by 10:30 PM." },
              { bad: "Eat cleaner.", good: "Hit 140g protein daily and drink 3 liters of water." },
              { bad: "Read books.", good: "Read 10 physical book pages before looking at my phone in the morning." },
            ].map((ex, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-border/80 bg-card/40 p-3.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-red-400/90 font-medium">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>Vague: &ldquo;{ex.bad}&rdquo;</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Trackable: &ldquo;{ex.good}&rdquo;</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: What You Can Track */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            6. What Can You Track?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            You don&apos;t have to log everything. Choose the categories that align with your current transformation priorities:
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-indigo-500/30 bg-card/60 p-4">
              <Moon className="h-5 w-5 text-indigo-400" />
              <h3 className="mt-3 text-sm font-bold text-foreground">Sleep & Wake</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>• Target Bedtime Lock</li>
                <li>• Morning Rise Time</li>
                <li>• Sleep Duration (hrs)</li>
                <li>• Circadian Consistency</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-card/60 p-4">
              <Flame className="h-5 w-5 text-emerald-400" />
              <h3 className="mt-3 text-sm font-bold text-foreground">Physical Fitness</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>• Daily Steps Count</li>
                <li>• Resistance Splits</li>
                <li>• Running / Cardio KM</li>
                <li>• Push-up Rep Counts</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-card/60 p-4">
              <Sun className="h-5 w-5 text-amber-400" />
              <h3 className="mt-3 text-sm font-bold text-foreground">Fuel & Nutrition</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>• Daily Protein Targets (g)</li>
                <li>• Caloric Budget</li>
                <li>• Hydration Liters</li>
                <li>• Meal Log Consistency</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-500/30 bg-card/60 p-4">
              <Compass className="h-5 w-5 text-sky-400" />
              <h3 className="mt-3 text-sm font-bold text-foreground">Mind & Focus</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>• Deep Work Sessions</li>
                <li>• Book Pages Read</li>
                <li>• Screen-time Boundaries</li>
                <li>• Meditation / Quiet</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 9: Realistic Example Routine */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <div className="rounded-2xl border border-accent/40 bg-card-2/60 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase">
              <Lightbulb className="h-4 w-4" /> Example Winter Arc Routine (Customize for Yourself)
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-black text-foreground">
              A Balanced Daily Architecture
            </h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-border/80 bg-card/60">
                <span className="font-bold text-sky-400 uppercase tracking-wider text-[11px] block">Morning</span>
                <p className="mt-2 text-muted leading-relaxed">
                  06:00 Wake-up check-in. 500ml water. 10-minute daylight walk. Review today&apos;s 4 non-negotiables.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/80 bg-card/60">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">Midday</span>
                <p className="mt-2 text-muted leading-relaxed">
                  90-minute deep work block. Protein-dense lunch. Afternoon workout split or 8k step checkmark.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/80 bg-card/60">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px] block">Evening</span>
                <p className="mt-2 text-muted leading-relaxed">
                  Final meal log. 15 pages reading. 22:00 screens down. Quick 20-second dashboard review before bed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Handling Setbacks */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            7. What Happens When You Miss a Day?
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-muted">
            <p>
              One off-day does not ruin your progress. The most toxic trap in personal development is the &ldquo;Day 1 reset&rdquo; mindset, where a single missed workout causes someone to abandon their entire season.
            </p>
            <div className="rounded-xl border border-accent/30 bg-accent-soft/30 p-4 sm:p-5 text-foreground">
              <p className="font-bold text-sm text-accent">The 4-Step Recovery Rule:</p>
              <p className="mt-2 text-xs sm:text-sm font-semibold tracking-wide">
                MISS → RECORD HONESTLY → IDENTIFY WHY → CONTINUE TOMORROW
              </p>
              <p className="mt-2 text-xs text-muted">
                If you were sick or overwhelmed, log the reality. Then protect the next day. The golden rule of Winter Arc is simply: <em>never allow two missed days in a row</em>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 11: Common Beginner Mistakes */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            8. Common Winter Arc Mistakes to Avoid
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              "Setting 15 rules at once and burning out by Day 10",
              "Sacrificing 8 hours of sleep in the name of 'discipline'",
              "Copying an influencer's 4:00 AM routine that doesn't fit your job or school",
              "Crash dieting or extreme caloric deficits that tank cognitive energy",
              "Treating one missed task as an excuse to quit the entire week",
              "Obsessing over vanity streaks instead of genuine behavioral change",
            ].map((mistake, idx) => (
              <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm text-foreground/90">{mistake}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 12: How Winter Arc Tracker Fits In */}
        <section className="mt-14 border-t border-border/70 pt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            9. How Winter Arc Tracker Helps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            Instead of managing scattered paper notes or clunky spreadsheets, Winter Arc Tracker brings all your daily habits under one unified dashboard:
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <Zap className="h-5 w-5 text-sky-400" />
              <h3 className="mt-2 text-sm font-bold text-foreground">3-Second Fast Logging</h3>
              <p className="mt-1 text-xs text-muted">
                Tap +0.5L water or check your workout in under 3 seconds so tracking never interrupts your flow.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="mt-2 text-sm font-bold text-foreground">90-Day Trend Heatmaps</h3>
              <p className="mt-1 text-xs text-muted">
                See completion rings and phase progression through Foundation, Momentum, and Mastery.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <Shield className="h-5 w-5 text-indigo-400" />
              <h3 className="mt-2 text-sm font-bold text-foreground">100% On-Device & Private</h3>
              <p className="mt-1 text-xs text-muted">
                Your entries, health logs, and transformation photos stay stored right on your device.
              </p>
            </div>
          </div>
        </section>

        {/* Section 13: FAQ */}
        <section className="mt-16 border-t border-border/70 pt-12">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase">
            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
            Winter Arc FAQ
          </h2>

          <div className="mt-8 space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border/80 bg-card/50 p-5">
                <h3 className="text-sm sm:text-base font-bold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center rounded-3xl border border-accent/40 bg-gradient-to-br from-card via-card-2 to-card p-10 sm:p-14 shadow-2xl backdrop-blur-2xl">
          <WinterArcLogo className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-5 text-2xl sm:text-4xl font-black text-foreground">
            Ready to Begin Your Arc?
          </h2>
          <p className="mt-3 max-w-md mx-auto text-xs sm:text-sm text-muted leading-relaxed">
            Take your first step today. Set your custom non-negotiables, track your habits in seconds, and watch your consistency grow.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/intro"
              className="flex h-13 w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border border-accent/50 bg-gradient-to-r from-accent via-sky-500 to-accent px-8 text-sm font-extrabold text-white shadow-[0_0_28px_rgba(46,155,255,0.35)] transition hover:scale-103 active:scale-95"
            >
              <span>START YOUR WINTER ARC</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/winter-arc-rules"
              className="flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card/70 px-7 text-xs sm:text-sm font-bold text-muted hover:text-foreground hover:bg-card transition"
            >
              <span>Read Rules & Principles</span>
            </Link>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
