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
    const pageLocation = `${window.location.origin}${pathname}`;
    if (!initialized.current) {
      window.gtag("js", new Date());
      window.gtag("config", validMeasurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: pageLocation,
        page_referrer: "",
      });
      initialized.current = true;
    }

    if (previousLocation.current === pageLocation) return;
    // Send route names only: URL queries/fragments can contain email addresses or auth tokens.
    window.gtag("event", "page_view", {
      send_to: validMeasurementId,
      page_location: pageLocation,
      page_title: document.title,
      page_referrer: previousLocation.current || "",
    });
    previousLocation.current = pageLocation;
  }, [pathname]);

  if (!validMeasurementId) return null;

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
      strategy="lazyOnload"
      referrerPolicy="origin"
    />
  );
}
