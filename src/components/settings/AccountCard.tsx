"use client";

import { LogOut, User } from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { useAuth } from "@/lib/auth";

export function AccountCard() {
  const { status, user, signOut } = useAuth();

  return (
    <SettingsCard
      icon={<User className="h-6 w-6 text-accent" />}
      title="Account"
      sub="Manage your account."
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
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-500/50 text-sm font-semibold text-red-500"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
          <p className="text-xs text-muted">
            Signing out returns to demo mode. Your data stays saved in your account.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Browsing as guest. Sign in to save your personal 90-day progress permanently across all your devices.
          </p>
          <a
            href="/login"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-bold text-background transition-opacity hover:opacity-90 shadow-md"
          >
            Sign In or Create Account
          </a>
        </div>
      )}
    </SettingsCard>
  );
}
