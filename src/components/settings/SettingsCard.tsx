"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function SettingsCard({
  icon,
  title,
  sub,
  children,
  defaultOpen = true,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 text-left"
      >
        {icon}
        <span className="flex-1">
          <span className="block text-[15px] font-bold">{title}</span>
          <span className="block text-xs text-muted">{sub}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

export function Toggle({
  on,
  onFlip,
  label,
}: {
  on: boolean;
  onFlip: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onFlip}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? "bg-accent" : "bg-track"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export const field =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-base";
