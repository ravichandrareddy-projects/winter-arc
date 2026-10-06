"use client";

import { useSyncExternalStore } from "react";
import LandingPage from "@/components/landing/LandingPage";
import { HomeDashboard } from "@/components/home/HomeDashboard";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSeenSnapshot() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("wa-seen-intro") === "1";
}

function getServerSnapshot() {
  return false;
}

export default function RootHomePage() {
  const hasSeenIntro = useSyncExternalStore(subscribe, getSeenSnapshot, getServerSnapshot);

  // If returning user has already completed intro/onboarding, render dashboard
  if (hasSeenIntro) {
    return <HomeDashboard />;
  }

  // Completely new visitor sees the official Winter Arc landing page
  return <LandingPage />;
}
