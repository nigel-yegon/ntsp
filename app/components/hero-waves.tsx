"use client";

export function HeroWaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Back wave — slower, more transparent */}
      <svg
        className="absolute -bottom-1 left-0 h-40 w-[200%] animate-wave-slow md:h-56"
        viewBox="0 0 2400 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C300,140 600,20 900,80 C1200,140 1500,20 1800,80 C2100,140 2400,20 2400,80 L2400,200 L0,200 Z"
          className="fill-brand-500/10 dark:fill-brand-400/10"
        />
      </svg>

      {/* Mid wave */}
      <svg
        className="absolute -bottom-1 left-0 h-32 w-[200%] animate-wave-medium md:h-48"
        viewBox="0 0 2400 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C400,40 800,160 1200,100 C1600,40 2000,160 2400,100 L2400,200 L0,200 Z"
          className="fill-brand-500/15 dark:fill-brand-400/15"
        />
      </svg>

      {/* Front wave — fastest, most opaque */}
      <svg
        className="absolute -bottom-1 left-0 h-24 w-[200%] animate-wave-fast md:h-36"
        viewBox="0 0 2400 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,120 C300,80 700,180 1000,120 C1300,60 1700,180 2000,120 C2200,80 2400,140 2400,140 L2400,200 L0,200 Z"
          className="fill-brand-600/20 dark:fill-brand-500/20"
        />
      </svg>
    </div>
  );
}