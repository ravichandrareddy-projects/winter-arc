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

export const metadata: Metadata = {
  title: "Winter Arc — Discipline Builds Freedom",
  description: "Add once. Log daily. See the trend.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Winter Arc" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6F8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F14" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
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
