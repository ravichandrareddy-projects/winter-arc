import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
    default: "Winter Arc Tracker — Track Your Goals, Habits & Progress",
    template: "%s — Winter Arc Tracker",
  },
  description:
    "Track your Winter Arc with daily goals, sleep, wake time, fitness, food, habits, and progress. See your consistency, understand your trends, and build your arc.",
  applicationName: "Winter Arc Tracker",
  authors: [{ name: "Winter Arc Tracker", url: CANONICAL_SITE_URL }],
  generator: "Next.js",
  keywords: [
    "winter arc tracker",
    "winter arc challenge tracker",
    "winter arc tracker website",
    "winter arc app",
    "winter arc tracking app",
    "winter arc planner",
    "winter arc habit tracker",
    "winter arc progress tracker",
    "winter arc challenge app",
    "winter arc routine tracker",
    "winter arc productivity tracker",
    "winter arc fitness tracker",
    "track my winter arc",
    "how to track winter arc",
    "winter arc challenge",
    "winter arc goals",
    "winter arc routine",
    "winter arc progress",
    "winter arc habits",
    "personal progress tracker",
    "habit and progress tracker",
    "daily habit tracker",
    "self improvement tracker",
    "daily discipline tracker",
  ],
  creator: "Winter Arc Tracker",
  publisher: "Winter Arc Tracker",
  category: "Health & Fitness, Productivity",
  classification: "Winter Arc Tracker & Progress Application",
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_SITE_URL,
    siteName: "Winter Arc Tracker",
    title: "Winter Arc Tracker — Track Your Goals, Habits & Progress",
    description:
      "Track your Winter Arc with daily goals, sleep, wake time, fitness, food, habits, and progress. See your consistency, understand your trends, and build your arc.",
    images: [
      {
        url: `${CANONICAL_SITE_URL}/logo-512.png`,
        width: 512,
        height: 512,
        alt: "Winter Arc Tracker Logo",
      },
      {
        url: `${CANONICAL_SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Winter Arc Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winter Arc Tracker — Track Your Goals, Habits & Progress",
    description:
      "Track your Winter Arc with daily goals, sleep, wake time, fitness, food, habits, and progress. See your consistency, understand your trends, and build your arc.",
    images: [`${CANONICAL_SITE_URL}/logo-512.png`],
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
    title: "Winter Arc Tracker",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
      name: "Winter Arc Tracker",
      alternateName: [
        "Winter Arc",
        "Winter Arc App",
        "WinterArc Tracker",
        "Winter Arc Challenge Tracker",
      ],
      description:
        "Winter Arc Tracker is a personal progress system for tracking habits, sleep, wake time, fitness, food, goals, consistency, and long-term progress.",
      publisher: {
        "@id": `${CANONICAL_SITE_URL}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${CANONICAL_SITE_URL}/#organization`,
      name: "Winter Arc Tracker",
      url: CANONICAL_SITE_URL,
      logo: `${CANONICAL_SITE_URL}/logo-512.png`,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${CANONICAL_SITE_URL}/#app`,
      name: "Winter Arc Tracker",
      alternateName: "Winter Arc App",
      url: CANONICAL_SITE_URL,
      image: `${CANONICAL_SITE_URL}/logo-512.png`,
      applicationCategory: "HealthApplication, ProductivityApplication",
      operatingSystem: "All, iOS, Android, Web",
      browserRequirements: "Requires modern web browser with JavaScript enabled.",
      description:
        "Personal progress tracking web application for recording daily habits, viewing trends, and understanding personal progress over time.",
      featureList: [
        "Daily Habit & Target Tracking",
        "Circadian Sleep & Bedtime Consistency Tracking",
        "Morning Wake-Up Consistency Tracking",
        "Workout Splits, Weight Progression & Physique Milestone Photos",
        "Macro & Calorie Fuel Tracking",
        "Interactive 90-Day Consistency Trends & Streak Analytics",
        "100% On-Device Private Storage & One-Tap Local File Backup",
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
    <html lang="en" suppressHydrationWarning className="dark h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo-512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="describedby" href={`${CANONICAL_SITE_URL}/llms.txt`} />
        <script
          id="winterarc-theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('winterarc-theme')||'dark';var d=t==='system'?matchMedia('(prefers-color-scheme: dark)').matches:t!=='light';document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
        <script
          id="winterarc-jsonld"
          type="application/ld+json"
          suppressHydrationWarning
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
            {children}
          </AuthProvider>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
