"use client";

import FadeIn from "./fade-in";

export function Stagger({
  children,
  delayStart = 0,
  delayStep = 0.06,
  maxDelay = 0.5,
  duration = 600,
  direction = "up",
  whenVisible = false,
  className = "",
}: {
  children: React.ReactNode;
  delayStart?: number;
  delayStep?: number;
  maxDelay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  whenVisible?: boolean;
  className?: string;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <>
      {items.map((child, i) => (
        <FadeIn
          key={i}
          delay={delayStart + Math.min(i * delayStep, maxDelay)}
          duration={duration}
          direction={direction}
          whenVisible={whenVisible}
          className={className}
        >
          {child}
        </FadeIn>
      ))}
    </>
  );
}