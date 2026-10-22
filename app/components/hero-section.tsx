"use client";

import { useEffect, useRef, useState } from "react";
import { HeroBackdrop } from "./hero-backdrop";

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"waves" | "savannah">("waves");

  // Play the wave intro first, then hand off to the savannah backdrop.
  // Respects prefers-reduced-motion (skips straight to savannah) and the
  // manual accessibility toggle that puts `.accessibility-reduced-motion`
  // on <html>.
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains(
          "accessibility-reduced-motion",
        ));

    if (prefersReduced) {
      setPhase("savannah");
      return;
    }

    const t = window.setTimeout(() => setPhase("savannah"), 4200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-deep-200 dark:border-deep-800"
    >
      {/* Wave intro layer — sits on top, fades out when savannah takes over */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 ${
          phase === "waves" ? "opacity-100" : "opacity-0"
        }`}
      >
        <WaveIntro />
      </div>

      {/* Savannah backdrop — starts behind the waves, revealed on handoff */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          phase === "savannah" ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroBackdrop containerRef={ref} />
      </div>

      {/* Content — always on top */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Wave intro backdrop.
 *
 * Uses the existing `.animate-wave-*` keyframes from globals.css
 * (`wave-drift` translateX 0 → -50%). Each layer is a double-width SVG so
 * the loop is seamless. Colors are pulled from the brand and deep scales
 * via inline `currentColor` + opacity so it reads correctly in both themes.
 */
function WaveIntro() {
  return (
    <div className="hero-band absolute inset-0 h-full w-full overflow-hidden">
      {/* Slowest, backmost wave */}
      <div className="animate-wave-slow absolute inset-x-0 bottom-0 h-full w-[200%]">
        <svg
          className="h-full w-full text-deep-300 dark:text-deep-700"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M0,192 C240,256 480,128 720,160 C960,192 1200,320 1440,256 L1440,320 L0,320 Z"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* Medium wave */}
      <div className="animate-wave-medium absolute inset-x-0 bottom-0 h-full w-[200%]">
        <svg
          className="h-full w-full text-brand-300 dark:text-brand-700"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M0,224 C240,160 480,288 720,224 C960,160 1200,96 1440,192 L1440,320 L0,320 Z"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Fastest, frontmost wave — brightest accent */}
      <div className="animate-wave-fast absolute inset-x-0 bottom-0 h-full w-[200%]">
        <svg
          className="h-full w-full text-brand-400 dark:text-brand-500"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M0,256 C240,224 480,320 720,288 C960,256 1200,192 1440,224 L1440,320 L0,320 Z"
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}