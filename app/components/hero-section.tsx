"use client";

import { useRef } from "react";
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

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-deep-200 dark:border-deep-800"
    >
      <HeroBackdrop containerRef={ref} />

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