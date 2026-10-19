// app/components/map-embed.tsx
"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const STYLE_LIGHT = `https://api.maptiler.com/maps/topo-v4-topographique/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
const STYLE_DARK = `https://api.maptiler.com/maps/01a152be-e10d-7625-8b92-380667e0af99/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

type MapEmbedProps = {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  label?: string;
  height?: number;
  zoom?: number;
};

function isValidCoord(lat: number | null | undefined, lng: number | null | undefined): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
}

export function MapEmbed({ latitude, longitude, label, height = 320, zoom = 12 }: MapEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
    if (!isValidCoord(latitude, longitude)) return;
    if (!containerRef.current) return;

    // Narrow into locals so the compiler can see these are numbers
    // for the whole effect body. The guard above already ran, but
    // TS doesn't carry that narrowing into the closure below.
    const lat = latitude;
    const lng = longitude;
    if (typeof lng !== "number" || !isValidCoord(lat, lng)) return;

    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

    const prefersDark = document.documentElement.classList.contains("dark");
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: prefersDark ? STYLE_DARK : STYLE_LIGHT,
      center: [lng, lat],
      zoom,
      attributionControl: { compact: true },
    });

    new maplibregl.Marker({ color: "#e3b23c" })
      .setLngLat([lng, lat])
      .addTo(map);

    mapRef.current = map;

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
  }, [latitude, longitude, zoom]);

  if (!isValidCoord(latitude, longitude)) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-deep-200 bg-cream-100 dark:border-deep-800 dark:bg-deep-900"
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" aria-label={`Map of ${label ?? "location"}`} />
    </div>
  );
}