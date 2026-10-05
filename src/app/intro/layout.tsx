import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Winter Arc",
  description:
    "An introduction to the Winter Arc 90-day discipline protocol: Log daily, see your trend, understand your habits, and build unshakeable focus.",
  alternates: {
    canonical: "https://winterarc.indevs.in/intro",
  },
  openGraph: {
    title: "Welcome to Winter Arc",
    description:
      "An introduction to the Winter Arc 90-day discipline protocol: Log daily, see your trend, understand your habits, and build unshakeable focus.",
    url: "https://winterarc.indevs.in/intro",
  },
};

export default function IntroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
