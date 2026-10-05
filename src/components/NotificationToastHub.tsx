"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Flame, Sparkles, Target, X } from "lucide-react";
import { dismissToast, subscribeToast, type ToastMessage } from "@/lib/notify";

export function NotificationToastHub() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    return subscribeToast((t) => {
      setToast(t);
    });
  }, []);

  if (!toast) return null;

  const IconComponent =
    toast.icon === "flame"
      ? Flame
      : toast.icon === "check"
        ? CheckCircle2
        : toast.icon === "target"
          ? Target
          : toast.icon === "sparkles"
            ? Sparkles
            : Bell;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 top-4 z-[999] flex justify-center px-4"
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3.5 rounded-2xl border border-white/20 bg-card/90 px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-sm"
          style={toast.color ? { backgroundColor: toast.color } : undefined}
        >
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-extrabold uppercase tracking-wider text-accent">
            {toast.title}
          </p>
          <p className="text-sm font-semibold text-foreground leading-snug">
            {toast.body}
          </p>
        </div>
        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-card-2 hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
