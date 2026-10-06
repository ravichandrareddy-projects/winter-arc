"use client";

import { useSyncExternalStore } from "react";
import LandingPage from "@/components/landing/LandingPage";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { getHasSeenIntro, subscribeIntroState } from "@/lib/intro-storage";
import { useAuth } from "@/lib/auth";

export default function RootHomePage() {
  const hasSeenIntro = useSyncExternalStore(
    subscribeIntroState,
    getHasSeenIntro,
    () => false
  );
  const { status } = useAuth();

  // If user is authenticated OR continuing user who has entered the app before,
  // always fall back directly to the home dashboard (never forced into intro)
  if (status === "authenticated" || hasSeenIntro) {
    return <HomeDashboard />;
  }

  // If new visitor or logged out, show the official landing starting page
  return <LandingPage />;
}
