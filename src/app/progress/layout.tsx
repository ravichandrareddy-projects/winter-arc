import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress & Trends",
  description:
    "View your complete 90-day consistency heatmap, completion percentages, phase progression, and long-term discipline trends on Winter Arc.",
  alternates: {
    canonical: "https://winterarc.indevs.in/progress",
  },
  openGraph: {
    title: "Progress & Trends — Winter Arc",
    description:
      "View your complete 90-day consistency heatmap, completion percentages, phase progression, and long-term discipline trends on Winter Arc.",
    url: "https://winterarc.indevs.in/progress",
  },
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
