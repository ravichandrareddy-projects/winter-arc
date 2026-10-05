"use client";

import { useState } from "react";
import {
  ChevronRight,
  CircleHelp,
  FileText,
  Info,
  Layers,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { Sheet } from "../Sheet";
import pkg from "../../../package.json";

const DOCS: { key: string; title: string; icon: typeof Info; body: string[] }[] = [
  {
    key: "help",
    title: "Help & Support",
    icon: CircleHelp,
    body: [
      "Add a tracker once from Home — it appears every scheduled day.",
      "Log fast: steppers on cards, boxes on the Table view, taps on Sleep/Wake grids.",
      "Everything saves on this device instantly. Targets can change anytime; history never rewrites.",
      "Something wrong? Export Data in Data & Privacy first, then send feedback with details.",
    ],
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    icon: ShieldCheck,
    body: [
      "Winter Arc stores everything locally on your device (browser storage + on-device photo library).",
      "No account, no server, no analytics, no tracking. Nothing you log ever leaves this device unless you use Share or Export.",
      "Deleting the app's site data erases everything permanently.",
    ],
  },
  {
    key: "terms",
    title: "Terms of Service",
    icon: FileText,
    body: [
      "Winter Arc is a personal habit tracker, not medical advice. Sleep, food and fitness data here is for self-tracking only.",
      "Reminders fire while the app is open and are best-effort. Use a real alarm for anything critical.",
      "You own your data: back it up anytime from Data & Privacy.",
    ],
  },
];

export function AboutCard() {
  const [doc, setDoc] = useState<(typeof DOCS)[number] | null>(null);

  const feedbackHref =
    "mailto:hello@winterarc.app?subject=Winter%20Arc%20Feedback&body=" +
    encodeURIComponent(`App v${pkg.version}\n\nMy feedback:\n`);

  const row = (icon: React.ReactNode, label: string, right: string, onClick?: () => void, href?: string) => {
    const inner = (
      <>
        {icon}
        <span className="flex-1 text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted">{right}</span>
        <ChevronRight className="h-4 w-4 text-muted" />
      </>
    );
    const cls = "flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left";
    if (href) {
      return (
        <a key={label} href={href} className={cls}>
          {inner}
        </a>
      );
    }
    return (
      <button key={label} onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  };

  return (
    <SettingsCard
      icon={<Info className="h-6 w-6 text-accent" />}
      title="About"
      sub="App information and support."
    >
      <div className="flex flex-col gap-2">
        {row(<Layers className="h-4 w-4" />, "App Version", `v${pkg.version}`)}
        {row(<Mail className="h-4 w-4" />, "Send Feedback", "", undefined, feedbackHref)}
        {DOCS.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.key}>
              {row(<Icon className="h-4 w-4" />, d.title, "", () => setDoc(d))}
            </div>
          );
        })}
      </div>
      <Sheet open={!!doc} onClose={() => setDoc(null)} label={doc?.title ?? "Info"}>
        <h2 className="mb-2 text-base font-bold">{doc?.title}</h2>
        <ul className="flex flex-col gap-2">
          {doc?.body.map((p, i) => (
            <li key={i} className="text-sm leading-relaxed text-muted">
              {p}
            </li>
          ))}
        </ul>
      </Sheet>
    </SettingsCard>
  );
}
