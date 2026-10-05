import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Activity,
  BedDouble,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  House,
  Moon,
  Plus,
  Quote,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

type Format = "landscape" | "vertical";

interface AdProps {
  format?: Format;
}

const C = {
  bg: "#070c12",
  windowBg: "#0c131c",
  card: "#121a24",
  border: "rgba(255, 255, 255, 0.08)",
  borderAccent: "rgba(46, 155, 255, 0.4)",
  text: "#eef3f8",
  textMuted: "#8b98a9",
  accent: "#2e9bff",
  good: "#34d399",
  water: "#38bdf8",
  protein: "#fb7185",
  steps: "#4ade80",
  workout: "#fb923c",
  sleep: "#818cf8",
  wake: "#fbbf24",
};

export const WinterArcAd: React.FC<AdProps> = ({ format = "landscape" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 1800 frames total (60.0 seconds @ 30fps)
  // Scene timings:
  // 1. Hook / Challenge Intro: 0 - 165 (0.0s - 5.5s)
  // 2. Real Home & Interactive Stepper: 165 - 435 (5.5s - 14.5s)
  // 3. Real Sleep TimeGrid & Trend: 435 - 675 (14.5s - 22.5s)
  // 4. Real Wake Up Anchor & Consistency: 675 - 885 (22.5s - 29.5s)
  // 5. Real Fitness Overload & Trend: 885 - 1125 (29.5s - 37.5s)
  // 6. Real Food Nutrition & Macros: 1125 - 1365 (37.5s - 45.5s)
  // 7. Real Progress Dashboard & Matrix: 1365 - 1545 (45.5s - 51.5s)
  // 8. Gen-Z Reality Check (Raj Shamani): 1545 - 1695 (51.5s - 56.5s)
  // 9. Final Hero & CTA: 1695 - 1800 (56.5s - 60.0s)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        color: C.text,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Background Synth Music Bed */}
      <Audio
        src={staticFile("video-assets/winter-arc-audio.wav")}
        volume={0.92}
      />

      {/* Atmospheric Background Aurora Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 10%, rgba(46, 155, 255, 0.12) 0%, rgba(9, 13, 19, 0.95) 75%), radial-gradient(circle at 80% 90%, rgba(52, 211, 153, 0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating subtle particle drift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 150px 180px, #2e9bff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 300px 80px, #ffffff, rgba(0,0,0,0))",
          backgroundSize: "400px 400px",
          transform: `translateY(${((frame * 0.4) % 400) - 200}px)`,
        }}
      />

      {/* SCENE 1: THE WINTER ARC CHALLENGE OPENING */}
      {frame < 175 && <SceneChallengeIntro frame={frame} />}

      {/* SCENE 2: REAL HOME COMMAND CENTER & INTERACTIVE CLICK */}
      {frame >= 160 && frame < 445 && <SceneRealHome frame={frame - 165} />}

      {/* SCENE 3: REAL SLEEP ARCHITECTURE */}
      {frame >= 430 && frame < 685 && <SceneRealSleep frame={frame - 435} />}

      {/* SCENE 4: REAL WAKE UP CONSISTENCY */}
      {frame >= 670 && frame < 895 && <SceneRealWakeUp frame={frame - 675} />}

      {/* SCENE 5: REAL FITNESS & OVERLOAD */}
      {frame >= 880 && frame < 1135 && <SceneRealFitness frame={frame - 885} />}

      {/* SCENE 6: REAL FOOD & NUTRITION */}
      {frame >= 1120 && frame < 1375 && <SceneRealFood frame={frame - 1125} />}

      {/* SCENE 7: REAL PROGRESS DASHBOARD & MATRIX */}
      {frame >= 1360 && frame < 1555 && <SceneRealProgress frame={frame - 1365} />}

      {/* SCENE 8: GEN-Z REALITY CHECK (RAJ SHAMANI) */}
      {frame >= 1540 && frame < 1705 && <SceneRajShamani frame={frame - 1545} />}

      {/* SCENE 9: CLIMAX & CTA */}
      {frame >= 1690 && <SceneClimaxCTA frame={frame - 1695} />}

      {/* Subtle Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.75)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------
   SCENE 1: THE WINTER ARC CHALLENGE OPENING (0 - 165 frames / 5.5s)
   ------------------------------------------------------------------------- */
function SceneChallengeIntro({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [0, 20, 145, 165], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 165], [0.96, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(frame, [0, 80, 165], [0.4, 0.85, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        textAlign: "center",
        zIndex: 20,
      }}
    >
      {/* Glowing Mountain SVG Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          padding: "10px 28px",
          borderRadius: 999,
          background: "rgba(46, 155, 255, 0.08)",
          border: "1px solid rgba(46, 155, 255, 0.3)",
          boxShadow: `0 0 40px rgba(46, 155, 255, ${glow * 0.4})`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.accent}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 34, height: 34 }}
        >
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: C.accent,
            textTransform: "uppercase",
          }}
        >
          WINTER ARC
        </span>
      </div>

      {/* Main Title Banner */}
      <h1
        style={{
          fontSize: 78,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1.06,
          margin: 0,
          background:
            "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        THE 90-DAY
        <br />
        <span
          style={{
            background:
              "linear-gradient(135deg, #2e9bff 0%, #60a5fa 50%, #93c5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          WINTER ARC CHALLENGE
        </span>
      </h1>

      {/* Calendar Window dates */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 28,
          padding: "12px 32px",
          borderRadius: 20,
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Calendar style={{ width: 22, height: 22, color: C.accent }} />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#ffffff",
          }}
        >
          OCTOBER 1 — DECEMBER 31
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 999,
            background: "rgba(46, 155, 255, 0.2)",
            color: C.accent,
          }}
        >
          90 DAYS
        </span>
      </div>

      {/* Subtitle hook */}
      <p
        style={{
          fontSize: 26,
          fontWeight: 500,
          color: C.textMuted,
          marginTop: 28,
          maxWidth: 820,
          lineHeight: 1.4,
        }}
      >
        While the rest of the world slows down for winter...
        <br />
        <strong style={{ color: "#ffffff", fontWeight: 700 }}>
          We lock in. We compound. We transform.
        </strong>
      </p>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 2: REAL HOME COMMAND CENTER & INTERACTIVE CLICK (165 - 435 / 9.0s)
   ------------------------------------------------------------------------- */
function SceneRealHome({ frame }: { frame: number }) {
  // frame runs from 0 to 270 (9.0 seconds)
  const opacity = interpolate(frame, [0, 18, 250, 270], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera pan & zoom: start wide showing dashboard, zoom toward Water & Goals
  const scale = interpolate(frame, [0, 130, 270], [1.02, 1.15, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 140, 270], [0, -40, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [0, 140, 270], [0, -30, -50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // At frame 120 (4.0s in), simulate tactile button press on Water "+"
  // Switch to updated screenshot where Water is 3L / 100% completed!
  const isClicked = frame >= 120;
  const buttonPressScale = interpolate(
    frame,
    [115, 120, 128],
    [1.0, 0.88, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Real Website Screenshot Container with camera motion */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "35% 45%",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Layer 1: Initial Real Home Page */}
        <Img
          src={staticFile("video-assets/real/01_home_initial.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isClicked ? 0 : 1,
            transition: "opacity 0.2s ease-in-out",
          }}
        />

        {/* Layer 2: Interactive Real Home Page (Water 100% Completed, Bell 6) */}
        <Img
          src={staticFile(
            "video-assets/real/11_interactive_home_water_incremented.png"
          )}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isClicked ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
        />

        {/* Tactile Button Press Highlight Circle on Water Card "+" Button */}
        {frame >= 110 && frame <= 140 && (
          <div
            style={{
              position: "absolute",
              top: "54.2%",
              left: "40.8%",
              width: 48,
              height: 48,
              borderRadius: 14,
              border: `2px solid ${C.accent}`,
              background: "rgba(46, 155, 255, 0.35)",
              boxShadow: "0 0 30px rgba(46, 155, 255, 0.9)",
              transform: `translate(-50%, -50%) scale(${buttonPressScale})`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Floating Glassmorphic Story Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 60,
          maxWidth: 620,
          padding: "18px 28px",
          borderRadius: 24,
          background: "rgba(12, 19, 28, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles style={{ width: 20, height: 20, color: C.accent }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: C.accent,
              textTransform: "uppercase",
            }}
          >
            DAILY COMMAND CENTER
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {isClicked ? "Target Reached: 3.0 / 3.0 L" : "Add once. Log daily."}
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, margin: 0 }}>
          {isClicked
            ? "100% completed. Reactive streak counters update instantly."
            : "Effortless steppers, multi-tracker cards, and zero friction."}
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 3: REAL SLEEP ARCHITECTURE & TIMEGRID (435 - 675 / 8.0s)
   ------------------------------------------------------------------------- */
function SceneRealSleep({ frame }: { frame: number }) {
  // frame runs from 0 to 240 (8.0s)
  const opacity = interpolate(frame, [0, 18, 222, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pan across Sleep TimeGrid (from wide view to focused neon trajectory)
  const scale = interpolate(frame, [0, 120, 240], [1.03, 1.18, 1.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [0, 120, 240], [0, -60, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 120, 240], [0, 20, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Real Website Sleep Page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "60% 45%",
        }}
      >
        <Img
          src={staticFile("video-assets/real/04_sleep.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Pulsing Neon Line Accent on the 10:30 PM Sleep Grid trajectory */}
        <div
          style={{
            position: "absolute",
            top: "43.5%",
            left: "85%",
            width: 140,
            height: 38,
            borderRadius: 20,
            border: "2px solid rgba(251, 191, 36, 0.8)",
            background: "rgba(251, 191, 36, 0.12)",
            boxShadow: "0 0 35px rgba(251, 191, 36, 0.6)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Floating Callout Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 60,
          maxWidth: 620,
          padding: "18px 28px",
          borderRadius: 24,
          background: "rgba(12, 19, 28, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Moon style={{ width: 20, height: 20, color: C.sleep }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: C.sleep,
              textTransform: "uppercase",
            }}
          >
            SLEEP ARCHITECTURE
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          10:30 PM Bedtime · 100% Consistency
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, margin: 0 }}>
          Visual circadian rhythm matrix. Deep sleep fuels your recovery and daily output.
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 4: REAL WAKE UP CONSISTENCY (675 - 885 / 7.0s)
   ------------------------------------------------------------------------- */
function SceneRealWakeUp({ frame }: { frame: number }) {
  // frame runs from 0 to 210 (7.0s)
  const opacity = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 110, 210], [1.03, 1.16, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [0, 110, 210], [0, -50, -80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Real Website Wake Up Page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) translate(${translateX}px, 0px)`,
          transformOrigin: "60% 50%",
        }}
      >
        <Img
          src={staticFile("video-assets/real/05_wake_up.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Sunrise anchor line spotlight */}
        <div
          style={{
            position: "absolute",
            top: "51%",
            left: "75%",
            width: 220,
            height: 40,
            borderRadius: 20,
            border: "2px solid rgba(251, 191, 36, 0.8)",
            background: "rgba(251, 191, 36, 0.12)",
            boxShadow: "0 0 35px rgba(251, 191, 36, 0.7)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Floating Callout Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 60,
          maxWidth: 620,
          padding: "18px 28px",
          borderRadius: 24,
          background: "rgba(12, 19, 28, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sun style={{ width: 20, height: 20, color: C.wake }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: C.wake,
              textTransform: "uppercase",
            }}
          >
            MORNING ANCHOR
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          6:14 AM Wake Up · Locked In
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, margin: 0 }}>
          Rise with intention. Win the morning before the rest of the world wakes up.
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 5: REAL FITNESS & OVERLOAD (885 - 1125 / 8.0s)
   ------------------------------------------------------------------------- */
function SceneRealFitness({ frame }: { frame: number }) {
  // frame runs from 0 to 240 (8.0s)
  const opacity = interpolate(frame, [0, 18, 222, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pan from the activity grid down to the trend charts
  const scale = interpolate(frame, [0, 120, 240], [1.02, 1.15, 1.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 120, 240], [0, -30, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Real Website Fitness Page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: "50% 60%",
        }}
      >
        <Img
          src={staticFile("video-assets/real/06_fitness.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Highlight on Workout Completed checkmark pill */}
        <div
          style={{
            position: "absolute",
            top: "47.8%",
            left: "91%",
            width: 90,
            height: 38,
            borderRadius: 14,
            border: "2px solid #fb923c",
            boxShadow: "0 0 35px rgba(251, 146, 60, 0.7)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Floating Callout Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 60,
          maxWidth: 620,
          padding: "18px 28px",
          borderRadius: 24,
          background: "rgba(12, 19, 28, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Dumbbell style={{ width: 20, height: 20, color: C.workout }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: C.workout,
              textTransform: "uppercase",
            }}
          >
            FITNESS & PROGRESSIVE OVERLOAD
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          Daily Workouts · Steps · Running · Weight
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, margin: 0 }}>
          Track every session, push-up, and kilometer with compounding weekly trendlines.
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 6: REAL FOOD & NUTRITION (1125 - 1365 / 8.0s)
   ------------------------------------------------------------------------- */
function SceneRealFood({ frame }: { frame: number }) {
  // frame runs from 0 to 240 (8.0s)
  const opacity = interpolate(frame, [0, 18, 222, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zoom into the Nutrition Summary Donut and Meal Logs
  const scale = interpolate(frame, [0, 120, 240], [1.02, 1.15, 1.24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 120, 240], [0, -35, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Real Website Food Page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: "45% 65%",
        }}
      >
        <Img
          src={staticFile("video-assets/real/07_food.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Glow ring around the Donut Chart (1,290 kcal) */}
        <div
          style={{
            position: "absolute",
            top: "74.8%",
            left: "24.5%",
            width: 82,
            height: 82,
            borderRadius: "50%",
            border: "2px solid rgba(251, 113, 133, 0.8)",
            boxShadow: "0 0 35px rgba(251, 113, 133, 0.7)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Floating Callout Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 60,
          maxWidth: 620,
          padding: "18px 28px",
          borderRadius: 24,
          background: "rgba(12, 19, 28, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <UtensilsCrossed style={{ width: 20, height: 20, color: C.protein }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: C.protein,
              textTransform: "uppercase",
            }}
          >
            PRECISION NUTRITION
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          Meal Logs · Macros · Calorie Adherence
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, margin: 0 }}>
          Track protein, carbs, and healthy fats. Fuel your transformation with precision.
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 7: REAL PROGRESS DASHBOARD & MATRIX (1365 - 1545 / 6.0s)
   ------------------------------------------------------------------------- */
function SceneRealProgress({ frame }: { frame: number }) {
  // frame runs from 0 to 180 (6.0s)
  const opacity = interpolate(frame, [0, 18, 162, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 90, 180], [1.02, 1.14, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 90, 180], [0, -20, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 10 }}>
      {/* Real Website Progress Page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        <Img
          src={staticFile("video-assets/real/08_progress.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Glowing pulse on Habit Completion Heatmap matrix */}
        <div
          style={{
            position: "absolute",
            top: "61%",
            left: "77%",
            width: 320,
            height: 120,
            borderRadius: 20,
            border: "2px solid rgba(52, 211, 153, 0.7)",
            boxShadow: "0 0 40px rgba(52, 211, 153, 0.5)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Floating Callout Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 60,
          maxWidth: 620,
          padding: "18px 28px",
          borderRadius: 24,
          background: "rgba(12, 19, 28, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp style={{ width: 20, height: 20, color: C.good }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: C.good,
              textTransform: "uppercase",
            }}
          >
            COMPOUNDING HEATMAP
          </span>
        </div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          90-Day Habit Matrix & Consistency
        </p>
        <p style={{ fontSize: 15, color: C.textMuted, margin: 0 }}>
          See your entire journey compound. Never break the chain.
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 8: GEN-Z REALITY CHECK — RAJ SHAMANI (1545 - 1695 / 5.0s)
   ------------------------------------------------------------------------- */
function SceneRajShamani({ frame }: { frame: number }) {
  // frame runs from 0 to 150 (5.0s)
  const opacity = interpolate(frame, [0, 16, 134, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 150], [0.96, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        textAlign: "center",
        zIndex: 25,
      }}
    >
      {/* Quote Icon Badge */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 22,
          background: "rgba(46, 155, 255, 0.12)",
          border: "1px solid rgba(46, 155, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 0 40px rgba(46, 155, 255, 0.35)",
        }}
      >
        <Quote style={{ width: 32, height: 32, color: C.accent }} />
      </div>

      {/* Main Quote Content */}
      <p
        style={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "0.22em",
          color: C.accent,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        A MESSAGE TO GEN-Z
      </p>

      <blockquote
        style={{
          fontSize: 38,
          fontWeight: 800,
          lineHeight: 1.35,
          color: "#ffffff",
          maxWidth: 1100,
          margin: 0,
          letterSpacing: "-0.015em",
        }}
      >
        “Gen-Z has infinite choices and infinite distractions.
        <br />
        <span
          style={{
            background:
              "linear-gradient(135deg, #2e9bff 0%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Talent doesn’t get you anywhere. Discipline is what separates those who dream from those who execute.
        </span>”
      </blockquote>

      <p
        style={{
          fontSize: 22,
          color: C.textMuted,
          marginTop: 24,
          fontWeight: 600,
        }}
      >
        — <strong style={{ color: "#ffffff" }}>Raj Shamani</strong>, Figuring Out
      </p>

      <div
        style={{
          marginTop: 18,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 24px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: 16,
          fontWeight: 700,
          color: "#e2e8f0",
        }}
      >
        <span>This Winter Arc is how we prove them wrong.</span>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------
   SCENE 9: CLIMAX & CTA (1695 - 1800 / 3.5s)
   ------------------------------------------------------------------------- */
function SceneClimaxCTA({ frame }: { frame: number }) {
  // frame runs from 0 to 105 (3.5s)
  const opacity = interpolate(frame, [0, 16, 92, 105], [0, 1, 1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 105], [0.96, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = interpolate(frame, [0, 50, 105], [0.4, 0.9, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        textAlign: "center",
        zIndex: 30,
      }}
    >
      {/* Mountain Logo Badge */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 28,
          background: "rgba(46, 155, 255, 0.15)",
          border: "1px solid rgba(46, 155, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          boxShadow: `0 0 60px rgba(46, 155, 255, ${pulse})`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.accent}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 48, height: 48 }}
        >
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      </div>

      <p
        style={{
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "0.35em",
          color: C.accent,
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        WINTER ARC
      </p>

      <h1
        style={{
          fontSize: 66,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "12px 0 16px 0",
          color: "#ffffff",
        }}
      >
        DISCIPLINE BUILDS FREEDOM
      </h1>

      <p
        style={{
          fontSize: 24,
          color: C.textMuted,
          margin: "0 0 32px 0",
          fontWeight: 500,
        }}
      >
        Add once. Log daily. See the trend.
      </p>

      {/* Primary CTA Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "20px 48px",
          borderRadius: 999,
          background: "#ffffff",
          color: "#070c12",
          fontSize: 22,
          fontWeight: 800,
          boxShadow: "0 10px 40px rgba(255, 255, 255, 0.35)",
        }}
      >
        <span>START YOUR WINTER ARC</span>
        <ChevronRight style={{ width: 24, height: 24 }} />
      </div>

      {/* Website Domain Pill */}
      <p
        style={{
          marginTop: 22,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: C.accent,
        }}
      >
        winterarc.app
      </p>
    </AbsoluteFill>
  );
}