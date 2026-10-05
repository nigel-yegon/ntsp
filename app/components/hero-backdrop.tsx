"use client";

import { useEffect, useRef, useState } from "react";
import { SavannahScene } from "./savannah-scene";
import { HeroWaves } from "./hero-waves";
import { DustPuffs } from "./dust-puffs";
import { CursorBubbles } from "./cursor-bubbles";

type SlideKey = "savannah" | "waves";

const SLIDES: {
  key: SlideKey;
  label: string;
  dwellMs: number;
}[] = [
  { key: "savannah", label: "Kenyan savannah", dwellMs: 12000 },
  { key: "waves",    label: "Indian Ocean",    dwellMs: 10000 },
];

export function HeroBackdrop({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Detect reduced motion once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Advance the slide on an interval, unless paused or reduced-motion
  useEffect(() => {
    if (paused || reduceMotion) return;
    const current = SLIDES[activeIndex];
    const t = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length);
    }, current.dwellMs);
    return () => window.clearTimeout(t);
  }, [activeIndex, paused, reduceMotion]);

  const activeKey = SLIDES[activeIndex].key;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* ─── Scene layers ──────────────────────────────────── */}
      {SLIDES.map((s, i) => {
        // Determine transition state for this slide
        const isActive = i === activeIndex;
        // Distance: how many steps away from active (wraps)
        const forward = (i - activeIndex + SLIDES.length) % SLIDES.length;
        // `forward === 0` → onscreen
        // `forward === 1` → next in queue (waiting below)
        // `forward === length-1` → just exited (drifting up, fading out)

        const style: React.CSSProperties = {
          position: "absolute",
          inset: 0,
          transition: reduceMotion
            ? "none"
            : "transform 2400ms cubic-bezier(0.45, 0, 0.15, 1), opacity 2400ms ease-in-out",
          willChange: "transform, opacity",
        };

        if (isActive) {
          style.transform = "translateY(0)";
          style.opacity = 1;
          style.zIndex = 2;
        } else if (forward === 1) {
          // Waiting in the wings — sits below, slightly zoomed out
          style.transform = "translateY(40px) scale(1.04)";
          style.opacity = 0;
          style.zIndex = 1;
        } else {
          // Just exited — drifts up and fades
          style.transform = "translateY(-40px) scale(1.04)";
          style.opacity = 0;
          style.zIndex = 0;
        }

        return (
          <div key={s.key} style={style} className="h-full w-full">
            {s.key === "savannah" ? <SavannahScene /> : <HeroWaves />}
          </div>
        );
      })}

      {/* ─── Hover effect for the active slide ─────────────── */}
      {/* Only one of these is mounted at a time, so bubbles don't
          visually interfere with dust and vice versa. */}
      <div className="pointer-events-none absolute inset-0">
        {activeKey === "savannah" ? (
          <DustPuffs containerRef={containerRef} />
        ) : (
          <CursorBubbles containerRef={containerRef} />
        )}
      </div>

      {/* ─── Slide indicator (dots) ────────────────────────── */}
      <div className="pointer-events-auto absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={s.key}
              type="button"
              aria-label={`Show ${s.label}`}
              onClick={() => setActiveIndex(i)}
              className={[
                "h-1.5 rounded-full transition-all duration-500",
                active
                  ? "w-8 bg-brand-500"
                  : "w-4 bg-deep-400/40 hover:bg-deep-400/70 dark:bg-cream-400/30 dark:hover:bg-cream-400/60",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* ─── Progress bar for the current slide ────────────── */}
      {!reduceMotion && (
        <div className="absolute bottom-0 left-0 z-10 h-0.5 w-full bg-deep-300/20 dark:bg-cream-500/10">
          <div
            key={activeIndex}
            className="h-full bg-brand-500/70"
            style={{
              animation: paused
                ? "none"
                : `hero-progress ${SLIDES[activeIndex].dwellMs}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}