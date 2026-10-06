"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type Resolved = "dark";

const KEY = "winterarc-theme";

function applyTheme(): void {
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
}

const Ctx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: Resolved;
}>({ theme: "dark", setTheme: () => undefined, resolvedTheme: "dark" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyTheme();
    try {
      window.localStorage.setItem(KEY, "dark");
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((_t: Theme) => {
    applyTheme();
  }, []);

  return (
    <Ctx.Provider value={{ theme: "dark", setTheme, resolvedTheme: "dark" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
