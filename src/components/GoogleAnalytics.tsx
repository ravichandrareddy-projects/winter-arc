"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const validMeasurementId = measurementId?.match(/^G-[A-Z0-9]+$/)?.[0] ?? null;

const ALLOWED_MARKETING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
  "ttclid",
  "msclkid",
  "twclid",
  "gad_source",
  "gbraid",
  "wbraid",
]);

function getAttributionLocation(pathname: string): string {
  if (typeof window === "undefined") return pathname;
  try {
    const current = new URL(window.location.href);
    const params = new URLSearchParams();
    for (const [key, value] of current.searchParams.entries()) {
      if (ALLOWED_MARKETING_PARAMS.has(key.toLowerCase())) {
        params.set(key, value);
      }
    }
    const query = params.toString();
    return `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
  } catch {
    return `${window.location.origin}${pathname}`;
  }
}

if (typeof window !== "undefined") {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const initialized = useRef(false);
  const previousLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!validMeasurementId || !pathname) return;

    // Queue the first view before the lazy-loaded tag arrives, including on slow connections.
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      // Google's command queue uses an Arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    const pageLocation = getAttributionLocation(pathname);
    if (!initialized.current) {
      window.gtag("js", new Date());
      window.gtag("config", validMeasurementId, {
        send_page_view: false,
        page_location: pageLocation,
        page_referrer: typeof document !== "undefined" ? document.referrer : "",
      });
      initialized.current = true;
    }

    if (previousLocation.current === pageLocation) return;
    // Send route names and marketing/ad attribution params (excluding sensitive parameters like email/token).
    window.gtag("event", "page_view", {
      send_to: validMeasurementId,
      page_location: pageLocation,
      page_title: document.title,
      page_referrer: previousLocation.current ?? (typeof document !== "undefined" ? document.referrer : ""),
    });
    previousLocation.current = pageLocation;
  }, [pathname]);

  if (!validMeasurementId) return null;

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
      strategy="afterInteractive"
      referrerPolicy="origin"
    />
  );
}

