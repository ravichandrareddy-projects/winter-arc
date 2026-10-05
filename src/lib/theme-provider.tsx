"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

const KEY = "winterarc-theme";

function resolveTheme(t: Theme): Resolved {
  if (t !== "system" || typeof window === "undefined") {
    return t === "system" ? "dark" : t;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: Resolved): void {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

const Ctx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: Resolved;
}>({ theme: "dark", setTheme: () => undefined, resolvedTheme: "dark" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy init reads storage on first client render. Safe for hydration:
  // no DOM output depends on theme before effects run (toggles render
  // placeholders pre-mount; the class is applied to documentElement only).
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const s = window.localStorage.getItem(KEY);
      if (s === "light" || s === "dark" || s === "system") return s;
    } catch {
      /* storage blocked — stay dark */
    }
    return "dark";
  });
  const [resolvedTheme, setResolvedTheme] = useState<Resolved>("dark");

  // Syncs the external system (document class + storage) with React state.
  useEffect(() => {
    const r = resolveTheme(theme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedTheme(r);
    applyTheme(r);
    try {
      window.localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const r: Resolved = mq.matches ? "dark" : "light";
      setResolvedTheme(r);
      applyTheme(r);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  return <Ctx.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: Resolved;
} {
  return useContext(Ctx);
}
