import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, ShieldCheck } from "lucide-react";
import { WinterArcLogo } from "@/components/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of use for Winter Arc, including health disclaimers, usage terms, and intellectual property guidelines.",
  alternates: {
    canonical: "https://winterarc.indevs.in/terms",
  },
  openGraph: {
    title: "Terms of Service — Winter Arc",
    description: "Terms and conditions of use for Winter Arc, including health disclaimers, usage terms, and intellectual property guidelines.",
    url: "https://winterarc.indevs.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      {/* Background ambient gradient */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-accent/10 blur-[130px]" />

      <header className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <WinterArcLogo className="h-5 w-8 text-accent" />
            <span className="font-extrabold tracking-wide text-sm">
              WINTER <span className="text-accent">ARC</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to App
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 text-accent mb-2">
          <FileText className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Terms & Conditions of Use
        </h1>
        <p className="mt-2 text-sm text-muted">
          Last updated: October 2026 • Please read carefully before using Winter Arc
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Important Medical Disclaimer Alert */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200/90 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <strong className="text-amber-300 font-bold block">Health & Fitness Disclaimer</strong>
              <p className="leading-relaxed">
                Winter Arc is an interactive self-tracking tool designed for personal habit consistency. It does NOT provide medical, nutritional, psychological, or clinical fitness diagnosis. Always consult a licensed healthcare professional before commencing rigorous exercise regimens or dramatic dietary adjustments.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Winter Arc website, application, or associated services, you agree to be bound by these Terms of Service and our <Link href="/privacy" className="text-accent underline">Privacy Policy</Link>. If you do not agree with any part of these terms, please discontinue use of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. User Accounts & Security</h2>
            <p>
              You can utilize Winter Arc anonymously as a guest or create an authenticated account via Email or Google OAuth to enable cloud backup. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Reminders & Timers</h2>
            <p>
              Notifications and habit reminders provided by Winter Arc are best-effort local alerts. They should not be relied upon for critical medical, business, or life safety schedules. Always maintain dedicated alarms for vital obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. User Content & Progress Photos</h2>
            <p>
              You retain all ownership rights to any content, daily notes, body measurement logs, and photographs uploaded into your personal account. We do not claim any ownership over your personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Termination & Data Deletion</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate our terms or engage in abusive, malicious, or automated scraping behaviors. You may delete your account and associated data at any time via Settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> 6. Contact Information
            </h2>
            <p>
              For legal inquiries, terms clarification, or support questions, please contact:
            </p>
            <p className="font-semibold text-foreground">
              legal@winterarc.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
