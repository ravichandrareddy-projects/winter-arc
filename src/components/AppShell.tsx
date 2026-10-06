"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Dumbbell,
  Flame,
  House,
  Moon,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { WinterArcWordmark, DefaultAvatar } from "./brand";
import { arcDayNumber, todayKey, monthDayShort, monthDayYear } from "@/lib/dates";
import { applyAccent } from "@/lib/accent";
import { startReminderLoop } from "@/lib/notify";
import { selectDayCompletion, useWinterArc } from "@/lib/store";
import { useEffect } from "react";
import { NotificationToastHub } from "./NotificationToastHub";
import { AppFooter } from "./AppFooter";

const NAV = [
  { href: "/", label: "Home", icon: House },
  { href: "/sleep", label: "Sleep", icon: Moon },
  { href: "/wake-up", label: "Wake Up", icon: Sun },
  { href: "/fitness", label: "Fitness", icon: Dumbbell },
  { href: "/food", label: "Food", icon: UtensilsCrossed },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

const MOBILE_TABS = ["/", "/fitness", "/food", "/progress", "/settings"] as const;

function NavLink({
  href,
  label,
  active,
  icon: Icon,
  mobile = false,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: typeof House;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        <Icon className="h-5 w-5" />
        {label === "Home" ? "Home" : label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
        active
          ? "bg-accent-soft text-accent"
          : "text-muted hover:bg-card-2 hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
      {active && <span className="ml-auto h-5 w-1 rounded-full bg-accent" />}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const arc = useWinterArc((s) => s.arc);
  const profile = useWinterArc((s) => s.profile);
  const accent = useWinterArc((s) => s.preferences.accent);
  const startTab = useWinterArc((s) => s.preferences.startTab);
  const ensureSeed = useWinterArc((s) => s.ensureSeed);

  useEffect(() => {
    ensureSeed();
  }, [ensureSeed]);

  useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  useEffect(() => {
    startReminderLoop();
  }, []);

  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);

  const today = todayKey();
  const totalDays = arc ? arcDayNumber(arc.startDate, arc.endDate) : 90;
  const dayN = arc ? Math.min(totalDays, Math.max(1, arcDayNumber(arc.startDate, today))) : 1;
  const remainingDays = Math.max(0, totalDays - dayN);
  const pct = Math.round((dayN / Math.max(1, totalDays)) * 100);

  const todayStats = selectDayCompletion(trackers, entries, today);

  const phase =
    dayN <= 30
      ? {
          num: 1,
          name: "Foundation",
          badge: "text-amber-400 bg-amber-400/10 border-amber-400/25",
          quote: "“Discipline is choosing between what you want now and what you want most.”",
        }
      : dayN <= 60
      ? {
          num: 2,
          name: "Momentum",
          badge: "text-sky-400 bg-sky-400/10 border-sky-400/25",
          quote: "“The winter arc is won in the silent hours no one sees.”",
        }
      : {
          num: 3,
          name: "Mastery",
          badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
          quote: "“Mastery is not an act, but a habit. Finish what you started.”",
        };

  return (
    <div className="min-h-dvh lg:flex">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-sidebar/85 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="mb-6 px-1">
          <WinterArcWordmark />
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} active={pathname === n.href} />
          ))}
        </nav>

        {/* 90-Day Arc Progress Card */}
        <div className="mt-5 rounded-2xl border border-border bg-card/80 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-foreground">90-Day Arc</span>
            </div>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${phase.badge}`}>
              P{phase.num} · {phase.name}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-muted">
            {arc ? `${monthDayShort(arc.startDate)} – ${monthDayYear(arc.endDate)}` : "90 Days"}
          </p>

          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-track/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span>
              <span className="font-bold text-foreground">Day {dayN}</span>
              <span className="text-muted"> / {totalDays}</span>
            </span>
            <span>
              <span className="font-bold text-accent">{pct}%</span>
              <span className="text-muted ml-1">({remainingDays}d left)</span>
            </span>
          </div>
        </div>

        {/* Today's Protocol Progress Card */}
        <div className="mt-2.5 rounded-2xl border border-border bg-card/80 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`h-4 w-4 ${todayStats.pct === 100 && todayStats.total > 0 ? "text-emerald-400" : "text-muted"}`} />
              <span className="text-xs font-bold text-foreground">Today&apos;s Protocol</span>
            </div>
            <span className={`text-xs font-extrabold ${todayStats.pct === 100 && todayStats.total > 0 ? "text-emerald-400" : "text-foreground"}`}>
              {todayStats.pct}%
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-track/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                todayStats.pct === 100 && todayStats.total > 0
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : "bg-accent"
              }`}
              style={{ width: `${todayStats.total === 0 ? 0 : Math.max(3, todayStats.pct)}%` }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
            <span>
              <strong className="text-foreground font-semibold">{todayStats.done}</strong> of {todayStats.total} done
            </span>
            {todayStats.pct === 100 && todayStats.total > 0 ? (
              <span className="font-bold text-emerald-400">Locked In! 🔥</span>
            ) : (
              <span>{Math.max(0, todayStats.total - todayStats.done)} remaining</span>
            )}
          </div>
        </div>

        {/* Daily Mindset Quote */}
        <div className="mt-2.5 rounded-2xl border border-border/70 bg-card/50 p-3">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
            <Sparkles className="h-3 w-3 text-accent" /> Mindset
          </div>
          <p className="text-[11px] italic leading-relaxed text-muted/90">
            {phase.quote}
          </p>
        </div>

        <Link
          href="/intro"
          id="sidebar-intro-screen-btn"
          className="mt-auto flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-bold text-accent transition-all hover:bg-accent hover:text-white mb-2"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Intro Screen & Guide</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-2 group rounded-xl p-2 transition-colors hover:bg-card/60"
        >
          <DefaultAvatar name={profile.name} className="h-9 w-9 text-xs transition-transform group-hover:scale-105" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold group-hover:text-accent transition-colors">{profile.name}</p>
            <p className="truncate text-xs text-muted">{profile.email}</p>
          </div>
        </Link>
      </aside>

      {/* content */}
      <div className="min-w-0 flex-1 flex flex-col justify-between pb-24 lg:pb-0">
        <div className="flex-1">{children}</div>
        <AppFooter />
      </div>

      {/* mobile bottom tabs */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-sidebar/95 px-2 backdrop-blur lg:hidden"
      >
        {NAV.filter((n) =>
          (MOBILE_TABS as readonly string[]).includes(n.href)
        ).map((n) => (
          <NavLink
            key={n.href}
            {...n}
            active={pathname === n.href}
            mobile
            label={n.label}
          />
        ))}
      </nav>

      <NotificationToastHub />
    </div>
  );
}
