"use client";

import { useRef, useState } from "react";
import { ChevronRight, Download, ShieldCheck, Trash2, Upload } from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { deletePhotoDB, getPhotoBlob, isSafePhotoId, photoDataUrl, restorePhotoBlobs, type PhotoBackup } from "@/lib/photos";
import { downloadPhoto, pushAll, uploadPhoto, wipeCloudData } from "@/lib/sync";
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
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left disabled:opacity-50"
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
  const [busy, setBusy] = useState(false);

  const backup = async () => {
    setBusy(true);
    setMsg("");
    try {
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
      const photos: PhotoBackup[] = [];
      let missing = 0;
      for (const meta of s.photoMeta) {
        const blob = await getPhotoBlob(meta.id) ?? (s.ownerUid ? await downloadPhoto(s.ownerUid, meta.id) : null);
        if (blob) photos.push({ id: meta.id, dataUrl: await photoDataUrl(blob) });
        else missing++;
      }
      const stamp = new Date().toISOString().slice(0, 10);
      download(`winterarc-backup-${stamp}.json`, JSON.stringify({ app: "winterarc", version: 2, exportedAt: new Date().toISOString(), data, photos }), "application/json");
      setMsg(missing ? `Backup downloaded with ${photos.length} photo files. ${missing} photo files were unavailable on this device.` : `Complete backup downloaded, including ${photos.length} photo files.`);
    } catch {
      setMsg("Couldn't create the backup. Please try again.");
    } finally { setBusy(false); }
  };

  function sanitizeCSVField(val: unknown): string {
    let str = String(val ?? "");
    // Escape spreadsheet formula triggers in user-entered fields.
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str.replace(/"/g, '""')}"`;
  }

  const onRestoreFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      if (f.size > 100 * 1024 * 1024) {
        setMsg("Backup file exceeds maximum allowed size (100MB).");
        return;
      }
      const rawText = await f.text();
      const parsed = JSON.parse(rawText);
      if (parsed.app && (parsed.app !== "winterarc" || ![1, 2].includes(parsed.version))) throw new Error("bad file");
      const photos: PhotoBackup[] = parsed.photos ?? [];
      if (!Array.isArray(photos) || photos.length > 1000) throw new Error("bad photos");
      const data = (parsed?.data ?? parsed) as Partial<BackupData>;
      if (!Array.isArray(data.trackers)) throw new Error("bad file");
      const full: BackupData = {
        arc: data.arc ?? null,
        profile: {
          name: String(data.profile?.name ?? "").slice(0, 50),
          email: String(data.profile?.email ?? "").slice(0, 100),
        },
        trackers: data.trackers.slice(0, 100),
        entries: Array.isArray(data.entries) ? data.entries.slice(0, 20000) : [],
        photoMeta: Array.isArray(data.photoMeta)
          ? data.photoMeta.filter((meta) => isSafePhotoId(meta?.id)).slice(0, 1000)
          : [],
        meals: Array.isArray(data.meals) ? data.meals.slice(0, 5000) : [],
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
          void (async () => {
            setBusy(true);
            try {
              await restorePhotoBlobs(photos);
              restoreAll(full);
              const uid = useWinterArc.getState().ownerUid;
              if (uid) {
                const restored = useWinterArc.getState();
                await pushAll(uid, {
                  arc: restored.arc,
                  profile: restored.profile,
                  trackers: restored.trackers,
                  entries: restored.entries,
                  meals: restored.meals,
                  photoMeta: restored.photoMeta,
                  targets: restored.nutritionTargets,
                  preferences: restored.preferences,
                  reminders: restored.reminders,
                });
                for (const photo of photos) {
                  const blob = await getPhotoBlob(photo.id);
                  if (blob) await uploadPhoto(uid, photo.id, blob);
                }
              }
              const missing = (await Promise.all(full.photoMeta.map((meta) => getPhotoBlob(meta.id)))).filter((blob) => !blob).length;
              setMsg(missing ? `Backup restored. ${missing} photo files are missing from this older backup; import their originals to recover them.` : "Backup restored, including photo files.");
            } catch {
              setMsg("Couldn't restore this backup. Check the file and available device storage.");
            } finally { setBusy(false); }
          })();
        },
      });
    } catch {
      setMsg("That file isn't a valid Winter Arc backup.");
    }
  };

  const exportCSV = () => {
    const s = useWinterArc.getState();
    const byId = Object.fromEntries(s.trackers.map((t) => [t.id, t]));
    const lines = ["date,tracker,type,value,target,unit"];
    for (const e of s.entries) {
      const t = byId[e.trackerId];
      lines.push(
        [
          sanitizeCSVField(e.date),
          sanitizeCSVField(t?.name ?? "?"),
          sanitizeCSVField(t?.type ?? ""),
          sanitizeCSVField(e.value),
          sanitizeCSVField(e.targetSnapshot ?? ""),
          sanitizeCSVField(e.unitSnapshot ?? "")
        ].join(",")
      );
    }
    lines.push("");
    lines.push("date,meal,items,calories,protein,carbs,fats,fiber");
    for (const m of s.meals) {
      lines.push(
        [
          sanitizeCSVField(m.dateKey),
          sanitizeCSVField(m.name),
          sanitizeCSVField(m.items),
          sanitizeCSVField(m.calories),
          sanitizeCSVField(m.protein),
          sanitizeCSVField(m.carbs),
          sanitizeCSVField(m.fats),
          sanitizeCSVField(m.fiber)
        ].join(",")
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
    const uid = useWinterArc.getState().ownerUid;
    setBusy(true);
    try {
      if (uid) await wipeCloudData(uid);
      await deletePhotoDB();
      wipeAll();
      if (uid) {
        const fresh = useWinterArc.getState();
        await pushAll(uid, {
          arc: fresh.arc, profile: fresh.profile, trackers: fresh.trackers,
          entries: fresh.entries, meals: fresh.meals, photoMeta: fresh.photoMeta,
          targets: fresh.nutritionTargets, preferences: fresh.preferences, reminders: fresh.reminders,
        });
      }
      window.localStorage.setItem("wa-guest", "1");
      setArmed(false);
      setMsg("All tracking entries, meals, and photos cleared. Your starter goals are ready for a fresh arc.");
    } catch {
      setMsg("Couldn't clear all data. Close other Winter Arc tabs and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsCard
      icon={<ShieldCheck className="h-6 w-6 text-accent" />}
      title="Data & Privacy"
      sub="Manage your data and privacy settings."
    >
      <div className="flex flex-col gap-2.5">
        {/* On-device privacy callout */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>100% On-Device Mobile Storage</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-300/80">
            All your habits, streaks, sleep data, and photos strictly live in your device&apos;s local storage. We collect zero tracking data.
          </p>
        </div>

        <Row icon={<Upload className="h-4 w-4" />} label="Save Backup File to Device (.json)" onClick={() => void backup()} disabled={busy} />
        <Row
          icon={<Download className="h-4 w-4" />}
          label="Restore from Backup File (.json)"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        />
        <Row icon={<Download className="h-4 w-4" />} label="Export Data (CSV)" onClick={exportCSV} disabled={busy} />
        <Row
          icon={<Trash2 className="h-4 w-4" />}
          label={armed ? "Tap again to confirm wipe" : "Clear All Local Data"}
          danger
          onClick={wipe}
          disabled={busy}
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
        {busy && <p role="status" className="text-xs text-muted">Processing your data…</p>}
        {msg && <p role="status" className="text-xs text-muted">{msg}</p>}
        <p className="text-[11px] text-muted">
          JSON backups include your logs, settings, and photo files for recovery on another device. CSV exports contain tracking and nutrition records.
        </p>
      </div>
    </SettingsCard>
  );
}
