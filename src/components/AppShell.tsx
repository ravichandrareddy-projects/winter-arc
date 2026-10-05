"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dumbbell,
  House,
  Moon,
  Settings as SettingsIcon,
  Sun,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { WinterArcWordmark, DefaultAvatar } from "./brand";
import { arcDayNumber, todayKey } from "@/lib/dates";
import { applyAccent } from "@/lib/accent";
import { startReminderLoop } from "@/lib/notify";
import { useWinterArc } from "@/lib/store";
import { useEffect } from "react";
import { NotificationToastHub } from "./NotificationToastHub";

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

  // default landing tab, once per session (after intro has been seen)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      pathname === "/" &&
      startTab !== "/" &&
      window.localStorage.getItem("wa-seen-intro") &&
      !window.sessionStorage.getItem("wa-landed")
    ) {
      window.sessionStorage.setItem("wa-landed", "1");
      router.replace(startTab);
    }
  }, [pathname, startTab, router]);

  // first visit → intro (explore-first; never blocks deep links)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (pathname === "/" && !window.localStorage.getItem("wa-seen-intro")) {
        window.localStorage.setItem("wa-seen-intro", "1");
        router.replace("/intro");
      }
    } catch {
      /* storage blocked — skip intro */
    }
  }, [pathname, router]);

  const today = todayKey();
  const totalDays = arc ? arcDayNumber(arc.startDate, arc.endDate) : 90;
  const dayN = arc ? Math.min(totalDays, Math.max(1, arcDayNumber(arc.startDate, today))) : 1;
  const pct = Math.round((dayN / Math.max(1, totalDays)) * 100);

  return (
    <div className="min-h-dvh lg:flex">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-sidebar/85 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="mb-6 px-1">
          <WinterArcWordmark />
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} active={pathname === n.href} />
          ))}
        </nav>
        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-bold">{totalDays} Day Arc</p>
          <p className="mt-0.5 text-xs text-muted">
            {arc ? `${arc.startDate} – ${arc.endDate}` : "…"}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-track">
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 flex justify-between text-xs text-muted">
            <span>
              Day {dayN} / {totalDays}
            </span>
            <span>{pct}%</span>
          </p>
        </div>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs italic leading-relaxed text-muted">
            “A better you is a series of better days.”
          </p>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <DefaultAvatar name={profile.name} className="h-9 w-9 text-xs" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{profile.name}</p>
            <p className="truncate text-xs text-muted">{profile.email}</p>
          </div>
        </div>
      </aside>

      {/* content */}
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</div>

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
