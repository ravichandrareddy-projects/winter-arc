"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const current = theme === "system" ? resolvedTheme : theme;
  const modes = ["light", "dark", "system"] as const;
  if (!mounted) {
    return <div className="h-11 w-full rounded-xl border border-border" />;
  }
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-card p-1">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setTheme(m)}
          aria-pressed={current === m || (m === "system" && theme === "system")}
          className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold capitalize ${
            (theme === m || (m === "system" && theme === "system"))
              ? "bg-foreground text-background"
              : "text-muted"
          }`}
        >
          {m === "light" ? (
            <Sun className="h-4 w-4" />
          ) : m === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : null}
          {m}
        </button>
      ))}
    </div>
  );
}
