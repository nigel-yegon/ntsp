// app/events/[slug]/event-location-map.tsx
"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const STYLE_LIGHT = `https://api.maptiler.com/maps/topo-v4-topographique/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
const STYLE_DARK = `https://api.maptiler.com/maps/01a152be-e10d-7625-8b92-380667e0af99/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

type Props = {
  latitude: number;
  longitude: number;
  label: string;
  featured?: boolean;
};

export function EventLocationMap({
  latitude,
  longitude,
  label,
  featured = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

    const prefersDark = document.documentElement.classList.contains("dark");
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: prefersDark ? STYLE_DARK : STYLE_LIGHT,
      center: [longitude, latitude],
      zoom: 9,
      attributionControl: { compact: true },
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    mapRef.current = map;

    // Marker
    const el = document.createElement("div");
    el.style.cssText = [
      "width:34px",
      "height:34px",
      "border-radius:50%",
      `background:${featured ? "#e3b23c" : "#4f46e5"}`,
      "border:3px solid #faf8ee",
      "box-shadow:0 2px 8px rgba(0,0,0,0.35)",
      "color:#faf8ee",
      "font-size:16px",
      "display:flex",
      "align-items:center",
      "justify-content:center",
    ].join(";");
    el.textContent = "★";

    new maplibregl.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Theme changes
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      map.setStyle(dark ? STYLE_DARK : STYLE_LIGHT, { diff: false });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, featured]);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900">
      <div className="flex items-center justify-between border-b border-deep-200 px-4 py-2.5 dark:border-deep-800">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
          >
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-deep-600 dark:text-cream-400">
            Location
          </span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Get directions →
        </a>
      </div>

      <div
        ref={containerRef}
        className="h-64 w-full md:h-80"
        aria-label={`Map showing ${label}`}
      />

      <div className="flex items-center justify-between border-t border-deep-200 px-4 py-2 text-[11px] text-deep-500 dark:border-deep-800 dark:text-cream-500">
        <span className="font-mono">
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
        <span className="truncate pl-3">{label}</span>
      </div>
    </div>
  );
}