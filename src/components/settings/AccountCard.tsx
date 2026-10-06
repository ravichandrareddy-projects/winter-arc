"use client";

import { LogOut, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { SettingsCard } from "./SettingsCard";
import { useAuth } from "@/lib/auth";
import { setHasSeenIntro } from "@/lib/intro-storage";

export function AccountCard() {
  const { status, user, signOut } = useAuth();
  const router = useRouter();

  const handleGuestExit = () => {
    setHasSeenIntro(false);
    router.push("/");
  };

  return (
    <SettingsCard
      icon={<User className="h-6 w-6 text-accent" />}
      title="Account & Session"
      sub="Manage your session state and device data ownership."
    >
      {status === "loading" ? (
        <p className="text-sm text-muted">Checking session…</p>
      ) : status === "authenticated" ? (
        <div className="flex flex-col gap-3">
          <p className="truncate text-sm">
            Signed in as <span className="font-bold">{user?.email ?? ""}</span>
          </p>
          <button
            onClick={() => void signOut()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-500/50 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign Out & Show Landing Page
          </button>
          <p className="text-xs text-muted">
            Signing out clears your active session and presents the official logged-out starting screen.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Local Device Mode Active (Private)</span>
          </div>
          <p className="text-xs text-muted">
            You are using Winter Arc in local-first privacy mode. All your logs stay on this phone without remote data collection.
          </p>
          <button
            onClick={handleGuestExit}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-xs sm:text-sm font-bold text-muted hover:text-foreground hover:bg-card-2 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Log Out & Return to Landing Screen
          </button>
          <div className="mt-1 border-t border-border/60 pt-3">
            <p className="text-[11px] text-muted mb-2">Want to sync across multiple computers or phones?</p>
            <a
              href="/login"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-card-2 border border-border/80 text-xs font-bold text-foreground transition hover:border-accent hover:text-accent shadow-sm"
            >
              Sign In or Link Account
            </a>
          </div>
        </div>
      )}
    </SettingsCard>
  );
}
