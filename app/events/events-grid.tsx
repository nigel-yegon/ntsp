"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FadeIn from "@/app/components/fade-in";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Event = {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
};

type DateFilter = "all" | "upcoming" | "this-month" | "next-3-months" | "past";
type ViewMode = "list" | "calendar" | "map";

const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: "all", label: "All dates" },
  { key: "upcoming", label: "Upcoming" },
  { key: "this-month", label: "This month" },
  { key: "next-3-months", label: "Next 3 months" },
  { key: "past", label: "Past" },
];

const VIEWS: { key: ViewMode; label: string; icon: string }[] = [
  { key: "list", label: "List", icon: "M4 6h16M4 12h16M4 18h10" },
  {
    key: "calendar",
    label: "Calendar",
    icon: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  },
  {
    key: "map",
    label: "Map",
    icon: "M9 4l6 2 6-2v14l-6 2-6-2-6 2V6l6-2zm0 0v14m6-12v14",
  },
];

const STYLE_LIGHT = `https://api.maptiler.com/maps/topo-v4-topographique/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
const STYLE_DARK = `https://api.maptiler.com/maps/01a152be-e10d-7625-8b92-380667e0af99/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

export function EventsGrid({ events }: { events: Event[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("upcoming");
  const [view, setView] = useState<ViewMode>("list");

  const now = useMemo(() => new Date(), []);
  const monthStart = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
    [now],
  );
  const monthEnd = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    [now],
  );
  const threeMonthsOut = useMemo(
    () =>
      new Date(now.getFullYear(), now.getMonth() + 3, now.getDate(), 23, 59, 59),
    [now],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = events.filter((e) => {
      const eventEnd = e.endDate ?? e.startDate;
      const eventStart = e.startDate;

      switch (dateFilter) {
        case "upcoming":
          if (eventEnd < now) return false;
          break;
        case "past":
          if (eventEnd >= now) return false;
          break;
        case "this-month":
          if (eventEnd < monthStart || eventStart > monthEnd) return false;
          break;
        case "next-3-months":
          if (eventEnd < now || eventStart > threeMonthsOut) return false;
          break;
        case "all":
        default:
          break;
      }

      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    if (dateFilter === "past") {
      sorted.sort(
        (a, b) =>
          (b.endDate ?? b.startDate).getTime() -
          (a.endDate ?? a.startDate).getTime(),
      );
    } else {
      sorted.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    return sorted;
  }, [query, dateFilter, events, now, monthStart, monthEnd, threeMonthsOut]);

  const hasFilters = query !== "" || dateFilter !== "upcoming";

  function reset() {
    setQuery("");
    setDateFilter("upcoming");
  }

  return (
    <>
      {/* ── Filters (shared by all three views) ──────────────── */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500"
          >
            🔍
          </span>
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, location, or keyword…"
            className="w-full rounded-md border border-deep-200 bg-cream-50 py-2.5 pl-10 pr-10 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-100 focus:ring-2 focus:ring-brand-500/20 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-deep-400 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-200"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_FILTERS.map((f) => (
            <Pill
              key={f.key}
              label={f.label}
              active={dateFilter === f.key}
              onClick={() => setDateFilter(f.key)}
            />
          ))}

          <span className="mx-1 hidden h-5 w-px bg-deep-200 dark:bg-deep-800 sm:inline-block" />

          {/* View toggle */}
          <div
            role="tablist"
            aria-label="View mode"
            className="inline-flex overflow-hidden rounded-full border border-deep-300 bg-cream-50 dark:border-deep-700 dark:bg-deep-900"
          >
            {VIEWS.map((v) => {
              const active = view === v.key;
              return (
                <button
                  key={v.key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setView(v.key)}
                  className={[
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "bg-brand-500 text-white"
                      : "text-deep-700 hover:bg-cream-100 dark:text-cream-300 dark:hover:bg-deep-800",
                  ].join(" ")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d={v.icon} />
                  </svg>
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-deep-500 dark:text-cream-500">
            {hasFilters
              ? `${filtered.length} of ${events.length} events`
              : `${events.length} events`}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ── Views ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState onReset={reset} />
      ) : view === "list" ? (
        <ListView events={filtered} />
      ) : view === "calendar" ? (
        <CalendarView events={filtered} anchorMonth={now} />
      ) : (
        <MapView events={filtered} />
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   LIST VIEW
   ────────────────────────────────────────────────────────────── */
function ListView({ events }: { events: Event[] }) {
  return (
    <div className="space-y-3">
      {events.map((e, i) => (
        <FadeIn key={e.id} delay={Math.min(i * 0.06, 0.4)} whenVisible>
          <Link
            href={`/events/${e.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500 sm:flex-row sm:items-center sm:justify-between"
          >
            <span
              className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-brand-500 transition-transform duration-300 group-hover:scale-y-100"
              aria-hidden
            />
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <h3 className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                  {e.name}
                </h3>
                {e.featured && (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-deep-500 dark:text-cream-500">
                {formatDateRange(e.startDate, e.endDate)} · 📍 {e.location}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                {e.description}
              </p>
            </div>
            <span className="mt-3 shrink-0 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400 sm:ml-6 sm:mt-0">
              Details →
            </span>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   CALENDAR VIEW
   ────────────────────────────────────────────────────────────── */
function CalendarView({
  events,
  anchorMonth,
}: {
  events: Event[];
  anchorMonth: Date;
}) {
  const [month, setMonth] = useState(
    () => new Date(anchorMonth.getFullYear(), anchorMonth.getMonth(), 1),
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of events) {
      const start = startOfDay(e.startDate);
      const end = startOfDay(e.endDate ?? e.startDate);
      for (
        let d = new Date(start);
        d.getTime() <= end.getTime();
        d.setDate(d.getDate() + 1)
      ) {
        const key = dayKey(d);
        const list = map.get(key) ?? [];
        list.push(e);
        map.set(key, list);
      }
    }
    return map;
  }, [events]);

  const days = useMemo(() => buildMonthGrid(month), [month]);
  const today = startOfDay(new Date());

  function shift(delta: number) {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900">
      <div className="flex items-center justify-between border-b border-deep-200 px-4 py-3 dark:border-deep-800">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Previous month"
          className="rounded-md px-2 py-1 text-deep-500 transition hover:bg-cream-100 hover:text-deep-800 dark:text-cream-500 dark:hover:bg-deep-800 dark:hover:text-cream-100"
        >
          ←
        </button>
        <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
          {month.toLocaleDateString("en-KE", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="rounded-md px-2 py-1 text-deep-500 transition hover:bg-cream-100 hover:text-deep-800 dark:text-cream-500 dark:hover:bg-deep-800 dark:hover:text-cream-100"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-deep-200 text-center text-[10px] font-semibold uppercase tracking-wider text-deep-500 dark:border-deep-800 dark:text-cream-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const key = dayKey(day.date);
          const inMonth = day.date.getMonth() === month.getMonth();
          const isToday = day.date.getTime() === today.getTime();
          const list = eventsByDay.get(key) ?? [];
          return (
            <div
              key={idx}
              className={[
                "min-h-24 border-b border-r border-deep-100 p-1.5 text-left dark:border-deep-800/60",
                inMonth
                  ? "bg-cream-50 dark:bg-deep-900"
                  : "bg-cream-100/50 dark:bg-deep-950/40",
                isToday ? "ring-1 ring-inset ring-brand-500" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-1 flex items-center justify-between text-[10px] font-semibold",
                  inMonth
                    ? "text-deep-700 dark:text-cream-300"
                    : "text-deep-400 dark:text-cream-600",
                ].join(" ")}
              >
                <span
                  className={
                    isToday
                      ? "rounded-full bg-brand-500 px-1.5 py-0.5 text-white"
                      : ""
                  }
                >
                  {day.date.getDate()}
                </span>
                {list.length > 2 && (
                  <span className="text-deep-400 dark:text-cream-600">
                    {list.length}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                {list.slice(0, 2).map((e) => (
                  <Link
                    key={`${e.id}-${key}`}
                    href={`/events/${e.slug}`}
                    title={`${e.name} — ${e.location}`}
                    className={[
                      "block truncate rounded px-1 py-0.5 text-[10px] font-medium transition",
                      e.featured
                        ? "bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-950 dark:text-brand-200 dark:hover:bg-brand-900"
                        : "bg-cream-200 text-deep-700 hover:bg-cream-300 dark:bg-deep-800 dark:text-cream-200 dark:hover:bg-deep-700",
                    ].join(" ")}
                  >
                    {e.name}
                  </Link>
                ))}
                {list.length > 2 && (
                  <div className="px-1 text-[10px] text-deep-500 dark:text-cream-500">
                    +{list.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAP VIEW — MapLibre with custom marker DOM elements
   ────────────────────────────────────────────────────────────── */
function MapView({ events }: { events: Event[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());

  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [hoverAnchor, setHoverAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const mappedEvents = useMemo(() => {
    return events.filter(
      (e) => e.latitude != null && e.longitude != null
    ) as (Event & { latitude: number; longitude: number })[];
  }, [events]);

  /* ── Mount map ───────────────────────────────────────────── */
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
      "top-right",
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

  /* ── Sync markers ────────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const wanted = new Set(mappedEvents.map((e) => e.id));
    markersRef.current.forEach((marker, id) => {
      if (!wanted.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    for (const e of mappedEvents) {
      if (markersRef.current.has(e.id)) continue;

      // Build custom DOM marker matching the ExploreMap aesthetic
      const el = document.createElement("div");
      el.style.cssText = "width:34px;height:34px;cursor:pointer;";

      const visual = document.createElement("div");
      visual.style.cssText = [
        "width:100%",
        "height:100%",
        `background:${e.featured ? "#e3b23c" : "#4f46e5"}`, // brand vs indigo
        "border-radius:50%", // circle shape
        "border:2px solid #faf8ee",
        "box-shadow:0 2px 6px rgba(0,0,0,0.25)",
        "display:flex",
        "align-items:center",
        "justify-content:center",
      ].join(";");

      const inner = document.createElement("div");
      inner.style.cssText =
        "display:flex;align-items:center;justify-content:center;";
      // Calendar icon inside the marker
      inner.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18"
          fill="none" stroke="#faf8ee" stroke-width="2.5" stroke-linecap="round"
          stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      `;
      visual.appendChild(inner);
      el.appendChild(visual);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([e.longitude, e.latitude])
        .addTo(map);

      el.addEventListener("mouseenter", () => {
        visual.classList.remove("marker-pulse");
        void visual.offsetWidth;
        visual.classList.add("marker-pulse");

        const rect = el.getBoundingClientRect();
        setHoverAnchor({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        setHoveredEvent(e);
      });

      el.addEventListener("mouseleave", () => {
        visual.classList.remove("marker-pulse");
        setHoveredEvent((curr) => (curr?.id === e.id ? null : curr));
        setHoverAnchor(null);
      });

      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        setSelectedEvent(e);
      });

      markersRef.current.set(e.id, marker);
    }
  }, [mappedEvents]);

  /* ── Auto-fit bounds ─────────────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mappedEvents.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    for (const e of mappedEvents) bounds.extend([e.longitude, e.latitude]);
    map.fitBounds(bounds, { padding: 80, maxZoom: 9, duration: 600 });
  }, [mappedEvents]);

  /* ── Keyboard Escape close ───────────────────────────────── */
  useEffect(() => {
    if (!selectedEvent) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setSelectedEvent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedEvent]);

  const closeDrawer = useCallback(() => setSelectedEvent(null), []);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-2xl border border-deep-200 bg-cream-100 dark:border-deep-800 dark:bg-deep-900">
        <div
          ref={containerRef}
          className="h-[60vh] min-h-[400px] w-full"
          aria-label="Map of events across Kenya"
        />

        {hoveredEvent && hoverAnchor && (
          <HoverTooltip point={hoveredEvent} anchor={hoverAnchor} />
        )}

        {mappedEvents.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cream-100/85 dark:bg-deep-900/85">
            <div className="rounded-xl border border-dashed border-deep-300 bg-cream-50 p-6 text-center text-sm text-deep-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
              No events with coordinates to display on the map.
            </div>
          </div>
        )}
      </div>

      {/* Drawer / Side panel */}
      {selectedEvent && (
        <aside
          role="dialog"
          aria-label={`${selectedEvent.name} details`}
          className="relative flex max-h-[60vh] flex-col overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900 lg:w-80"
        >
          <span
            className="block h-1 w-full shrink-0"
            style={{
              background: selectedEvent.featured ? "#e3b23c" : "#4f46e5",
            }}
          />
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-deep-200 px-5 py-4 dark:border-deep-800">
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  color: selectedEvent.featured ? "#e3b23c" : "#4f46e5",
                }}
              >
                {selectedEvent.featured ? "Featured Event" : "Event"}
              </div>
              <h3 className="mt-1 text-base font-semibold text-deep-900 dark:text-cream-100">
                {selectedEvent.name}
              </h3>
              <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                {formatDateRange(selectedEvent.startDate, selectedEvent.endDate)} · 📍{" "}
                {selectedEvent.location}
              </p>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="shrink-0 rounded-lg p-1.5 text-deep-400 transition hover:bg-cream-200 hover:text-deep-700 dark:text-cream-500 dark:hover:bg-deep-800 dark:hover:text-cream-100"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto p-5 text-sm">
            <p className="whitespace-pre-wrap leading-6 text-deep-700 dark:text-cream-300">
              {selectedEvent.description.length > 500
                ? `${selectedEvent.description.slice(0, 500).trimEnd()}…`
                : selectedEvent.description}
            </p>

            <div className="text-xs text-deep-500 dark:text-cream-500">
              Coordinates:{" "}
              <span className="font-mono">
                {selectedEvent.latitude?.toFixed(4)},{" "}
                {selectedEvent.longitude?.toFixed(4)}
              </span>
            </div>

            <Link
              href={`/events/${selectedEvent.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              View full details →
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Shared bits
   ────────────────────────────────────────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
      <p className="text-sm text-deep-600 dark:text-cream-400">
        No events match your filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
      >
        Reset filters
      </button>
    </div>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-deep-300 bg-cream-50 text-deep-700 hover:border-brand-400 hover:text-brand-600 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
      }`}
    >
      {label}
    </button>
  );
}

function HoverTooltip({
  point,
  anchor,
}: {
  point: Event;
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

  const color = point.featured ? "#e3b23c" : "#4f46e5";

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg border border-deep-200 bg-cream-50 px-3 py-2 text-xs shadow-lg dark:border-deep-700 dark:bg-deep-900"
      style={{ left, top, width: TOOLTIP_WIDTH }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        {point.featured ? "Featured Event" : "Event"}
      </div>
      <div className="mt-0.5 font-semibold text-deep-800 dark:text-cream-100">
        {point.name}
      </div>
      <div className="mt-0.5 text-deep-500 dark:text-cream-400">
        {point.location}
      </div>
      <div className="mt-1 text-[10px] italic text-deep-400 dark:text-cream-500">
        Click for details
      </div>
    </div>
  );
}

function formatDateRange(start: Date, end: Date | null) {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = start.toLocaleDateString("en-KE", opts);
  if (!end) return s;
  const e = end.toLocaleDateString("en-KE", opts);
  return s === e ? s : `${s} – ${e}`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function buildMonthGrid(anchor: Date): { date: Date }[] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - firstWeekday);
  const days: { date: Date }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push({ date: d });
  }
  return days;
}