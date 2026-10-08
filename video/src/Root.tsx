import React from "react";
import { Composition } from "remotion";
import { WinterArcAd } from "./WinterArcAd";
import { OpeningScene } from "./scenes/Opening";
import { ChallengeScene } from "./scenes/Challenge";
import { ChooseArcScene } from "./scenes/ChooseArc";
import { ProductIntroScene } from "./scenes/ProductIntro";
import { TrackingDataScene } from "./scenes/TrackingData";
import { PatternHeroScene } from "./scenes/PatternHero";
import { SystemPipelineScene } from "./scenes/SystemPipeline";
import { CinematicCTAScene } from "./scenes/CinematicCTA";
import { TOTAL_FRAMES, FPS } from "./config/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── MASTER CINEMATIC BRAND FILM (1080 × 1920 | 39.0s | 1170 FRAMES) ── */}
      <Composition
        id="WinterArcAd40s"
        component={WinterArcAd}
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

      {/* ── MULTILINGUAL VARIANTS ────────────────────────────────────────── */}
      <Composition
        id="WinterArcAd40s-EN"
        component={WinterArcAd}
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
        component={WinterArcAd}
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
        component={WinterArcAd}
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
    </>
  );
};
