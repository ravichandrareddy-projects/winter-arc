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
    default: "Winter Arc Tracker — Track Your Progress. See Yourself.",
    template: "%s — Winter Arc Tracker",
  },
  description:
    "Winter Arc Tracker is the ultimate 90-day self-discipline protocol app. Track your daily workouts, sleep, morning wake-up schedule, diet, habits, and body transformation. 100% private & on-device.",
  applicationName: "Winter Arc Tracker",
  authors: [{ name: "Winter Arc Tracker", url: CANONICAL_SITE_URL }],
  generator: "Next.js",
  keywords: [
    "winter arc tracker",
    "best winter arc tracker",
    "winter arc app",
    "winter arc",
    "winter arc 90 day challenge",
    "winter arc challenge",
    "winter arc protocol",
    "winter arc habit tracker",
    "winter arc discipline tracker",
    "winter arc routine app",
    "winter arc workout tracker",
    "winter arc sleep tracker",
    "winter arc wake up tracking",
    "free winter arc tracker",
    "best habit tracker for winter arc",
    "winter arc checklist",
    "winter arc transformation tracker",
    "90 day discipline protocol",
    "daily habit tracker app",
    "self improvement tracker",
    "fitness and nutrition tracker",
    "local first habit tracker",
  ],
  creator: "Winter Arc Tracker",
  publisher: "Winter Arc Tracker",
  category: "Health & Fitness, Productivity",
  classification: "Winter Arc Tracker & 90-Day Discipline Application",
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_SITE_URL,
    siteName: "Winter Arc Tracker",
    title: "Winter Arc Tracker — Track Your Progress. See Yourself.",
    description:
      "The best Winter Arc tracker for your 90-day discipline protocol. Track your sleep, workouts, nutrition, habits, and transformation. 100% on-device & private.",
    images: [
      {
        url: `${CANONICAL_SITE_URL}/logo-512.png`,
        width: 512,
        height: 512,
        alt: "Winter Arc Tracker Official Logo",
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
    title: "Winter Arc Tracker — Track Your Progress. See Yourself.",
    description:
      "The best Winter Arc tracker and 90-day discipline protocol app. Track workouts, sleep, wake-ups, nutrition, and streaks.",
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
        "Winter Arc 90-Day Challenge",
      ],
      description:
        "Winter Arc Tracker is the ultimate 90-day self-discipline protocol web app. Track daily workouts, sleep, wake time, and personal transformation.",
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
        "The best Winter Arc tracker and self-discipline web application. Designed to help users log, visualize, understand, and master their 90-day winter arc challenge.",
      featureList: [
        "Daily Habit & Non-Negotiable Tracker",
        "Circadian Sleep & Bedtime Consistency Tracking",
        "Early Sunrise Wake-Up Discipline Check-In",
        "Workout Splits, Weight Progression & Physique Milestone Photos",
        "Macro & Calorie Fuel Tracking",
        "Interactive 90-Day Consistency Trends & Streak Analytics",
        "100% On-Device Private Storage & One-Tap Local File Backup",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "184",
        bestRating: "5",
        worstRating: "1",
      },
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
          id="winterarc-extension-shield"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==='undefined')return;try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(regs){for(var i=0;i<regs.length;i++){regs[i].unregister();}});if('caches' in window){caches.keys().then(function(names){for(var k=0;k<names.length;k++){caches.delete(names[k]);}});}}var cleanAttr=function(){var els=document.querySelectorAll('[bis_skin_checked],[bis_use]');for(var i=0;i<els.length;i++){els[i].removeAttribute('bis_skin_checked');els[i].removeAttribute('bis_use');}};cleanAttr();if(window.MutationObserver){var observer=new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++){var t=mutations[i].target;if(t&&t.removeAttribute){if(t.hasAttribute&&t.hasAttribute('bis_skin_checked'))t.removeAttribute('bis_skin_checked');if(t.hasAttribute&&t.hasAttribute('bis_use'))t.removeAttribute('bis_use');}}});observer.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked','bis_use']});}var isExt=function(s){return s&&(s.indexOf('chrome-extension://')!==-1||s.indexOf('eppiocemhmnlbhjplcgkofciiegomcon')!==-1||s.indexOf('M_ID')!==-1||s.indexOf('bis_skin_checked')!==-1||s.indexOf('bis_use')!==-1||s.indexOf('executors/200.js')!==-1);};var origError=console.error;console.error=function(){var msg='';for(var i=0;i<arguments.length;i++){var a=arguments[i];msg+=' '+(a&&a.message?a.message:String(a));}if(isExt(msg)){return;}origError.apply(console,arguments);};window.addEventListener('error',function(e){var src=(e&&e.filename)||'';var msg=(e&&e.message)||'';if(isExt(src)||isExt(msg)){if(e.stopImmediatePropagation)e.stopImmediatePropagation();if(e.preventDefault)e.preventDefault();}},true);window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason;var msg=r&&(r.message||r.stack||String(r))||'';if(isExt(msg)){if(e.stopImmediatePropagation)e.stopImmediatePropagation();if(e.preventDefault)e.preventDefault();}},true);}catch(err){}})();`,
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
            <ClientOnly>{children}</ClientOnly>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
