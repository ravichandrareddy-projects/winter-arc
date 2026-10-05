"use client";

import { useRef, useState } from "react";
import { ChevronRight, Download, ShieldCheck, Trash2, Upload } from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { deletePhotoDB } from "@/lib/photos";
import { pushAll, wipeCloudData } from "@/lib/sync";
import { requireAuth } from "@/lib/auth-guard";
import { useWinterArc, type BackupData } from "@/lib/store";

function download(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Row({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left"
    >
      <span className={danger ? "text-red-500" : ""}>{icon}</span>
      <span className={`flex-1 text-sm font-semibold ${danger ? "text-red-500" : ""}`}>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted" />
    </button>
  );
}

export function DataCard() {
  const restoreAll = useWinterArc((s) => s.restoreAll);
  const wipeAll = useWinterArc((s) => s.wipeAll);
  const fileRef = useRef<HTMLInputElement>(null);
  const [armed, setArmed] = useState(false);
  const [msg, setMsg] = useState("");

  const backup = () => {
    const s = useWinterArc.getState();
    const data: BackupData = {
      arc: s.arc,
      profile: s.profile,
      trackers: s.trackers,
      entries: s.entries,
      photoMeta: s.photoMeta,
      meals: s.meals,
      nutritionTargets: s.nutritionTargets,
      preferences: s.preferences,
      reminders: s.reminders,
    };
    const stamp = new Date().toISOString().slice(0, 10);
    download(`winterarc-backup-${stamp}.json`, JSON.stringify({ app: "winterarc", version: 1, exportedAt: new Date().toISOString(), data }), "application/json");
    setMsg("Backup downloaded. Photo image files stay on this device and reconnect on restore.");
    setTimeout(() => setMsg(""), 4000);
  };

  const onRestoreFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      const data = (parsed?.data ?? parsed) as Partial<BackupData>;
      if (!Array.isArray(data.trackers)) throw new Error("bad file");
      const full: BackupData = {
        arc: data.arc ?? null,
        profile: data.profile ?? { name: "", email: "" },
        trackers: data.trackers,
        entries: data.entries ?? [],
        photoMeta: data.photoMeta ?? [],
        meals: data.meals ?? [],
        nutritionTargets: data.nutritionTargets ?? { calories: 2000, protein: 150, carbs: 220, fats: 70, fiber: 30 },
        preferences: data.preferences ?? { accent: "blue" as const, units: "metric" as const, startTab: "/" as const },
        reminders: data.reminders ?? {
          wakeUp: { time: "05:00", enabled: false },
          sleep: { time: "22:30", enabled: false },
          meal: { time: "08:00", enabled: false },
          workout: { time: "18:00", enabled: false },
          summary: { time: "21:00", enabled: false },
        },
      };
      requireAuth({
        route: "/settings",
        label: "Restore backup",
        replay: () => {
          restoreAll(full);
          const uid = useWinterArc.getState().ownerUid;
          if (uid) {
            void pushAll(uid, {
              arc: full.arc,
              profile: full.profile,
              trackers: full.trackers,
              entries: full.entries,
              meals: full.meals,
              photoMeta: full.photoMeta,
              targets: full.nutritionTargets,
              preferences: full.preferences,
              reminders: full.reminders,
            });
          }
          setMsg("Backup restored.");
        },
      });
    } catch {
      setMsg("That file isn't a Winter Arc backup.");
    }
    setTimeout(() => setMsg(""), 4000);
  };

  const exportCSV = () => {
    const s = useWinterArc.getState();
    const byId = Object.fromEntries(s.trackers.map((t) => [t.id, t]));
    const lines = ["date,tracker,type,value,target,unit"];
    for (const e of s.entries) {
      const t = byId[e.trackerId];
      lines.push(
        [e.date, `"${(t?.name ?? "?").replace(/"/g, '""')}"`, t?.type ?? "", String(e.value), e.targetSnapshot ?? "", e.unitSnapshot ?? ""].join(",")
      );
    }
    lines.push("");
    lines.push("date,meal,items,calories,protein,carbs,fats,fiber");
    for (const m of s.meals) {
      lines.push(
        [m.dateKey, `"${m.name.replace(/"/g, '""')}"`, `"${m.items.replace(/"/g, '""')}"`, m.calories, m.protein, m.carbs, m.fats, m.fiber].join(",")
      );
    }
    const stamp = new Date().toISOString().slice(0, 10);
    download(`winterarc-export-${stamp}.csv`, lines.join("\n"), "text/csv");
  };

  const wipe = async () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 5000);
      return;
    }
    requireAuth({
      route: "/settings",
      label: "Clear all data",
      replay: async () => {
        const uid = useWinterArc.getState().ownerUid;
        try {
          if (uid) await wipeCloudData(uid);
          await deletePhotoDB().catch(() => undefined);
          window.localStorage.removeItem("winterarc-v2");
        } finally {
          wipeAll();
          window.location.reload();
        }
      },
    });
  };

  return (
    <SettingsCard
      icon={<ShieldCheck className="h-6 w-6 text-accent" />}
      title="Data & Privacy"
      sub="Manage your data and privacy settings."
    >
      <div className="flex flex-col gap-2">
        <Row icon={<Upload className="h-4 w-4" />} label="Backup Data" onClick={backup} />
        <Row
          icon={<Download className="h-4 w-4" />}
          label="Restore Backup"
          onClick={() =>
            requireAuth({
              route: "/settings",
              label: "Restore backup",
              payload: { sheet: "restore" },
              replay: () => fileRef.current?.click(),
            })
          }
        />
        <Row icon={<Download className="h-4 w-4" />} label="Export Data (CSV)" onClick={exportCSV} />
        <Row
          icon={<Trash2 className="h-4 w-4" />}
          label={armed ? "Tap again to confirm wipe" : "Clear All Data"}
          danger
          onClick={wipe}
        />
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            onRestoreFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {msg && <p className="text-xs text-muted">{msg}</p>}
        <p className="text-xs text-muted">
          Everything lives on this device. Nothing is uploaded anywhere.
        </p>
      </div>
    </SettingsCard>
  );
}
