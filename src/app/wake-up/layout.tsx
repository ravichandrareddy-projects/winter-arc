import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wake Up Tracking",
  description:
    "Log your daily wake-up times, monitor morning discipline streaks, and maintain a consistent early rising habit on Winter Arc.",
  alternates: {
    canonical: "https://winterarc.indevs.in/wake-up",
  },
  openGraph: {
    title: "Wake Up Tracking — Winter Arc",
    description:
      "Log your daily wake-up times, monitor morning discipline streaks, and maintain a consistent early rising habit on Winter Arc.",
    url: "https://winterarc.indevs.in/wake-up",
  },
};

export default function WakeUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
