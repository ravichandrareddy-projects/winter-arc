import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Customize your Winter Arc dates, active habit trackers, reminders, appearance themes, and secure data export.",
  alternates: {
    canonical: "https://winterarc.indevs.in/settings",
  },
  openGraph: {
    title: "Settings — Winter Arc",
    description:
      "Customize your Winter Arc dates, active habit trackers, reminders, appearance themes, and secure data export.",
    url: "https://winterarc.indevs.in/settings",
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
