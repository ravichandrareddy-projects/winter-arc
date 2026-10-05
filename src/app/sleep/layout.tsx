import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep Tracking",
  description:
    "Record daily sleep hours, bedtime consistency, and track your sleep target window across the 90-day Winter Arc.",
  alternates: {
    canonical: "https://winterarc.indevs.in/sleep",
  },
  openGraph: {
    title: "Sleep Tracking — Winter Arc",
    description:
      "Record daily sleep hours, bedtime consistency, and track your sleep target window across the 90-day Winter Arc.",
    url: "https://winterarc.indevs.in/sleep",
  },
};

export default function SleepLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
