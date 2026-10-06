import Image from "next/image";
import type { SVGProps } from "react";

/** Winter Arc official branding emblem */
export function WinterArcLogo({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden rounded-xl flex-shrink-0 ${className ?? "h-8 w-8"}`}>
      <Image
        src="/logo.png"
        alt="Winter Arc"
        fill
        sizes="128px"
        className="object-contain"
        priority
      />
    </span>
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
