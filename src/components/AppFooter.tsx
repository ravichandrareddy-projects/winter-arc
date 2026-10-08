import Link from "next/link";
import { Sparkles } from "lucide-react";
import { WinterArcLogo } from "./brand";
import { LiveUserCount } from "./LiveUserCount";

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-card/40 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <WinterArcLogo className="h-6 w-9 text-accent" />
              <span className="text-base font-extrabold tracking-wide">
                WINTER <span className="text-accent">ARC</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">
              The 90-Day Discipline & Self-Mastery Protocol. Add once, log daily, observe your trend, and master physical, mental, and habit consistency.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="mailto:contact@winterarc.indevs.in"
                title="Email Us"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                title="X / Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Protocol Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Protocol</p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home Dashboard</Link>
              </li>
              <li>
                <Link href="/sleep" className="hover:text-foreground transition-colors">Sleep Tracking</Link>
              </li>
              <li>
                <Link href="/wake-up" className="hover:text-foreground transition-colors">Wake Up Schedule</Link>
              </li>
              <li>
                <Link href="/fitness" className="hover:text-foreground transition-colors">Fitness & Workouts</Link>
              </li>
              <li>
                <Link href="/fitness/photos" className="hover:text-foreground transition-colors">Transformation Photos</Link>
              </li>
              <li>
                <Link href="/winter-arc-guide" className="hover:text-foreground transition-colors">Beginner Guide</Link>
              </li>
              <li>
                <Link href="/winter-arc-rules" className="hover:text-foreground transition-colors">Rules & Principles</Link>
              </li>
            </ul>
          </div>

          {/* Analytics & System */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Analytics</p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/food" className="hover:text-foreground transition-colors">Food & Macros</Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-foreground transition-colors">90-Day Trends</Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors">Settings & Backup</Link>
              </li>
              <li>
                <Link href="/intro" className="inline-flex items-center gap-1.5 font-bold text-accent hover:text-sky-300 transition-colors">
                  <Sparkles className="h-3 w-3" />
                  <span>Intro Screen & Guide</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Legal & Security</p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              </li>
              <li>
                <a href="/llms.txt" className="hover:text-foreground transition-colors">llms.txt (AI Spec)</a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-foreground transition-colors">Sitemap</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Down Footer with Intro Screen Button */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row text-xs text-muted">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} Winter Arc Protocol (winterarc.indevs.in).</p>
            <LiveUserCount />
            <Link
              href="/intro"
              id="footer-intro-screen-btn"
              title="Revisit the onboarding intro screen anytime"
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:shadow-[0_0_16px_rgba(46,155,255,0.4)] active:scale-95"
            >
              <Sparkles className="h-3 w-3" />
              <span>Intro Screen</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted/80">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>100% On-Device Storage (Private)</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Self-Mastery System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
