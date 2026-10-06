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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
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
