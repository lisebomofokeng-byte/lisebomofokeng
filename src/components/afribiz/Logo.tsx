import { useId } from "react";

import { cn } from "@/lib/utils";

/** The Afribiz Connect ring mark, redrawn as SVG from the company profile. */
export function LogoMark({ className, spin = false }: { className?: string; spin?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9286a" />
          <stop offset="1" stopColor="#f39233" />
        </linearGradient>
        <linearGradient id={`w-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#aab2c8" />
        </linearGradient>
      </defs>
      <g className={spin ? "afz-spin-slow" : undefined} style={{ transformOrigin: "32px 32px" }}>
        {/* outer gradient arc, open on the left */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={`url(#g-${id})`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="120 176"
          strokeDashoffset="-20"
        />
        {/* small left bracket */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={`url(#w-${id})`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="26 176"
          strokeDashoffset="-150"
        />
      </g>
      {/* inner C */}
      <circle
        cx="32"
        cy="32"
        r="15"
        fill="none"
        stroke={`url(#w-${id})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="72 95"
        strokeDashoffset="-12"
      />
      <circle cx="44" cy="35" r="3" fill={`url(#g-${id})`} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-bold tracking-[0.32em] text-white">
          AFRIBIZ
        </span>
        <span className="mt-1 text-[10px] font-light tracking-[0.46em] text-white/70">CONNECT</span>
      </span>
    </span>
  );
}
