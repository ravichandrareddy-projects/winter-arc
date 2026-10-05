import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, UserCheck, EyeOff, Database } from "lucide-react";
import { WinterArcLogo } from "@/components/brand";

export const metadata: Metadata = {
  title: "Privacy Policy | Winter Arc Protocol",
  description: "Learn how Winter Arc protects your privacy, personal habit logs, fitness photos, and account data with our local-first and secure sync architecture.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
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
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Your Privacy & Data Ownership
        </h1>
        <p className="mt-2 text-sm text-muted">
          Last updated: October 2026 • Effective immediately
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Key Principles Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <div className="flex items-center gap-2 text-foreground font-bold mb-1">
                <Database className="h-4 w-4 text-accent" /> Local-First Architecture
              </div>
              <p className="text-xs text-muted">
                Guest mode runs 100% on your device. Nothing leaves your browser unless you create an account to sync.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <div className="flex items-center gap-2 text-foreground font-bold mb-1">
                <EyeOff className="h-4 w-4 text-accent" /> Zero Third-Party Tracking
              </div>
              <p className="text-xs text-muted">
                We do not sell, rent, or monetize your personal fitness, sleep, or photo data to advertising brokers.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" /> 1. Information We Collect
            </h2>
            <p>
              Depending on how you use Winter Arc, we collect information in the following ways:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-foreground">Guest / Preview Mode:</strong> All trackers, entries, sleep records, workouts, and settings are saved strictly in your local browser storage (LocalStorage & IndexedDB). We cannot see, access, or restore this data.
              </li>
              <li>
                <strong className="text-foreground">Account Information:</strong> If you sign up with Email/Password or Google 1-Click Login, we collect your email address and profile name to authenticate your account and securely sync your 90-day progress.
              </li>
              <li>
                <strong className="text-foreground">Body Progress Photos:</strong> Photos uploaded to the physique tracker are encrypted in transit and stored privately under your authenticated user ID. They are never published publicly.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-accent" /> 2. Google OAuth & Authentication
            </h2>
            <p>
              When you choose &ldquo;Continue with Google&rdquo;, Winter Arc uses Google OAuth solely to verify your identity and retrieve your email and name. We request only basic profile scopes (<code className="text-foreground bg-card px-1.5 py-0.5 rounded">openid</code>, <code className="text-foreground bg-card px-1.5 py-0.5 rounded">email</code>, <code className="text-foreground bg-card px-1.5 py-0.5 rounded">profile</code>).
            </p>
            <p>
              We do not access your Google Drive, contacts, emails, or any other personal Google data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. How Your Data Is Stored & Protected</h2>
            <p>
              For authenticated users, backend services are hosted with Supabase with Row Level Security (RLS) enabled. Only your authenticated user session can read or write your personal records. All data transmission between your browser and our servers is encrypted using Industry-standard TLS 1.3 / HTTPS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Data Export & Deletion Rights</h2>
            <p>
              You maintain 100% ownership of your discipline logs:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-foreground">Export Anytime:</strong> Go to <Link href="/settings" className="text-accent underline">Settings &rarr; Data</Link> to download a complete CSV copy of your 90-day journey.
              </li>
              <li>
                <strong className="text-foreground">Delete Anytime:</strong> You can purge all data locally using the Reset feature or delete your account data permanently from our database.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or your data, you can reach out to us at:
            </p>
            <p className="font-semibold text-foreground">
              privacy@winterarc.app
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
