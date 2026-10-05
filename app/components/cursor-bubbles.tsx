"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
};

export function CursorBubbles({
  containerRef,
  maxBubbles = 12,
  spawnInterval = 90,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  maxBubbles?: number;
  spawnInterval?: number;
}) {
  const bubblesRef = useRef<Bubble[]>([]);
  const lastSpawnRef = useRef(0);
  const idCounterRef = useRef(0);
  const [_, forceRender] = useForceRender();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      const now = performance.now();
      if (now - lastSpawnRef.current < spawnInterval) return;
      if (bubblesRef.current.length >= maxBubbles) return;
      lastSpawnRef.current = now;

      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const bubble: Bubble = {
        id: idCounterRef.current++,
        x,
        y,
        size: 6 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 60,
      };
      bubblesRef.current = [...bubblesRef.current, bubble];
      forceRender();

      // Remove after the CSS animation completes
      window.setTimeout(() => {
        bubblesRef.current = bubblesRef.current.filter(
          (b) => b.id !== bubble.id,
        );
        forceRender();
      }, 1400);
    }

    function onLeave() {
      bubblesRef.current = [];
      forceRender();
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef, maxBubbles, spawnInterval, forceRender]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {bubblesRef.current.map((b) => (
        <span
          key={b.id}
          className="absolute animate-bubble-rise rounded-full border border-brand-500/40 bg-brand-400/20 backdrop-blur-sm dark:border-brand-400/50 dark:bg-brand-400/20"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            marginLeft: -b.size / 2,
            marginTop: -b.size / 2,
            // CSS variable consumed by the keyframes for horizontal drift
            ["--drift" as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* Tiny hook so the component re-renders when the mutable ref updates. */
function useForceRender(): [number, () => void] {
  const [tick, setTick] = useStateSafe(0);
  return [tick, () => setTick((t) => t + 1)];
}

/* Local alias so we don't forget the React import if the file is trimmed. */
import { useState as useStateSafe } from "react";