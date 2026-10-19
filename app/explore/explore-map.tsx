// app/explore/explore-map.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import type { MapPoint } from "./page";

const STYLE_LIGHT = `https://api.maptiler.com/maps/topo-v4-topographique/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
const STYLE_DARK = `https://api.maptiler.com/maps/01a152be-e10d-7625-8b92-380667e0af99/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

type Kind = MapPoint["kind"];

const KIND_META: Record<
  Kind,
  {
    label: string;
    singular: string;
    color: string;
    shape: "circle" | "square" | "diamond";
    icon: string;
  }
> = {
  destination: {
    label: "Destinations",
    singular: "Destination",
    color: "#e3b23c",
    shape: "circle",
    icon: "M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z",
  },
  experience: {
    label: "Experiences",
    singular: "Experience",
    color: "#059669",
    shape: "square",
    icon: "M7 9a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4zm-5-2a2 2 0 100-4 2 2 0 000 4z",
  },
  stay: {
    label: "Stays",
    singular: "Stay",
    color: "#e11d48",
    shape: "square",
    icon: "M3 20V8m0 5h18v7M21 20v-4a3 3 0 00-3-3H9v7",
  },
  package: {
    label: "Packages",
    singular: "Package",
    color: "#4f46e5",
    shape: "diamond",
    icon: "M6 19a2 2 0 100-4 2 2 0 000 4zm12-12a2 2 0 100-4 2 2 0 000 4zM8 17h7a3 3 0 000-6H9a3 3 0 010-6h7",
  },
};

function createMarkerEl(kind: Kind): HTMLElement {
  const meta = KIND_META[kind];
  const size = 34;
  const borderRadius =
    meta.shape === "circle" ? "50%" : meta.shape === "square" ? "6px" : "4px";
  const baseRotation = meta.shape === "diamond" ? "rotate(45deg)" : "none";

  const root = document.createElement("div");
  root.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    "cursor:pointer",
  ].join(";");

  const visual = document.createElement("div");
  visual.style.cssText = [
    "width:100%",
    "height:100%",
    `background:${meta.color}`,
    `border-radius:${borderRadius}`,
    "border:2px solid #faf8ee",
    "box-shadow:0 2px 6px rgba(0,0,0,0.25)",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    `transform: ${baseRotation}`,
  ].join(";");

  const inner = document.createElement("div");
  if (meta.shape === "diamond") inner.style.transform = "rotate(-45deg)";
  inner.style.cssText += "display:flex;align-items:center;justify-content:center;";
  inner.innerHTML = `
    <svg viewBox="0 0 24 24" width="${size * 0.55}" height="${size * 0.55}"
      fill="none" stroke="#faf8ee" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round"><path d="${meta.icon}"/></svg>
  `;
  visual.appendChild(inner);
  root.appendChild(visual);
  return root;
}

