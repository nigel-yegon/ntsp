// app/components/hero-background.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type HeroVariant =
  | "destinations"
  | "experiences"
  | "packages"
  | "stay"
  | "blog"
  | "events";

export function HeroBackground({ variant }: { variant: HeroVariant }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect both the OS preference and the app's accessibility toggle.
      // The toggle sets .accessibility-reduced-motion on <html>.
      const prefersReduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains(
          "accessibility-reduced-motion"
        );

      if (prefersReduced) return;

      // Each variant exposes named targets via data-anim attributes.
      // The animation itself is the same across all six: a slow,
      // looping drift plus a gentle scale pulse. The motif differences
      // are in the DOM structure below, not the motion.
      const tl = gsap.timeline({ repeat: -1, yoyo: true });

      tl.to("[data-anim='drift']", {
        y: -12,
        duration: 6,
        ease: "sine.inOut",
        stagger: 0.4,
      })
        .to(
          "[data-anim='pulse']",
          {
            scale: 1.04,
            opacity: 0.55,
            duration: 4,
            ease: "sine.inOut",
            stagger: 0.25,
          },
          0
        )
        .to(
          "[data-anim='drift-slow']",
          {
            y: -8,
            x: 6,
            duration: 9,
            ease: "sine.inOut",
            stagger: 0.6,
          },
          0
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Motif variant={variant} />

      {/* Edge fade — same as the SVG version, keeps the motif from
          hitting the section borders. */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-cream-100/50 dark:to-deep-950/60" />
    </div>
  );
}

/* ─── Motifs ─────────────────────────────────────────────────────
   Each motif is a set of absolutely-positioned divs with
   data-anim attributes. The container clamps them to the hero
   bounds via overflow-hidden on the parent.

   Theme adaptation: bg-brand-400/30 in light, dark:bg-brand-400/20
   in dark. The shapes are simple enough that brand-tinted blocks
   read as texture rather than as literal illustration.
   ───────────────────────────────────────────────────────────────── */

const SHAPE =
  "absolute rounded-full bg-brand-400/30 dark:bg-brand-400/20";

function Motif({ variant }: { variant: HeroVariant }) {
  switch (variant) {
    case "destinations":
      return <MountainMotif />;
    case "experiences":
      return <AcaciaMotif />;
    case "packages":
      return <RouteMotif />;
    case "stay":
      return <ManyattaMotif />;
    case "blog":
      return <CompassMotif />;
    case "events":
      return <HerdMotif />;
  }
}

/* Mount Kenya — layered triangular masses rising from the bottom */
function MountainMotif() {
  return (
    <>
      <div
        data-anim="drift-slow"
        className={`${SHAPE} right-[10%] top-[20%] h-48 w-48`}
        style={{ borderRadius: "40% 60% 50% 50%" }}
      />
      <div
        data-anim="pulse"
        className={`${SHAPE} right-[25%] top-[35%] h-32 w-40`}
        style={{ borderRadius: "50% 50% 45% 55%" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} bottom-[-10%] left-[5%] h-64 w-80`}
        style={{ borderRadius: "50% 50% 0 0" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} bottom-[-15%] left-[30%] h-56 w-72`}
        style={{ borderRadius: "45% 55% 0 0" }}
      />
    </>
  );
}

/* Acacia — a broad canopy shape over a thin trunk */
function AcaciaMotif() {
  return (
    <>
      <div
        data-anim="pulse"
        className={`${SHAPE} right-[15%] top-[15%] h-32 w-56`}
        style={{ borderRadius: "50% 50% 40% 40%" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} right-[22%] top-[25%] h-24 w-44`}
        style={{ borderRadius: "50% 50% 45% 45%" }}
      />
      <div
        data-anim="drift-slow"
        className={`${SHAPE} right-[30%] top-[35%] h-40 w-2 rounded-none`}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} bottom-[-5%] left-[10%] h-3 w-40`}
        style={{ borderRadius: "999px" }}
      />
    </>
  );
}

/* Jeep + route — a rectangular jeep body, dashed route as thin bars */
function RouteMotif() {
  return (
    <>
      <div
        data-anim="drift-slow"
        className={`${SHAPE} right-[12%] top-[30%] h-20 w-40`}
        style={{ borderRadius: "8px" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} right-[20%] top-[22%] h-12 w-24`}
        style={{ borderRadius: "6px" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} bottom-[18%] left-[8%] h-1.5 w-2/3`}
        style={{ borderRadius: "999px" }}
      />
      <div
        data-anim="drift-slow"
        className={`${SHAPE} bottom-[12%] left-[15%] h-1.5 w-1/2`}
        style={{ borderRadius: "999px", opacity: 0.6 }}
      />
    </>
  );
}

/* Manyatta — three dome shapes at varying heights */
function ManyattaMotif() {
  return (
    <>
      <div
        data-anim="pulse"
        className={`${SHAPE} bottom-[-20%] left-[10%] h-48 w-48`}
        style={{ borderRadius: "50% 50% 0 0" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} bottom-[-25%] left-[28%] h-56 w-56`}
        style={{ borderRadius: "50% 50% 0 0" }}
      />
      <div
        data-anim="drift-slow"
        className={`${SHAPE} bottom-[-18%] right-[12%] h-44 w-44`}
        style={{ borderRadius: "50% 50% 0 0" }}
      />
    </>
  );
}

/* Compass — a ring and four cardinal marks */
function CompassMotif() {
  return (
    <>
      <div
        data-anim="pulse"
        className={`${SHAPE} right-[12%] top-[25%] h-48 w-48`}
      />
      <div
        data-anim="drift-slow"
        className={`${SHAPE} right-[20%] top-[35%] h-3 w-16`}
        style={{ borderRadius: "999px" }}
      />
      <div
        data-anim="drift-slow"
        className={`${SHAPE} right-[20%] top-[45%] h-3 w-16`}
        style={{ borderRadius: "999px" }}
      />
      <div
        data-anim="drift"
        className={`${SHAPE} right-[30%] top-[25%] h-16 w-3`}
        style={{ borderRadius: "999px" }}
      />
    </>
  );
}

/* Wildebeest herd — a row of rounded blocks at varying opacities */
function HerdMotif() {
  return (
    <>
      {[
        { left: "8%", top: "60%", size: "h-6 w-12", delay: "0" },
        { left: "22%", top: "62%", size: "h-5 w-10", delay: "0.2" },
        { left: "38%", top: "58%", size: "h-7 w-14", delay: "0.4" },
        { left: "54%", top: "61%", size: "h-5 w-11", delay: "0.6" },
        { left: "70%", top: "59%", size: "h-6 w-13", delay: "0.8" },
        { left: "84%", top: "63%", size: "h-4 w-9", delay: "1.0" },
      ].map((b, i) => (
        <div
          key={i}
          data-anim="drift"
          className={`${SHAPE} absolute`}
          style={{
            left: b.left,
            top: b.top,
            borderRadius: "40% 60% 40% 60%",
            opacity: 0.5 - i * 0.05,
          }}
        />
      ))}
    </>
  );
}