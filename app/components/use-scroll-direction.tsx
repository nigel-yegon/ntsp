// app/components/use-scroll-direction.ts
"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down";

/**
 * Tracks scroll direction and past-threshold state.
 * Returns:
 *   - direction: "up" | "down"
 *   - scrolled:  boolean — true once past `threshold` from top
 */
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<Direction>("up");
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;

      // Ignore tiny jitters (< threshold) — prevents flicker
      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        setDirection("down");
      } else {
        setDirection("up");
      }

      setScrolled(y > threshold);
      lastY.current = y;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, scrolled };
}