export function ExploreMap({ points }: { points: MapPoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const [activeKinds, setActiveKinds] = useState<Set<Kind>>(
    () => new Set(["destination", "experience", "stay", "package"])
  );
  const [query, setQuery] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);
  const [hoverAnchor, setHoverAnchor] = useState<
    { x: number; y: number; width: number; height: number } | null
  >(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredPoints = useMemo(() => {
    const q = query.trim().toLowerCase();
    return points.filter((p) => {
      if (!activeKinds.has(p.kind)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q)
      );
    });
  }, [points, activeKinds, query]);

  // Mount map once
  useEffect(() => {
    if (!containerRef.current) return;
    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

    const prefersDark = document.documentElement.classList.contains("dark");
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: prefersDark ? STYLE_DARK : STYLE_LIGHT,
      center: [37.9, -0.02],
      zoom: 5.5,
      attributionControl: { compact: true },
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );
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
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Tell MapLibre to re-measure after the sidebar collapse animation
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const t = setTimeout(() => map.resize(), 220);
    return () => clearTimeout(t);
  }, [sidebarOpen]);

  // Sync markers with filtered set
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const wanted = new Set(filteredPoints.map((p) => p.id));
    markersRef.current.forEach((marker, id) => {
      if (!wanted.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    for (const p of filteredPoints) {
      if (markersRef.current.has(p.id)) continue;

      const el = createMarkerEl(p.kind);
      const meta = KIND_META[p.kind];

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);

      el.addEventListener("mouseenter", () => {
        const visual = el.firstElementChild as HTMLElement | null;
        if (visual) {
          visual.classList.remove("marker-pulse", "marker-pulse-rotated");
          void visual.offsetWidth;
          visual.classList.add(
            meta.shape === "diamond" ? "marker-pulse-rotated" : "marker-pulse"
          );
        }
        const rect = el.getBoundingClientRect();
        setHoverAnchor({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        setHoveredPoint(p);
      });

      el.addEventListener("mouseleave", () => {
        const visual = el.firstElementChild as HTMLElement | null;
        if (visual) {
          visual.classList.remove("marker-pulse", "marker-pulse-rotated");
        }
        setHoveredPoint((curr) => (curr?.id === p.id ? null : curr));
        setHoverAnchor(null);
      });

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedPoint(p);
      });

      markersRef.current.set(p.id, marker);
    }
  }, [filteredPoints]);

  // Auto-fit to filtered bounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map || filteredPoints.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    for (const p of filteredPoints) bounds.extend([p.longitude, p.latitude]);
    map.fitBounds(bounds, { padding: 80, maxZoom: 9, duration: 600 });
  }, [filteredPoints]);

  const toggleKind = (k: Kind) => {
    setActiveKinds((curr) => {
      const next = new Set(curr);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const closeDrawer = useCallback(() => setSelectedPoint(null), []);

  useEffect(() => {
    if (!selectedPoint) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPoint, closeDrawer]);

  return (
    <div
      className={[
        "grid gap-6 transition-[grid-template-columns] duration-200 ease-out",
        sidebarOpen
          ? "lg:grid-cols-[280px_1fr_auto]"
          : "lg:grid-cols-[56px_1fr_auto]",
      ].join(" ")}
    >
      {/* Sidebar / collapsed rail */}
      <aside className="relative">
        {sidebarOpen ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-deep-700 dark:text-cream-300">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Collapse filters"
                aria-expanded={true}
                className="rounded-lg p-1.5 text-deep-500 transition hover:bg-cream-200 hover:text-deep-700 dark:text-cream-500 dark:hover:bg-deep-800 dark:hover:text-cream-100"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-deep-700 dark:text-cream-300">
                Search
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, county, category…"
                className="w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-2.5 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
              />
            </label>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-deep-700 dark:text-cream-300">
                Show on map
              </div>
              <ul className="space-y-2">
                {(Object.keys(KIND_META) as Kind[]).map((k) => {
                  const meta = KIND_META[k];
                  const active = activeKinds.has(k);
                  const count = points.filter((p) => p.kind === k).length;
                  return (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => toggleKind(k)}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                          active
                            ? "border-deep-200 bg-cream-50 dark:border-deep-700 dark:bg-deep-900"
                            : "border-dashed border-deep-200 bg-transparent opacity-60 hover:opacity-100 dark:border-deep-800",
                        ].join(" ")}
                      >
                        <span
                          aria-hidden
                          className="flex h-5 w-5 shrink-0 items-center justify-center"
                          style={{
                            background: active ? meta.color : "transparent",
                            border: `2px solid ${meta.color}`,
                            borderRadius:
                              meta.shape === "circle"
                                ? "50%"
                                : meta.shape === "diamond"
                                  ? "3px"
                                  : "4px",
                            transform:
                              meta.shape === "diamond" ? "rotate(45deg)" : undefined,
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-deep-800 dark:text-cream-100">
                            {meta.label}
                          </span>
                          <span className="block text-xs text-deep-500 dark:text-cream-500">
                            {count} {count === 1 ? "place" : "places"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-xl border border-deep-200 bg-cream-50 p-3 text-xs text-deep-600 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-400">
              <p>
                <span className="font-semibold text-deep-800 dark:text-cream-200">
                  {filteredPoints.length}
                </span>{" "}
                {filteredPoints.length === 1 ? "place" : "places"} shown.
              </p>
              <p className="mt-1">Click any marker for full details.</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Expand filters"
            aria-expanded={false}
            className="flex h-full min-h-125 w-full flex-col items-center justify-start gap-2 rounded-xl border border-deep-200 bg-cream-50 px-2 py-3 transition hover:bg-cream-100 dark:border-deep-800 dark:bg-deep-900 dark:hover:bg-deep-800"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-deep-600 dark:text-cream-400"
              style={{ transform: "rotate(180deg)" }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider text-deep-500 dark:text-cream-500"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              Filters
            </span>
          </button>
        )}
      </aside>

      {/* Map with hover tooltip overlay */}
      <div className="relative overflow-hidden rounded-2xl border border-deep-200 bg-cream-100 dark:border-deep-800 dark:bg-deep-900">
        <div
          ref={containerRef}
          className="h-[70vh] min-h-125 w-full"
          aria-label="Map of tourism listings across Kenya"
        />

        {hoveredPoint && hoverAnchor && (
          <HoverTooltip point={hoveredPoint} anchor={hoverAnchor} />
        )}

        {filteredPoints.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cream-100/85 dark:bg-deep-900/85">
            <div className="rounded-xl border border-dashed border-deep-300 bg-cream-50 p-6 text-center text-sm text-deep-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
              No places match your filters.
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedPoint && (
        <aside
          className="relative flex max-h-[70vh] w-full flex-col overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900 lg:w-85"
          role="dialog"
          aria-label={`${KIND_META[selectedPoint.kind].singular} details`}
        >
          <span
            className="block h-1 w-full shrink-0"
            style={{ background: KIND_META[selectedPoint.kind].color }}
          />
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-deep-200 px-5 py-4 dark:border-deep-800">
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: KIND_META[selectedPoint.kind].color }}
              >
                {KIND_META[selectedPoint.kind].singular}
              </div>
              <h3 className="mt-1 text-base font-semibold text-deep-900 dark:text-cream-100">
                {selectedPoint.title}
              </h3>
              {selectedPoint.subtitle && (
                <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                  {selectedPoint.subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="shrink-0 rounded-lg p-1.5 text-deep-400 transition hover:bg-cream-200 hover:text-deep-700 dark:text-cream-500 dark:hover:bg-deep-800 dark:hover:text-cream-100"
              aria-label="Close details"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto p-5 text-sm">
            {selectedPoint.description && (
              <p className="whitespace-pre-wrap leading-6 text-deep-700 dark:text-cream-300">
                {selectedPoint.description.length > 800
                  ? `${selectedPoint.description.slice(0, 800).trimEnd()}…`
                  : selectedPoint.description}
              </p>
            )}

            <div className="text-xs text-deep-500 dark:text-cream-500">
              Coordinates:{" "}
              <span className="font-mono">
                {selectedPoint.latitude.toFixed(4)},{" "}
                {selectedPoint.longitude.toFixed(4)}
              </span>
            </div>

            <Link
              href={selectedPoint.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-deep-900 transition hover:opacity-90"
              style={{ background: KIND_META[selectedPoint.kind].color }}
            >
              View full details →
            </Link>

            <p className="text-xs text-deep-500 dark:text-cream-500">
              Press{" "}
              <kbd className="rounded border border-deep-200 bg-cream-100 px-1 text-[10px] dark:border-deep-700 dark:bg-deep-950">
                Esc
              </kbd>{" "}
              to close.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}

function HoverTooltip({
  point,
  anchor,
}: {
  point: MapPoint;
  anchor: { x: number; y: number; width: number; height: number };
}) {
  const TOOLTIP_WIDTH = 240;
  const TOOLTIP_HEIGHT = 110;
  const GAP = 12;

  const spaceRight = window.innerWidth - (anchor.x + anchor.width);
  const placeLeft = spaceRight < TOOLTIP_WIDTH + GAP;

  const left = placeLeft
    ? Math.max(8, anchor.x - TOOLTIP_WIDTH - GAP)
    : Math.min(
        anchor.x + anchor.width + GAP,
        window.innerWidth - TOOLTIP_WIDTH - 8
      );

  const top = Math.min(
    Math.max(8, anchor.y),
    window.innerHeight - TOOLTIP_HEIGHT - 8
  );

  const meta = KIND_META[point.kind];

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg border border-deep-200 bg-cream-50 px-3 py-2 text-xs shadow-lg dark:border-deep-700 dark:bg-deep-900"
      style={{ left, top, width: TOOLTIP_WIDTH }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: meta.color }}
      >
        {meta.singular}
      </div>
      <div className="mt-0.5 font-semibold text-deep-800 dark:text-cream-100">
        {point.title}
      </div>
      {point.subtitle && (
        <div className="mt-0.5 text-deep-500 dark:text-cream-400">
          {point.subtitle}
        </div>
      )}
      <div className="mt-1 text-[10px] italic text-deep-400 dark:text-cream-500">
        Click for details
      </div>
    </div>
  );
}