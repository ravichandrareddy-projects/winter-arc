import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Tracking",
  description:
    "Track workouts, exercise routines, sets, reps, weight logs, and daily physical consistency on Winter Arc.",
  alternates: {
    canonical: "https://winterarc.indevs.in/fitness",
  },
  openGraph: {
    title: "Fitness Tracking — Winter Arc",
    description:
      "Track workouts, exercise routines, sets, reps, weight logs, and daily physical consistency on Winter Arc.",
    url: "https://winterarc.indevs.in/fitness",
  },
};

export default function FitnessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
