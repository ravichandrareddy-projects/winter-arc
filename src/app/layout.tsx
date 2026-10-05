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

const CANONICAL_SITE_URL = "https://winterarc.indevs.in";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: "Winter Arc — Track Your Progress. See Your Arc.",
    template: "%s — Winter Arc",
  },
  description:
    "Winter Arc is a personal progress tracking system for recording daily habits, viewing trends, and understanding personal progress over time. Log daily, see the trend, master consistency.",
  applicationName: "Winter Arc",
  authors: [{ name: "Winter Arc", url: CANONICAL_SITE_URL }],
  generator: "Next.js",
  keywords: [
    "Winter Arc",
    "Winter Arc Tracker",
    "Habit Tracker",
    "Progress Tracking",
    "Daily Routine",
    "Sleep Tracking",
    "Wake Up Tracking",
    "Fitness Tracking",
    "Food Tracking",
    "Consistency Tracker",
    "Self Improvement",
    "Discipline Protocol",
  ],
  creator: "Winter Arc",
  publisher: "Winter Arc",
  category: "Productivity & Health",
  classification: "Personal Progress Tracking Application",
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_SITE_URL,
    siteName: "Winter Arc",
    title: "Winter Arc — Track Your Progress. See Your Arc.",
    description:
      "A personal progress tracking system for recording daily habits, viewing trends, and understanding personal progress over time.",
    images: [
      {
        url: `${CANONICAL_SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Winter Arc — Track Your Progress. See Your Arc.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winter Arc — Track Your Progress. See Your Arc.",
    description:
      "Record daily habits, view trends, and understand your personal progress over time.",
    images: [`${CANONICAL_SITE_URL}/opengraph-image`],
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
      "@type": "WebSite",
      "@id": `${CANONICAL_SITE_URL}/#website`,
      url: CANONICAL_SITE_URL,
      name: "Winter Arc",
      description:
        "Personal progress tracking system for recording daily habits, viewing trends, and understanding personal progress over time.",
      publisher: {
        "@id": `${CANONICAL_SITE_URL}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${CANONICAL_SITE_URL}/#organization`,
      name: "Winter Arc",
      url: CANONICAL_SITE_URL,
      logo: `${CANONICAL_SITE_URL}/icon.svg`,
    },
    {
      "@type": "WebApplication",
      "@id": `${CANONICAL_SITE_URL}/#app`,
      name: "Winter Arc",
      url: CANONICAL_SITE_URL,
      applicationCategory: "ProductivityApplication, HealthApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Modern evergreen browsers supported.",
      description:
        "A personal progress tracking web application designed to help users log, visualize, understand, and improve their daily habits and personal progress over time.",
      featureList: [
        "Daily Habit & Target Tracking",
        "Sleep Schedule & Target Bedtime Logging",
        "Morning Wake-Up Consistency Tracking",
        "Fitness Workout Split & Exercise Log",
        "Food & Nutrition Intake Summary",
        "Progress Trends & 90-Day Consistency Heatmaps",
        "Local-First Privacy Architecture & Cloud Sync",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link rel="describedby" href={`${CANONICAL_SITE_URL}/llms.txt`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${geistMono.variable} min-h-full bg-background font-sans text-foreground antialiased`}
      >
        <div aria-hidden="true" className="app-bg" suppressHydrationWarning />
        <ThemeProvider>
          <AuthProvider>
            <ClientOnly>{children}</ClientOnly>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
