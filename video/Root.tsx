import React from "react";
import { Composition } from "remotion";
import { WinterArcAd as WinterArcAdModular } from "./src/WinterArcAd";
import { OpeningScene } from "./src/scenes/Opening";
import { ChallengeScene } from "./src/scenes/Challenge";
import { ChooseArcScene } from "./src/scenes/ChooseArc";
import { ProductIntroScene } from "./src/scenes/ProductIntro";
import { TrackingDataScene } from "./src/scenes/TrackingData";
import { PatternHeroScene } from "./src/scenes/PatternHero";
import { SystemPipelineScene } from "./src/scenes/SystemPipeline";
import { CinematicCTAScene } from "./src/scenes/CinematicCTA";
import { TOTAL_FRAMES, FPS } from "./src/config/timeline";

// Legacy compositions for backwards compatibility
import { WinterArcAd as WinterArcAd60s } from "./WinterArcAd";
import { WinterArcAd30s } from "./WinterArcAd30s";

export function RemotionRoot() {
  return (
    <>
      {/* ── MASTER CINEMATIC BRAND FILM (1080 × 1920 | 39.0s | 1170 FRAMES) ── */}
      <Composition
        id="WinterArcAd40s"
        component={WinterArcAdModular}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          language: "en" as const,
          enableMusic: true,
          enableVoice: true,
        }}
      />

      {/* ── MULTILINGUAL AD VARIANTS ────────────────────────────────────── */}
      <Composition
        id="WinterArcAd40s-EN"
        component={WinterArcAdModular}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          language: "en" as const,
          enableMusic: true,
          enableVoice: true,
        }}
      />

      <Composition
        id="WinterArcAd40s-HI"
        component={WinterArcAdModular}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          language: "hi" as const,
          enableMusic: true,
          enableVoice: true,
        }}
      />

      <Composition
        id="WinterArcAd40s-TE"
        component={WinterArcAdModular}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          language: "te" as const,
          enableMusic: true,
          enableVoice: true,
        }}
      />

      {/* ── CINEMATIC SCENE ISOLATION PREVIEWS ───────────────────────────── */}
      <Composition
        id="Scene01-Opening"
        component={() => <OpeningScene frame={75} />}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene02-Challenge"
        component={() => <ChallengeScene frame={60} />}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene03-ChooseArc"
        component={() => <ChooseArcScene frame={75} />}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene04-ProductIntro"
        component={() => <ProductIntroScene frame={60} />}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene05-TrackingData"
        component={() => <TrackingDataScene frame={60} />}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene06-PatternHero"
        component={() => <PatternHeroScene frame={60} />}
        durationInFrames={150}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene07-SystemPipeline"
        component={() => <SystemPipelineScene frame={60} />}
        durationInFrames={135}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Scene08-CinematicCTA"
        component={() => <CinematicCTAScene frame={60} />}
        durationInFrames={135}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* ── LEGACY CUTS (PRESERVED) ─────────────────────────────────────── */}
      <Composition
        id="WinterArcAd30s"
        component={WinterArcAd30s}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WinterArcAdLandscape"
        component={WinterArcAd60s}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ format: "landscape" as const }}
      />
      <Composition
        id="WinterArcAdVertical"
        component={WinterArcAd60s}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" as const }}
      />
    </>
  );
}