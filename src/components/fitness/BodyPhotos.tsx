"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Image as ImageIcon, ImagePlus, Plus, Trash2, Upload } from "lucide-react";
import { Sheet } from "../Sheet";
import { addDaysKey, arcDayNumber, formatNumber, monthDayShort, uid } from "@/lib/dates";
import { displayWeight, weightUnit } from "@/lib/units";
import { smoothPath, toRuns } from "@/lib/chart";
import { deletePhotoBlob, getPhotoBlob, putPhotoBlob } from "@/lib/photos";
import { downloadPhoto, removePhoto, uploadPhoto } from "@/lib/sync";
import { requireAuth } from "@/lib/auth-guard";
import { usePathname } from "next/navigation";
import {
  selectEntriesFor,
  useWinterArc,
  type PhotoMeta,
} from "@/lib/store";

type Angle = PhotoMeta["angle"];
const ANGLES: ("all" | Angle)[] = ["all", "front", "side", "back"];

function usePhotoUrls(ids: string[], owner: string | null) {
  const idsKey = JSON.stringify(ids);
  const key = `${owner ?? "local"}:${idsKey}`;
  const [result, setResult] = useState<{ key: string; urls: Record<string, string> }>({ key: "", urls: {} });
  useEffect(() => {
    let alive = true;
    const made: string[] = [];
    Promise.all(
      (JSON.parse(idsKey) as string[]).map((id) =>
        getPhotoBlob(id)
          .then((blob) => blob ?? (owner ? downloadPhoto(owner, id) : null))
          .then((blob) => {
            if (blob && alive) {
              const url = URL.createObjectURL(blob);
              made.push(url);
              return [id, url] as const;
            }
            return [id, ""] as const;
          })
          .catch(() => [id, ""] as const)
      )
    ).then((pairs) => { if (alive) setResult({ key, urls: Object.fromEntries(pairs) }); });
    return () => {
      alive = false;
      made.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [idsKey, owner, key]);
  return { urls: result.key === key ? result.urls : {}, loaded: result.key === key };
}

function weightOn(
  entries: Parameters<typeof selectEntriesFor>[0],
  weightId: string | null,
  dateKey: string
): number | null {
  if (!weightId) return null;
  const v = selectEntriesFor(entries, weightId, dateKey)[0]?.value;
  return typeof v === "number" ? v : null;
}

export function BodyPhotos() {
  const photoMeta = useWinterArc((s) => s.photoMeta);
  const trackers = useWinterArc((s) => s.trackers);
  const entries = useWinterArc((s) => s.entries);
  const arc = useWinterArc((s) => s.arc);
  const addPhotoMeta = useWinterArc((s) => s.addPhotoMeta);
  const deletePhotoMeta = useWinterArc((s) => s.deletePhotoMeta);
  const units = useWinterArc((s) => s.preferences.units);
  const ownerUid = useWinterArc((s) => s.ownerUid);
  const dataMode = useWinterArc((s) => s.dataMode);
  const wUnit = weightUnit(units);
  const pathname = usePathname();

  const [tab, setTab] = useState<(typeof ANGLES)[number]>("all");
  const [latestFirst, setLatestFirst] = useState(true);
  const [photoDate, setPhotoDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [pending, setPending] = useState<{ blob: Blob; url: string } | null>(null);
  const [pendingAngle, setPendingAngle] = useState<Angle>("front");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const weightId = useMemo(
    () =>
      trackers.find((t) => t.name.toLowerCase() === "weight" && t.status !== "archived")?.id ??
      null,
    [trackers]
  );

  const visible = useMemo(() => {
    const list = photoMeta.filter((p) => tab === "all" || p.angle === tab);
    return [...list].sort((a, b) =>
      latestFirst ? (a.dateKey < b.dateKey ? 1 : -1) : a.dateKey < b.dateKey ? -1 : 1
    );
  }, [photoMeta, tab, latestFirst]);

  const { urls, loaded } = usePhotoUrls(
    visible.map((p) => p.id),
    ownerUid
  );
  useEffect(() => () => { if (pending) URL.revokeObjectURL(pending.url); }, [pending]);

  const pickFile = (ref: React.RefObject<HTMLInputElement | null>) =>
    requireAuth({
      route: pathname,
      label: "Add Photo",
      payload: { sheet: "photo" },
      replay: () => ref.current?.click(),
    });

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!allowed.includes(f.type.toLowerCase())) { setError("Choose a JPG, PNG, WebP, or HEIC image."); return; }
    if (f.size > 15 * 1024 * 1024) { setError("Photos must be 15MB or smaller."); return; }
    setError("");
    if (pending) URL.revokeObjectURL(pending.url);
    setPending({ blob: f, url: URL.createObjectURL(f) });
    setPendingAngle("front");
  };

  const savePending = async () => {
    if (!pending || saving) return;
    setSaving(true);
    setError("");
    try {
      const id = uid();
      await putPhotoBlob(id, pending.blob);
      addPhotoMeta(photoDate, pendingAngle, id);
      if (ownerUid) await uploadPhoto(ownerUid, id, pending.blob);
      setPending(null);
    } catch {
      setError("Couldn't save the photo. Check available device storage and try again.");
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    const doRemove = async () => {
      deletePhotoMeta(id);
      await deletePhotoBlob(id).catch(() => undefined);
      if (ownerUid) await removePhoto(ownerUid, id);
    };
    requireAuth({ route: pathname, label: "Delete Photo", payload: {}, replay: () => void doRemove() });
  };

  // transformation timeline: 30-day weight curve + photo thumbs at their dates
  const anchorDate = photoDate;
  const curveDays = useMemo(
    () => Array.from({ length: 30 }, (_, i) => addDaysKey(anchorDate, i - 29)),
    [anchorDate]
  );
  const curveValues = useMemo(
    () =>
      curveDays.map((d) => {
        if (!weightId) return null;
        const v = selectEntriesFor(entries, weightId, d)[0]?.value;
        return typeof v === "number" ? +v.toFixed(1) : null;
      }),
    [curveDays, entries, weightId]
  );
  const { runs } = toRuns(curveValues, 100, 30);

  return (
    <div className="flex flex-col gap-4">
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      {/* add row */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-bold">Add Photo</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => pickFile(cameraRef)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-foreground/25 px-2 py-5 transition-colors hover:border-accent"
          >
            <Camera className="h-6 w-6 text-indigo-400" />
            <span className="text-xs font-bold">Take Photo</span>
            <span className="text-[11px] text-muted">Use your camera</span>
          </button>
          <button
            onClick={() => pickFile(uploadRef)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-foreground/25 px-2 py-5 transition-colors hover:border-accent"
          >
            <ImagePlus className="h-6 w-6 text-indigo-400" />
            <span className="text-xs font-bold">Upload from Device</span>
            <span className="text-[11px] text-muted">JPG, PNG, HEIC</span>
          </button>
          <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border border-dashed border-foreground/25 px-2 py-5 transition-colors hover:border-accent">
            <Plus className="h-6 w-6 text-indigo-400" />
            <span className="text-xs font-bold">Select Date</span>
            <input
              type="date"
              value={photoDate}
              onChange={(e) => e.target.value && setPhotoDate(e.target.value)}
              className="w-full bg-transparent text-center text-[11px] text-muted"
            />
          </label>
        </div>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      {/* tabs + sort */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-bold">Your Photos</p>
          <button
            onClick={() => setLatestFirst((v) => !v)}
            className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted"
          >
            {latestFirst ? "Latest First ▾" : "Oldest First ▾"}
          </button>
        </div>
        <div className="mb-3 flex gap-1 rounded-xl bg-card-2 p-1">
          {ANGLES.map((a) => (
            <button
              key={a}
              onClick={() => setTab(a)}
              aria-pressed={tab === a}
              className={`h-9 flex-1 rounded-lg text-xs font-bold capitalize ${
                tab === a ? "bg-accent text-white" : "text-muted"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          dataMode === "demo" ? (
            <div className="grid grid-cols-3 gap-3">
              {["Front", "Side", "Back"].map((a) => (
                <div key={a} className="overflow-hidden rounded-2xl border border-dashed border-foreground/25">
                  <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-card-2 to-card text-muted">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px] font-bold">{a}</span>
                    <span className="rounded-full border border-dashed border-accent px-2 py-0.5 text-[9px] font-extrabold tracking-widest text-accent">
                      DEMO
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted">
              No photos yet — take or upload your first one above.
            </p>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative">
                  <button onClick={() => setLightbox(p.id)} className="block w-full" aria-label={`Open photo ${p.dateKey}`}>
                    {urls[p.id] ? (
                      <img src={urls[p.id]} alt={`${p.angle} ${p.dateKey}`} className="aspect-[3/4] w-full object-cover" />
                    ) : (
                      <div className="flex aspect-[3/4] w-full items-center justify-center bg-card-2 p-4 text-xs text-muted">
                        {loaded ? "Photo file unavailable — restore a photo-inclusive backup." : "Loading photo…"}
                      </div>
                    )}
                  </button>
                  <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold capitalize text-white backdrop-blur-sm">
                    {p.angle}
                  </span>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Delete photo ${p.dateKey}`}
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[13px] font-extrabold">
                    {arc ? `Day ${arcDayNumber(arc.startDate, p.dateKey)}` : p.dateKey}
                  </p>
                  <p className="text-xs text-muted">
                    {monthDayShort(p.dateKey)}
                    {(() => {
                      const w = weightOn(entries, weightId, p.dateKey);
                      return w != null ? (
                        <span className="font-bold text-foreground"> · {formatNumber(displayWeight(w, units))} {wUnit}</span>
                      ) : (
                        ""
                      );
                    })()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* transformation timeline */}
      {visible.length > 0 && (
        <div className="rounded-2xl border border-violet-400/30 bg-card p-4">
          <p className="mb-2 text-sm font-bold text-violet-300">Transformation Timeline</p>
          <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="h-20 w-full" aria-hidden="true">
            {runs.map((run, ri) => (
              <path
                key={ri}
                d={smoothPath(run)}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {runs.flatMap((run, ri) =>
              run.map((pt, pi) => <circle key={`${ri}-${pi}`} cx={pt.x} cy={pt.y} r="1.8" fill="#a78bfa" />)
            )}
          </svg>
          <div className="nice-scroll mt-1 flex gap-1.5 overflow-x-auto">
            {visible.map((p) =>
              urls[p.id] ? (
                <img
                  key={p.id}
                  src={urls[p.id]}
                  alt=""
                  className="h-12 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : null
            )}
          </div>
        </div>
      )}

      {/* pending sheet */}
      <Sheet open={!!pending} onClose={() => setPending(null)} label="Tag photo">
        <h2 className="mb-3 text-base font-bold">Tag this photo</h2>
        {pending && (
          <img src={pending.url} alt="Preview" className="mx-auto max-h-64 rounded-2xl object-contain" />
        )}
        <p className="mb-1 mt-3 text-sm font-semibold">Angle</p>
        <div className="flex gap-1 rounded-xl bg-card-2 p-1">
          {(["front", "side", "back"] as Angle[]).map((a) => (
            <button
              key={a}
              onClick={() => setPendingAngle(a)}
              aria-pressed={pendingAngle === a}
              className={`h-10 flex-1 rounded-lg text-sm font-bold capitalize ${
                pendingAngle === a ? "bg-accent text-white" : "text-muted"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="mb-1 mt-3 text-sm font-semibold">Date</p>
        <input
          type="date"
          value={photoDate}
          onChange={(e) => e.target.value && setPhotoDate(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-background px-4"
        />
        <button
          onClick={savePending}
          disabled={saving}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background"
        >
          <Upload className="h-4 w-4" /> {saving ? "SAVING…" : "SAVE PHOTO"}
        </button>
      </Sheet>

      {/* lightbox */}
      <Sheet open={!!lightbox} onClose={() => setLightbox(null)} label="Photo">
        {lightbox && urls[lightbox] && (
          <img src={urls[lightbox]} alt="Body progress" className="max-h-[70vh] w-full rounded-2xl object-contain" />
        )}
      </Sheet>
    </div>
  );
}
