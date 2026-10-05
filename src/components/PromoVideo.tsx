"use client";

import { useState } from "react";
import Image from "next/image";

export function PromoVideo() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="intro-rise mt-12 w-full max-w-4xl" style={{ animationDelay: "1.15s" }} aria-label="Winter Arc challenge video">
      <div className="overflow-hidden rounded-3xl border border-border bg-card/80 p-2 shadow-2xl backdrop-blur-xl sm:p-3">
        {showVideo ? (
          <video
            className="aspect-video w-full rounded-2xl bg-black object-cover"
            controls
            playsInline
            preload="metadata"
            poster="/video-assets/winter-arc-ad-poster.png"
            aria-label="Winter Arc challenge promotional video"
          >
            <source src="/winter-arc-ad.mp4" type="video/mp4" />
            <track kind="captions" srcLang="en" label="English" src="/video-assets/captions.vtt" default />
            Your browser does not support the video tag.
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-[#07131e] text-left"
            aria-label="Play the Winter Arc challenge video"
          >
            <Image
              src="/video-assets/winter-arc-ad-poster.png"
              alt="Winter Arc challenge preview"
              fill
              unoptimized
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_40px_rgba(46,155,255,.55)] transition group-hover:scale-110" aria-hidden="true">
                <span className="ml-1 border-y-[9px] border-l-[14px] border-y-transparent border-l-white" />
              </span>
            </span>
            <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Watch the 90-day challenge story</span>
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">Sound on for the full Winter Arc story · captions included</p>
    </section>
  );
}
