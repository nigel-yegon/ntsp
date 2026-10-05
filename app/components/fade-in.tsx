"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const DISTANCE: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0,  y: 20 },
  down:  { x: 0,  y: -20 },
  left:  { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none:  { x: 0,  y: 0 },
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  distance,
  className = "",
  /** When true, waits until the element is in the viewport before animating. */
  whenVisible = false,
  /** When true (with whenVisible), only animates the first time. */
  once = true,
  /** If the user has prefers-reduced-motion set, skip the animation entirely. */
  respectReducedMotion = true,
}: {
  children: React.ReactNode;
  delay?: number;             // seconds
  duration?: number;          // milliseconds
  direction?: Direction;
  distance?: number;          // px — overrides the default for the direction
  className?: string;
  whenVisible?: boolean;
  once?: boolean;
  respectReducedMotion?: boolean;
}) {
  const [visible, setVisible] = useState(!whenVisible);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detect reduced motion once
  useEffect(() => {
    if (!respectReducedMotion || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  // When `whenVisible` is set, delay visibility until intersection
  useEffect(() => {
    if (!whenVisible || visible) return;
    const el = ref.current;
    if (!el) return;

    // If IO isn't available (very old browsers), just show
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [whenVisible, once, visible]);

  // If reduced motion, render plain children with no transition
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const d = DISTANCE[direction];
  const dist = distance ?? Math.hypot(d.x, d.y);
  const dx = d.x === 0 ? 0 : (d.x / Math.hypot(d.x, d.y)) * dist;
  const dy = d.y === 0 ? 0 : (d.y / Math.hypot(d.x, d.y)) * dist;

  const style: React.CSSProperties = {
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translate3d(0, 0, 0)"
      : `translate3d(${dx}px, ${dy}px, 0)`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}