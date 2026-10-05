"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { requireAuth } from "@/lib/auth-guard";
import { PromoVideo } from "@/components/PromoVideo";

function markSeen(): void {
  try {
    window.localStorage.setItem("wa-seen-intro", "1");
  } catch {
    /* ignore */
  }
}

export default function IntroPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div aria-hidden="true" className="app-bg" />
      <div className="intro-rise" style={{ animationDelay: "0.05s" }}>
        <WinterArcLogo className="intro-draw h-16 w-24 text-accent" />
      </div>
      <p
        className="intro-rise mt-6 text-sm font-extrabold tracking-[0.35em]"
        style={{ animationDelay: "0.35s" }}
      >
        WINTER <span className="text-accent">ARC</span>
      </p>
      <p
        className="intro-rise mt-1 text-[11px] font-semibold tracking-[0.25em] text-muted"
        style={{ animationDelay: "0.5s" }}
      >
        DISCIPLINE BUILDS FREEDOM
      </p>
      <h1
        className="intro-rise mt-8 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl"
        style={{ animationDelay: "0.65s" }}
      >
        Add once. Log daily.
        <br />
        See the trend.
      </h1>
      <p
        className="intro-rise mt-3 max-w-sm text-sm text-muted"
        style={{ animationDelay: "0.8s" }}
      >
        Track water, sleep, workouts, food and more across your 90-day arc.
        Explore everything first — sign in only when you save.
      </p>
      <div className="intro-rise mt-8 flex flex-col items-center gap-3" style={{ animationDelay: "0.95s" }}>
        <Link
          href="/"
          onClick={markSeen}
          className="flex h-13 items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background"
        >
          Explore Winter Arc <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => {
            markSeen();
            requireAuth({ route: "/", label: "Sign in" });
          }}
          className="text-xs font-semibold text-muted underline underline-offset-4"
        >
          I already have an account — Sign in
        </button>
      </div>
      <PromoVideo />
    </main>
  );
}
