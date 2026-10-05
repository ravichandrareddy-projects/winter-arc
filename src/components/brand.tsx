import type { SVGProps } from "react";

/** Winter Arc mountain mark — Image 2 blue style. */
export function WinterArcLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 28 17 8l7 11 5-7 15 16H4Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M17 8l3.5 5.5L24 10l4.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M2 28h44" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function WinterArcWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <WinterArcLogo className="h-6 w-9 text-accent" />
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-wide">
          WINTER <span className="text-accent">ARC</span>
        </span>
        {!compact && (
          <span className="mt-1 block text-[8px] font-semibold tracking-[0.22em] text-muted">
            DISCIPLINE BUILDS FREEDOM
          </span>
        )}
      </span>
    </span>
  );
}

export function DefaultAvatar({ name, className }: { name: string; className?: string }) {
  const initial = (name.trim()[0] ?? "W").toUpperCase();
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-accent font-bold text-white ${className ?? "h-10 w-10 text-sm"}`}
    >
      {initial}
    </span>
  );
}

export type { SVGProps };
