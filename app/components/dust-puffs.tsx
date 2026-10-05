"use client";

import { useEffect, useRef, useState } from "react";

type Puff = {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
};

export function DustPuffs({
  containerRef,
  maxPuffs = 14,
  spawnInterval = 110,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  maxPuffs?: number;
  spawnInterval?: number;
}) {
  const puffsRef = useRef<Puff[]>([]);
  const lastSpawnRef = useRef(0);
  const idCounterRef = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      const now = performance.now();
      if (now - lastSpawnRef.current < spawnInterval) return;
      if (puffsRef.current.length >= maxPuffs) return;
      lastSpawnRef.current = now;

      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const puff: Puff = {
        id: idCounterRef.current++,
        x,
        y,
        size: 14 + Math.random() * 26,
        driftX: (Math.random() - 0.5) * 40,
        driftY: -10 - Math.random() * 20,
      };
      puffsRef.current = [...puffsRef.current, puff];
      setTick((t) => t + 1);

      window.setTimeout(() => {
        puffsRef.current = puffsRef.current.filter((p) => p.id !== puff.id);
        setTick((t) => t + 1);
      }, 1300);
    }

    function onLeave() {
      puffsRef.current = [];
      setTick((t) => t + 1);
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef, maxPuffs, spawnInterval]);

  void tick;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {puffsRef.current.map((p) => (
        <span
          key={p.id}
          className="animate-dust-puff absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            // Radial gradient: soft tan core fading to transparent
            background:
              "radial-gradient(circle, var(--brand-300) 0%, color-mix(in srgb, var(--brand-300) 40%, transparent) 45%, transparent 70%)",
            filter: "blur(2px)",
            ["--drift-x" as string]: `${p.driftX}px`,
            ["--drift-y" as string]: `${p.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}