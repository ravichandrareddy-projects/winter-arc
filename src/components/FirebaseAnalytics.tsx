"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    // Initialize Firebase Analytics SDK in the browser
    void getFirebaseAnalytics();
  }, []);

  return null;
}
