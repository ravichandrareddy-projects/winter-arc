"use client";

import { useState } from "react";
import {
  Bell,
  Dumbbell,
  Moon,
  Sun,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { SettingsCard, Toggle } from "./SettingsCard";
import { requestNotifyPermission, pingBadge } from "@/lib/notify";
import { requireAuth } from "@/lib/auth-guard";
import { REMINDER_META, useWinterArc, type ReminderKey } from "@/lib/store";
import { formatTime12 } from "@/lib/dates";

const ROW_ICON: Record<ReminderKey, typeof Bell> = {
  wakeUp: Sun,
  sleep: Moon,
  meal: UtensilsCrossed,
  workout: Dumbbell,
  summary: TrendingUp,
};

export function NotificationsCard() {
  const reminders = useWinterArc((s) => s.reminders);
  const setReminder = useWinterArc((s) => s.setReminder);
  const [perm, setPerm] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  );

  const [pingStatus, setPingStatus] = useState("");

  const enable = async (key: ReminderKey, on: boolean) => {
    if (on && perm === "default") {
      const p = await requestNotifyPermission();
      setPerm(p);
    }
    requireAuth({ route: "/settings", label: "Change reminder", replay: () => setReminder(key, { enabled: on }) });
  };

  return (
    <SettingsCard
      icon={<Bell className="h-6 w-6 text-accent" />}
      title="Notifications"
      sub="Get reminders to stay consistent."
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {perm !== "granted" && (
          <button
            onClick={async () => setPerm(await requestNotifyPermission())}
            className="flex h-10 items-center rounded-full bg-foreground px-4 text-xs font-bold text-background transition hover:opacity-90"
          >
            Enable browser notifications
          </button>
        )}
        <button
          onClick={() => {
            pingBadge("workout");
            if (perm === "granted") {
              try {
                new Notification("Winter Arc — Test", { body: "Reminders are working." });
              } catch {
                /* badge still pinged */
              }
            }
            setPingStatus("Test ping triggered! Bell badge updated.");
            setTimeout(() => setPingStatus(""), 3500);
          }}
          className="flex h-10 items-center rounded-full border border-border px-4 text-xs font-bold transition hover:bg-card-2"
        >
          Send test ping
        </button>
        {pingStatus && (
          <span className="text-xs font-semibold text-accent animate-fade-in">
            {pingStatus}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {REMINDER_META.map(({ key, label }) => {
          const Icon = ROW_ICON[key];
          const r = reminders[key];
          return (
            <div key={key} className="flex items-center gap-3 py-1.5">
              <Icon className="h-5 w-5 shrink-0 text-muted" />
              <span className="flex-1 text-sm">{label}</span>
              <input
                type="time"
                value={r.time}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  requireAuth({ route: "/settings", label: "Change reminder", replay: () => setReminder(key, { time: v }) });
                }}
                aria-label={`${label} time (currently ${formatTime12(r.time)})`}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
              />
              <Toggle on={r.enabled} onFlip={() => enable(key, !r.enabled)} label={label} />
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">
        {perm === "granted"
          ? "Notifications allowed — reminders fire while the app is open."
          : perm === "denied"
            ? "Browser notifications are blocked — enable them in your browser settings. The bell badge still pings."
            : "Enable any reminder to allow browser notifications. The bell badge always pings."}
      </p>
    </SettingsCard>
  );
}
