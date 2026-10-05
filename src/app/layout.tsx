import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth";
import { ClientOnly } from "@/components/ClientOnly";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://winterarc.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Winter Arc — 90-Day Discipline & Self-Mastery Protocol | Habit & Fitness Tracker",
    template: "%s | Winter Arc — 90-Day Discipline Protocol",
  },
  description:
    "Lock in for 90 days. Winter Arc is the free, privacy-first discipline protocol tracker featuring daily sleep windows, 5 AM wake-ups, workout splits, macro nutrition, and an unshakeable 90-day progress heatmap. Add once, log daily, master your life.",
  applicationName: "Winter Arc Protocol",
  authors: [{ name: "Winter Arc Protocol Team", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "Winter Arc",
    "Winter Arc Challenge",
    "Winter Arc Tracker",
    "Winter Arc Rules",
    "Winter Arc 90 Days",
    "Winter Arc Workout Plan",
    "Winter Arc Habits",
    "Winter Arc Routine",
    "90 Day Challenge",
    "Discipline Protocol",
    "Habit Tracker",
    "Fitness Tracker",
    "Workout Log",
    "Sleep Tracker",
    "5 AM Wake Up Challenge",
    "Nutrition Tracker",
    "Macro Tracker",
    "Self Improvement",
    "Mental Toughness",
    "Dopamine Detox",
  ],
  creator: "Winter Arc",
  publisher: "Winter Arc",
  category: "Health, Fitness & Productivity",
  classification: "Health & Fitness Protocol Application",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Winter Arc",
    title: "Winter Arc — 90-Day Discipline & Self-Mastery Protocol",
    description:
      "Transform your mind, physique, and habits in 90 days. Track sleep, 5 AM wake-up, workouts, macros, and consistency with live progression heatmaps.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Winter Arc — 90-Day Discipline & Self-Mastery Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winter Arc — 90-Day Discipline Protocol",
    description:
      "Transform your physique, sleep, and discipline in 90 days with Winter Arc. Free habit and fitness tracker.",
    images: ["/opengraph-image"],
    creator: "@WinterArcApp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Winter Arc",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6F8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F14" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "Winter Arc",
      alternateName: "Winter Arc 90-Day Discipline Protocol",
      url: siteUrl,
      applicationCategory: "HealthApplication, LifestyleApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Modern evergreen browsers supported.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "The ultimate 90-day discipline and self-mastery tracker. Track workouts, sleep windows, 5 AM wake-ups, nutrition macros, and habit consistency.",
      featureList: [
        "90-Day Real Progress Heatmap & Phase Analytics",
        "Sleep Window & Sleep Target Tracking",
        "5 AM Wake-Up Consistency Grid",
        "Workout Split, Exercises & Reps Log",
        "Macro & Calorie Nutrition Summary",
        "Body Progress Photo Journal",
        "Offline-Ready Local Storage & Cloud Sync",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the Winter Arc challenge?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Winter Arc is a 90-day period of intense self-improvement, focus, and discipline. Participants dedicate 90 days to eliminating distractions, optimizing sleep and early wake-ups, training hard in the gym, maintaining strict nutrition, and tracking daily progress.",
          },
        },
        {
          "@type": "Question",
          name: "How many days is the Winter Arc protocol?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Winter Arc protocol lasts exactly 90 days. It is split into 3 phases: Phase 1 (Foundation - Days 1 to 30), Phase 2 (Momentum - Days 31 to 60), and Phase 3 (Mastery - Days 61 to 90).",
          },
        },
        {
          "@type": "Question",
          name: "What are the core rules of Winter Arc?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The core rules are: 1) Fixed sleep and early wake-up window (e.g. 5:00 AM), 2) Daily physical training (strength or cardio), 3) Clean nutrition with daily protein and calorie goals, 4) Daily hydration (3-4L water), and 5) Daily habit logging to maintain a continuous streak.",
          },
        },
        {
          "@type": "Question",
          name: "Is Winter Arc free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Winter Arc is 100% free to use. You can track your habits as a guest on your local device or create a free account to sync your 90-day journey across multiple devices.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${geistMono.variable} min-h-full bg-background font-sans text-foreground antialiased`}
      >
        <div aria-hidden="true" className="app-bg" />
        <ThemeProvider>
          <AuthProvider>
            <ClientOnly>{children}</ClientOnly>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
