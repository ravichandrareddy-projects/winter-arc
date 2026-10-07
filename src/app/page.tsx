"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { getHasSeenIntro, subscribeIntroState } from "@/lib/intro-storage";
import { useAuth } from "@/lib/auth";
import { useWinterArc } from "@/lib/store";
import { isStartTab } from "@/lib/navigation";

let entryRouteHandled = false;

export default function RootHomePage() {
  const hasSeenIntro = useSyncExternalStore(
    subscribeIntroState,
    getHasSeenIntro,
    () => false
  );
  const { status } = useAuth();
  const router = useRouter();
  const startTab = useWinterArc((state) => state.preferences.startTab);
  const dataMode = useWinterArc((state) => state.dataMode);
  useEffect(() => {
    if (entryRouteHandled || status === "loading" || (!hasSeenIntro && status !== "authenticated")) return;
    // The auth session is available before its account preferences finish loading.
    if (status === "authenticated" && dataMode !== "user") return;
    entryRouteHandled = true;
    const safeStartTab = isStartTab(startTab) ? startTab : "/";
    if (safeStartTab !== "/") router.replace(safeStartTab);
  }, [status, hasSeenIntro, startTab, dataMode, router]);

  // If user is authenticated OR continuing user who has entered the app before,
  // always fall back directly to the home dashboard (never forced into intro)
  if (status === "authenticated" || hasSeenIntro) {
    return <HomeDashboard />;
  }

  // If new visitor or logged out, show the official landing starting page
  return <LandingPage />;
}
