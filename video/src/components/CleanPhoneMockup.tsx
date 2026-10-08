import React from "react";
import { interpolate, spring } from "remotion";
import { FPS } from "../config/timeline";

interface CleanPhoneMockupProps {
  frame: number;
  children: React.ReactNode;
  theme?: "dark" | "light";
  width?: number;
  height?: number;
  scale?: number;
  translateY?: number;
  showStatusBar?: boolean;
}

export const CleanPhoneMockup: React.FC<CleanPhoneMockupProps> = ({
  frame,
  children,
  theme = "dark",
  width = 500,
  height = 980,
  scale = 1,
  translateY = 0,
  showStatusBar = true,
}) => {
  const isDark = theme === "dark";
  const frameBorder = isDark
    ? "2px solid rgba(255, 255, 255, 0.16)"
    : "2px solid rgba(0, 0, 0, 0.08)";
  const bezelBg = isDark ? "#090d16" : "#f1f3f7";
  const screenBg = isDark ? "#030712" : "#ffffff";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedColor = isDark ? "#64748b" : "#94a3b8";

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 52,
        backgroundColor: bezelBg,
        border: frameBorder,
        boxShadow: isDark
          ? "0 40px 100px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 35px rgba(56, 189, 248, 0.12)"
          : "0 40px 90px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Dynamic Island / Notch */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 124,
          height: 32,
          backgroundColor: "#000000",
          borderRadius: 20,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#0f172a",
          }}
        />
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            backgroundColor: "#1e293b",
          }}
        />
      </div>

      {/* iOS Status Bar */}
      {showStatusBar && (
        <div
          style={{
            height: 52,
            padding: "16px 28px 0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 40,
            backgroundColor: "transparent",
            color: textColor,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
          }}
        >
          {/* Time */}
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            9:41
          </span>

          {/* Right Status Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {/* Cellular Bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 12 }}>
              <div style={{ width: 3, height: 4, backgroundColor: textColor, borderRadius: 1 }} />
              <div style={{ width: 3, height: 6, backgroundColor: textColor, borderRadius: 1 }} />
              <div style={{ width: 3, height: 9, backgroundColor: textColor, borderRadius: 1 }} />
              <div style={{ width: 3, height: 12, backgroundColor: textColor, borderRadius: 1 }} />
            </div>

            {/* Wifi Icon */}
            <svg width="15" height="12" viewBox="0 0 15 12" fill={textColor}>
              <path d="M7.5 10.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zm-3.6-3.2a5.1 5.1 0 0 1 7.2 0l-1.2 1.2a3.4 3.4 0 0 0-4.8 0L3.9 7zM1.5 4.6a8.5 8.5 0 0 1 12 0l-1.2 1.2a6.8 6.8 0 0 0-9.6 0L1.5 4.6z" />
            </svg>

            {/* Battery Icon */}
            <div
              style={{
                width: 22,
                height: 11,
                borderRadius: 3.5,
                border: `1.5px solid ${textColor}`,
                padding: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "80%",
                  height: "100%",
                  backgroundColor: textColor,
                  borderRadius: 1.5,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Screen Content Body */}
      <div
        style={{
          flex: 1,
          backgroundColor: screenBg,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* Home Indicator Bar */}
      <div
        style={{
          height: 24,
          backgroundColor: screenBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: 130,
            height: 4.5,
            borderRadius: 3,
            backgroundColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
};
