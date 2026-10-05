"use client";

import {
  Activity,
  AlarmClock,
  Beef,
  Bike,
  BookOpen,
  Droplet,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Leaf,
  Moon,
  Scale,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import type { TrackerIcon } from "@/lib/types";

const MAP: Record<TrackerIcon, typeof Droplet> = {
  droplet: Droplet,
  beef: Beef,
  footprints: Footprints,
  dumbbell: Dumbbell,
  book: BookOpen,
  moon: Moon,
  sun: Sun,
  utensils: UtensilsCrossed,
  leaf: Leaf,
  alarm: AlarmClock,
  bike: Bike,
  scale: Scale,
  flame: Flame,
  activity: Activity,
  heart: Heart,
};

export function TrackerGlyph({
  icon,
  className,
  style,
}: {
  icon: TrackerIcon;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Cmp = MAP[icon] ?? Heart;
  return <Cmp className={className} style={style} />;
}

/** Rounded icon tile in the tracker's own color (Image 2 style). */
export function TrackerBadge({
  icon,
  color,
  size = "md",
}: {
  icon: TrackerIcon;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const glyph = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl ${dims}`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      <TrackerGlyph icon={icon} className={glyph} />
    </span>
  );
}

export const ICON_OPTIONS: TrackerIcon[] = [
  "droplet",
  "beef",
  "footprints",
  "dumbbell",
  "book",
  "moon",
  "sun",
  "utensils",
  "leaf",
  "alarm",
  "bike",
  "scale",
  "flame",
  "activity",
  "heart",
];
