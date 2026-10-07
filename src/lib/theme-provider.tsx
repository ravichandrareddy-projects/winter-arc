"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type Resolved = "light" | "dark";

const KEY = "winterarc-theme";

const THEME_EVENT = "winterarc-theme-change";
let memoryTheme: Theme = "dark";

function getTheme(): Theme {
  try {
    const value = window.localStorage.getItem(KEY);
    if (value === "light" || value === "dark" || value === "system") return value;
  } catch { /* use the in-memory preference when storage is unavailable */ }
  return memoryTheme;
}

function subscribeTheme(listener: () => void): () => void {
  window.addEventListener(THEME_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(THEME_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function subscribeSystem(listener: () => void): () => void {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

const Ctx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: Resolved;
}>({ theme: "dark", setTheme: () => undefined, resolvedTheme: "dark" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark" as Theme);
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => true
  );
  const resolvedTheme: Resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.classList.toggle("light", resolvedTheme === "light");
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((value: Theme) => {
    memoryTheme = value;
    try { window.localStorage.setItem(KEY, value); } catch { /* keep the in-memory choice */ }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <Ctx.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
