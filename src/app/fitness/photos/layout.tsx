import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transformation",
  description:
    "Track your visual progress, body measurements, and physical transformation across your 90-day Winter Arc.",
  alternates: {
    canonical: "https://winterarc.indevs.in/fitness/photos",
  },
  openGraph: {
    title: "Transformation — Winter Arc",
    description:
      "Track your visual progress, body measurements, and physical transformation across your 90-day Winter Arc.",
    url: "https://winterarc.indevs.in/fitness/photos",
  },
};

export default function TransformationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
