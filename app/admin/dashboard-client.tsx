"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

import FadeIn from "../components/fade-in";

import {
  listDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  type DestinationRow,
} from "./actions/destinations";
import {
  listExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  type ExperienceRow,
} from "./actions/experiences";
import {
  listPackages,
  createPackage,
  updatePackage,
  deletePackage,
  type PackageRow,
} from "./actions/packages";
import {
  listStays,
  createStay,
  updateStay,
  deleteStay,
  type StayRow,
} from "./actions/stays";
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type EventRow,
} from "./actions/events";
import {
  listPosts,
  createPost,
  updatePost,
  deletePost,
  type PostRow,
} from "./actions/posts";

type ModuleKey =
  | "overview"
  | "destinations"
  | "experiences"
  | "packages"
  | "stay"
  | "events"
  | "blog";

/**
 * A module tone bundles every color token a module needs.
 *
 * The palette is built from the site's public-facing colors:
 *   - brand (gold/ochre) — the primary accent
 *   - deep  (warm charcoal-brown) — the base dark surface
 *   - cream (warm off-white) — the base light surface
 *   - plus a small set of warm-tuned hues for variety
 *
 * Every module uses one tone so the sidebar, header, list cards,
 * and editor are all visually distinct but still siblings.
 */
type ModuleTone = {
  /** Focus/hover ring, tinted */
  ring: string;
  /** Default border */
  border: string;
  /** Hover border */
  borderHover: string;
  /** Very light background (light-mode tint) */
  bgSoft: string;
  /** Sidebar active background + heavier tints */
  bgActive: string;
  /** Headline/label text */
  text: string;
  /** Button background */
  button: string;
  /** Button hover background */
  buttonHover: string;
  /** Vertical/horizontal accent strip */
  bar: string;
  /** Badge background */
  pillBg: string;
  /** Badge text */
  pillText: string;
  /** Small icon */
  icon: React.ReactNode;
};

export const TONES: Record<Exclude<ModuleKey, "overview">, ModuleTone> = {
  destinations: {
    ring: "ring-brand-500/20",
    border: "border-brand-300 dark:border-brand-800",
    borderHover: "hover:border-brand-500 dark:hover:border-brand-500",
    bgSoft: "bg-brand-50 dark:bg-brand-950/40",
    bgActive: "bg-brand-100 dark:bg-brand-950/70",
    text: "text-brand-700 dark:text-brand-300",
    button: "bg-brand-600",
    buttonHover: "hover:bg-brand-700",
    bar: "bg-brand-500",
    pillBg: "bg-brand-100 dark:bg-brand-950",
    pillText: "text-brand-800 dark:text-brand-200",
    icon: <CompassMarkIcon />,
  },
  experiences: {
    ring: "ring-emerald-500/20",
    border: "border-emerald-300 dark:border-emerald-800",
    borderHover: "hover:border-emerald-500 dark:hover:border-emerald-500",
    bgSoft: "bg-emerald-50 dark:bg-emerald-950/40",
    bgActive: "bg-emerald-100 dark:bg-emerald-950/70",
    text: "text-emerald-700 dark:text-emerald-300",
    button: "bg-emerald-700",
    buttonHover: "hover:bg-emerald-800",
    bar: "bg-emerald-600",
    pillBg: "bg-emerald-100 dark:bg-emerald-950",
    pillText: "text-emerald-800 dark:text-emerald-200",
    icon: <PawIcon />,
  },
  packages: {
    ring: "ring-indigo-500/20",
    border: "border-indigo-300 dark:border-indigo-800",
    borderHover: "hover:border-indigo-500 dark:hover:border-indigo-500",
    bgSoft: "bg-indigo-50 dark:bg-indigo-950/40",
    bgActive: "bg-indigo-100 dark:bg-indigo-950/70",
    text: "text-indigo-700 dark:text-indigo-300",
    button: "bg-indigo-700",
    buttonHover: "hover:bg-indigo-800",
    bar: "bg-indigo-600",
    pillBg: "bg-indigo-100 dark:bg-indigo-950",
    pillText: "text-indigo-800 dark:text-indigo-200",
    icon: <RouteIcon />,
  },
  stay: {
    ring: "ring-rose-500/20",
    border: "border-rose-300 dark:border-rose-800",
    borderHover: "hover:border-rose-500 dark:hover:border-rose-500",
    bgSoft: "bg-rose-50 dark:bg-rose-950/40",
    bgActive: "bg-rose-100 dark:bg-rose-950/70",
    text: "text-rose-700 dark:text-rose-300",
    button: "bg-rose-700",
    buttonHover: "hover:bg-rose-800",
    bar: "bg-rose-600",
    pillBg: "bg-rose-100 dark:bg-rose-950",
    pillText: "text-rose-800 dark:text-rose-200",
    icon: <BedIcon />,
  },
  events: {
    ring: "ring-violet-500/20",
    border: "border-violet-300 dark:border-violet-800",
    borderHover: "hover:border-violet-500 dark:hover:border-violet-500",
    bgSoft: "bg-violet-50 dark:bg-violet-950/40",
    bgActive: "bg-violet-100 dark:bg-violet-950/70",
    text: "text-violet-700 dark:text-violet-300",
    button: "bg-violet-700",
    buttonHover: "hover:bg-violet-800",
    bar: "bg-violet-600",
    pillBg: "bg-violet-100 dark:bg-violet-950",
    pillText: "text-violet-800 dark:text-violet-200",
    icon: <CalendarIcon />,
  },
  blog: {
    ring: "ring-sky-500/20",
    border: "border-sky-300 dark:border-sky-800",
    borderHover: "hover:border-sky-500 dark:hover:border-sky-500",
    bgSoft: "bg-sky-50 dark:bg-sky-950/40",
    bgActive: "bg-sky-100 dark:bg-sky-950/70",
    text: "text-sky-700 dark:text-sky-300",
    button: "bg-sky-700",
    buttonHover: "hover:bg-sky-800",
    bar: "bg-sky-600",
    pillBg: "bg-sky-100 dark:bg-sky-950",
    pillText: "text-sky-800 dark:text-sky-200",
    icon: <PenIcon />,
  },
};

export function DashboardClient() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const [search, setSearch] = useState("");

  const [destinations, setDestinations] = useState<DestinationRow[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [stays, setStays] = useState<StayRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);
        const [d, e, p, s, ev, po] = await Promise.all([
          listDestinations(),
          listExperiences(),
          listPackages(),
          listStays(),
          listEvents(),
          listPosts(),
        ]);
        if (cancelled) return;
        setDestinations(d);
        setExperiences(e);
        setPackages(p);
        setStays(s);
        setEvents(ev);
        setPosts(po);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredExperiences = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return experiences;
    return experiences.filter((e) =>
      [e.name, e.category, e.destinationName, e.description]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search, experiences]);

  const filteredPackages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter((p) =>
      [p.title, p.summary, p.destinationName].join(" ").toLowerCase().includes(q),
    );
  }, [search, packages]);

  const filteredStays = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stays;
    return stays.filter((s) =>
      [s.name, s.type, s.location, s.destinationName]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search, stays]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      [e.name, e.location, e.description].join(" ").toLowerCase().includes(q),
    );
  }, [search, events]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase().includes(q),
    );
  }, [search, posts]);

  const stats = [
    { label: "Destinations", value: destinations.length, module: "destinations" as ModuleKey },
    { label: "Experiences",  value: experiences.length,  module: "experiences"  as ModuleKey },
    { label: "Packages",     value: packages.length,     module: "packages"     as ModuleKey },
    { label: "Stays",        value: stays.length,        module: "stay"         as ModuleKey },
    { label: "Events",       value: events.length,       module: "events"       as ModuleKey },
    { label: "Blog posts",   value: posts.length,        module: "blog"         as ModuleKey },
  ];

  return (
    <div className="min-h-screen bg-cream-200 dark:bg-deep-950">
      <div className="flex min-h-screen">
        <DashboardSidebar activeModule={activeModule} onNavigate={setActiveModule} />

        <main className="min-w-0 flex-1">
          <DashboardHeader
            activeModule={activeModule}
            search={search}
            setSearch={setSearch}
            tone={activeModule !== "overview" ? TONES[activeModule] : undefined}
          />

          <div className="p-6 lg:p-8">
            {error && <ErrorBanner>{error}</ErrorBanner>}

            {activeModule === "overview" && (
              <Overview stats={stats} onNavigate={setActiveModule} />
            )}

            {activeModule === "destinations" && (
              <DestinationsModule
                destinations={destinations}
                setDestinations={setDestinations}
                loading={loading}
                tone={TONES.destinations}
              />
            )}

            {activeModule === "experiences" && (
              <ExperiencesModule
                experiences={filteredExperiences}
                setExperiences={setExperiences}
                destinations={destinations}
                loading={loading}
                tone={TONES.experiences}
              />
            )}

            {activeModule === "packages" && (
              <PackagesModule
                packages={filteredPackages}
                setPackages={setPackages}
                destinations={destinations}
                loading={loading}
                tone={TONES.packages}
              />
            )}

            {activeModule === "stay" && (
              <StaysModule
                stays={filteredStays}
                setStays={setStays}
                destinations={destinations}
                loading={loading}
                tone={TONES.stay}
              />
            )}

            {activeModule === "events" && (
              <EventsModule
                events={filteredEvents}
                setEvents={setEvents}
                loading={loading}
                tone={TONES.events}
              />
            )}

            {activeModule === "blog" && (
              <PostsModule
                posts={filteredPosts}
                setPosts={setPosts}
                loading={loading}
                tone={TONES.blog}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SIDEBAR                                                                    */
/* -------------------------------------------------------------------------- */

function DashboardSidebar({
  activeModule,
  onNavigate,
}: {
  activeModule: ModuleKey;
  onNavigate: (m: ModuleKey) => void;
}) {
  const modules: {
    key: ModuleKey;
    label: string;
    description: string;
    tone?: ModuleTone;
    icon: React.ReactNode;
  }[] = [
    { key: "overview",     label: "Overview",     description: "Dashboard summary",    icon: <GridIcon />    },
    { key: "destinations", label: "Destinations", description: "Manage destinations",  icon: TONES.destinations.icon, tone: TONES.destinations },
    { key: "experiences",  label: "Experiences",  description: "Manage experiences",   icon: TONES.experiences.icon,  tone: TONES.experiences },
    { key: "packages",     label: "Packages",     description: "Manage packages",      icon: TONES.packages.icon,     tone: TONES.packages },
    { key: "stay",         label: "Stay",         description: "Manage accommodation", icon: TONES.stay.icon,         tone: TONES.stay },
    { key: "events",       label: "Events",       description: "Manage events",        icon: TONES.events.icon,       tone: TONES.events },
    { key: "blog",         label: "Blog",         description: "Manage blog posts",    icon: TONES.blog.icon,         tone: TONES.blog },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-deep-200 bg-cream-100 dark:border-deep-800 dark:bg-deep-900 lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-deep-200 px-6 py-5 dark:border-deep-800">
          <Link href="/" className="block">
            <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-deep-800 dark:text-cream-100">
              <span>🇰🇪</span>
              <span>
                NTSP<span className="text-brand-600 dark:text-brand-400">.</span>
              </span>
            </div>
            <div className="mt-1 text-xs text-deep-500 dark:text-cream-500">
              Content Dashboard
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-deep-500 dark:text-cream-500">
            Content
          </div>
          <nav className="space-y-1">
            {modules.map((m) => {
              const active = activeModule === m.key;
              const tone = m.tone;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onNavigate(m.key)}
                  className={[
                    "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition",
                    active && tone
                      ? `${tone.bgActive} ${tone.text}`
                      : active
                        ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "text-deep-600 hover:bg-cream-200 hover:text-deep-900 dark:text-cream-400 dark:hover:bg-deep-800 dark:hover:text-cream-100",
                  ].join(" ")}
                >
                  {/* Left accent strip when active */}
                  {active && tone && (
                    <span
                      aria-hidden
                      className={`absolute inset-y-1 left-0 w-1 rounded-full ${tone.bar}`}
                    />
                  )}

                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                      active && tone
                        ? tone.bgSoft
                        : "bg-cream-200 text-deep-500 group-hover:bg-cream-300 dark:bg-deep-800 dark:text-cream-500 dark:group-hover:bg-deep-700",
                    ].join(" ")}
                  >
                    <span
                      className={
                        active && tone
                          ? tone.text
                          : "text-deep-500 dark:text-cream-500"
                      }
                    >
                      {m.icon}
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{m.label}</span>
                    <span
                      className={[
                        "block truncate text-xs",
                        active
                          ? "text-current opacity-70"
                          : "text-deep-500 dark:text-cream-500",
                      ].join(" ")}
                    >
                      {m.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-deep-200 p-4 dark:border-deep-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-cream-200 px-4 py-3 text-xs text-deep-600 transition hover:bg-cream-300 dark:bg-deep-800 dark:text-cream-400 dark:hover:bg-deep-700"
          >
            <ArrowLeftIcon />
            <span>View public site</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

function DashboardHeader({
  activeModule,
  search,
  setSearch,
  tone,
}: {
  activeModule: ModuleKey;
  search: string;
  setSearch: (v: string) => void;
  tone?: ModuleTone;
}) {
  const titles: Record<ModuleKey, string> = {
    overview: "Dashboard",
    destinations: "Destinations",
    experiences: "Experiences",
    packages: "Packages",
    stay: "Stay",
    events: "Events",
    blog: "Blog",
  };

  const searchable = activeModule !== "overview" && activeModule !== "destinations";

  return (
    <header className="border-b border-deep-200 bg-cream-100/85 backdrop-blur-md dark:border-deep-800 dark:bg-deep-900/85">
      <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div
            className={`text-xs font-medium uppercase tracking-[0.16em] ${
              tone?.text ?? "text-brand-600 dark:text-brand-400"
            }`}
          >
            NTSP Content
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-deep-800 dark:text-cream-100">
            {titles[activeModule]}
          </h1>
        </div>

        {searchable && tone && (
          <div className="relative w-full lg:w-80">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-deep-400 dark:text-cream-500">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${titles[activeModule].toLowerCase()}...`}
              className={`w-full rounded-xl border ${tone.border} bg-cream-50 py-2.5 pl-10 pr-4 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:bg-cream-100 focus:ring-2 ${tone.ring} dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:bg-deep-950`}
            />
          </div>
        )}
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* OVERVIEW                                                                   */
/* -------------------------------------------------------------------------- */

function Overview({
  stats,
  onNavigate,
}: {
  stats: { label: string; value: number; module: ModuleKey }[];
  onNavigate: (m: ModuleKey) => void;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <FadeIn>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-deep-800 dark:text-cream-100">
            Overview
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
            Manage all content that appears on the NTSP public site.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, i) => {
          const tone = stat.module !== "overview" ? TONES[stat.module] : undefined;
          return (
            <FadeIn key={stat.label} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => onNavigate(stat.module)}
                className={[
                  "group relative w-full overflow-hidden rounded-2xl border bg-cream-50 p-5 pl-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-deep-900",
                  tone
                    ? `${tone.border} ${tone.borderHover}`
                    : "border-deep-200 hover:border-brand-400 dark:border-deep-800 dark:hover:border-brand-500",
                ].join(" ")}
              >
                {/* Left accent strip */}
                {tone && (
                  <span
                    className={`absolute inset-y-0 left-0 w-1.5 ${tone.bar}`}
                    aria-hidden
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-deep-500 dark:text-cream-500">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-3xl font-bold tracking-tight text-deep-800 dark:text-cream-100">
                      {stat.value}
                    </div>
                  </div>

                  {/* Icon tile — the tone's identity mark */}
                  {tone && (
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.bgSoft} ${tone.text}`}
                      aria-hidden
                    >
                      {tone.icon}
                    </span>
                  )}
                </div>

                {/* Bottom hint row, tone-colored */}
                {tone && (
                  <div
                    className={`mt-4 inline-flex items-center gap-1 text-xs font-medium ${tone.text} opacity-70 transition group-hover:opacity-100`}
                  >
                    <span>Open module</span>
                    <span aria-hidden>→</span>
                  </div>
                )}
              </button>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DESTINATIONS MODULE                                                        */
/* -------------------------------------------------------------------------- */

function DestinationsModule({
  destinations,
  setDestinations,
  loading,
  tone,
}: {
  destinations: DestinationRow[];
  setDestinations: React.Dispatch<React.SetStateAction<DestinationRow[]>>;
  loading: boolean;
  tone: ModuleTone;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = destinations.find((d) => d.id === editingId);

  function handleCreate() {
    startTransition(async () => {
      try {
        const created = await createDestination();
        setDestinations((curr) => [...curr, created]);
        setEditingId(created.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create");
      }
    });
  }

  async function handleSave(updated: DestinationRow) {
    const previous = destinations;
    setDestinations((curr) => curr.map((d) => (d.id === updated.id ? updated : d)));
    try {
      await updateDestination(updated.id, updated);
      setEditingId(null);
    } catch (err) {
      setDestinations(previous);
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this destination? Cannot be undone.")) return;
    const previous = destinations;
    setDestinations((curr) => curr.filter((d) => d.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try {
        await deleteDestination(id);
      } catch (err) {
        setDestinations(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Destinations"
      description="Manage the destinations displayed on the public destinations page."
      tone={tone}
      action={
        <AddButton onClick={handleCreate} pending={pending} label="Add destination" tone={tone} />
      }
      list={
        <div className="space-y-3">
          {loading && destinations.length === 0 && <LoadingSkeletons />}
          {destinations.map((d, i) => (
            <FadeIn key={d.id} delay={Math.min(i * 0.04, 0.4)}>
              <RowCard
                active={editingId === d.id}
                title={d.name}
                subtitle={d.county + " County"}
                description={d.description}
                badge={d.featured ? "Featured" : undefined}
                onEdit={() => setEditingId(d.id)}
                onDelete={() => handleDelete(d.id)}
                disabled={pending}
                tone={tone}
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <DestinationEditor
            key={editing.id}
            destination={editing}
            tone={tone}
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select a destination"
            description="Choose a destination to edit its content."
            tone={tone}
          />
        )
      }
    />
  );
}

function DestinationEditor({
  destination,
  onClose,
  onSave,
  tone,
}: {
  destination: DestinationRow;
  onClose: () => void;
  onSave: (d: DestinationRow) => void | Promise<void>;
  tone: ModuleTone;
}) {
  const [name, setName] = useState(destination.name);
  const [slug, setSlug] = useState(destination.slug);
  const [county, setCounty] = useState(destination.county);
  const [description, setDescription] = useState(destination.description);
  const [imageUrl, setImageUrl] = useState(destination.imageUrl ?? "");
  const [featured, setFeatured] = useState(destination.featured);
  const [saving, startSave] = useTransition();

  function handleSave() {
    startSave(async () => {
      await onSave({
        ...destination,
        name,
        slug,
        county,
        description,
        imageUrl: imageUrl.trim() || null,
        featured,
      });
    });
  }

  return (
    <EditorShell
      eyebrow="Edit destination"
      title="Destination details"
      onClose={onClose}
      saving={saving}
      onSave={handleSave}
      tone={tone}
    >
      <Field label="Name">
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Slug">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
      </Field>
      <Field label="County">
        <input value={county} onChange={(e) => setCounty(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClass} />
      </Field>
      <Field label="Image URL">
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/images/…" className={inputClass} />
      </Field>
      <ToggleField label="Featured on homepage" checked={featured} onChange={setFeatured} tone={tone} />
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* EXPERIENCES MODULE                                                         */
/* -------------------------------------------------------------------------- */

function ExperiencesModule({
  experiences,
  setExperiences,
  destinations,
  loading,
  tone,
}: {
  experiences: ExperienceRow[];
  setExperiences: React.Dispatch<React.SetStateAction<ExperienceRow[]>>;
  destinations: DestinationRow[];
  loading: boolean;
  tone: ModuleTone;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = experiences.find((e) => e.id === editingId);

  function handleCreate() {
    startTransition(async () => {
      try {
        const created = await createExperience();
        setExperiences((curr) => [...curr, created]);
        setEditingId(created.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create");
      }
    });
  }

  async function handleSave(updated: ExperienceRow) {
    const previous = experiences;
    setExperiences((curr) => curr.map((e) => (e.id === updated.id ? updated : e)));
    try {
      await updateExperience(updated.id, updated);
      setEditingId(null);
    } catch (err) {
      setExperiences(previous);
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this experience?")) return;
    const previous = experiences;
    setExperiences((curr) => curr.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try {
        await deleteExperience(id);
      } catch (err) {
        setExperiences(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Experiences"
      description="Manage attractions and experiences across all destinations."
      tone={tone}
      action={<AddButton onClick={handleCreate} pending={pending} label="Add experience" tone={tone} />}
      list={
        <div className="space-y-3">
          {loading && experiences.length === 0 && <LoadingSkeletons />}
          {experiences.map((e, i) => (
            <FadeIn key={e.id} delay={Math.min(i * 0.04, 0.4)}>
              <RowCard
                active={editingId === e.id}
                title={e.name}
                subtitle={`${e.category} · ${e.destinationName}`}
                description={e.description}
                onEdit={() => setEditingId(e.id)}
                onDelete={() => handleDelete(e.id)}
                disabled={pending}
                tone={tone}
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <ExperienceEditor
            key={editing.id}
            experience={editing}
            destinations={destinations}
            tone={tone}
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select an experience"
            description="Choose an experience to edit."
            tone={tone}
          />
        )
      }
    />
  );
}

function ExperienceEditor({
  experience,
  destinations,
  onClose,
  onSave,
  tone,
}: {
  experience: ExperienceRow;
  destinations: DestinationRow[];
  onClose: () => void;
  onSave: (e: ExperienceRow) => void | Promise<void>;
  tone: ModuleTone;
}) {
  const [name, setName] = useState(experience.name);
  const [slug, setSlug] = useState(experience.slug);
  const [description, setDescription] = useState(experience.description);
  const [category, setCategory] = useState(experience.category);
  const [imageUrl, setImageUrl] = useState(experience.imageUrl ?? "");
  const [destinationId, setDestinationId] = useState(experience.destinationId);
  const [saving, startSave] = useTransition();

  function handleSave() {
    startSave(async () => {
      const dest = destinations.find((d) => d.id === destinationId);
      await onSave({
        ...experience,
        name,
        slug,
        description,
        category,
        imageUrl: imageUrl.trim() || null,
        destinationId,
        destinationName: dest?.name ?? experience.destinationName,
      });
    });
  }

  return (
    <EditorShell
      eyebrow="Edit experience"
      title="Experience details"
      onClose={onClose}
      saving={saving}
      onSave={handleSave}
      tone={tone}
    >
      <Field label="Name">
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Slug">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Category">
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Wildlife, Cultural, Beach, Adventure" className={inputClass} />
      </Field>
      <Field label="Destination">
        <select
          value={destinationId}
          onChange={(e) => setDestinationId(Number(e.target.value))}
          className={inputClass}
        >
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClass} />
      </Field>
      <Field label="Image URL">
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} />
      </Field>
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* PACKAGES MODULE                                                            */
/* -------------------------------------------------------------------------- */

function PackagesModule({
  packages,
  setPackages,
  destinations,
  loading,
  tone,
}: {
  packages: PackageRow[];
  setPackages: React.Dispatch<React.SetStateAction<PackageRow[]>>;
  destinations: DestinationRow[];
  loading: boolean;
  tone: ModuleTone;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = packages.find((p) => p.id === editingId);

  function handleCreate() {
    startTransition(async () => {
      try {
        const created = await createPackage();
        setPackages((curr) => [...curr, created]);
        setEditingId(created.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create");
      }
    });
  }

  async function handleSave(updated: PackageRow) {
    const previous = packages;
    setPackages((curr) => curr.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await updatePackage(updated.id, updated);
      setEditingId(null);
    } catch (err) {
      setPackages(previous);
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this package?")) return;
    const previous = packages;
    setPackages((curr) => curr.filter((p) => p.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try {
        await deletePackage(id);
      } catch (err) {
        setPackages(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Packages"
      description="Manage tour packages and pricing."
      tone={tone}
      action={<AddButton onClick={handleCreate} pending={pending} label="Add package" tone={tone} />}
      list={
        <div className="space-y-3">
          {loading && packages.length === 0 && <LoadingSkeletons />}
          {packages.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 0.04, 0.4)}>
              <RowCard
                active={editingId === p.id}
                title={p.title}
                subtitle={`${p.destinationName} · ${p.durationDays} days · KES ${p.priceKes.toLocaleString()}`}
                description={p.summary}
                badge={p.featured ? "Featured" : undefined}
                onEdit={() => setEditingId(p.id)}
                onDelete={() => handleDelete(p.id)}
                disabled={pending}
                tone={tone}
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <PackageEditor
            key={editing.id}
            pkg={editing}
            destinations={destinations}
            tone={tone}
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select a package"
            description="Choose a package to edit."
            tone={tone}
          />
        )
      }
    />
  );
}

function PackageEditor({
  pkg,
  destinations,
  onClose,
  onSave,
  tone,
}: {
  pkg: PackageRow;
  destinations: DestinationRow[];
  onClose: () => void;
  onSave: (p: PackageRow) => void | Promise<void>;
  tone: ModuleTone;
}) {
  const [title, setTitle] = useState(pkg.title);
  const [slug, setSlug] = useState(pkg.slug);
  const [summary, setSummary] = useState(pkg.summary);
  const [description, setDescription] = useState(pkg.description);
  const [priceKes, setPriceKes] = useState(pkg.priceKes);
  const [durationDays, setDurationDays] = useState(pkg.durationDays);
  const [imageUrl, setImageUrl] = useState(pkg.imageUrl ?? "");
  const [featured, setFeatured] = useState(pkg.featured);
  const [destinationId, setDestinationId] = useState(pkg.destinationId);
  const [saving, startSave] = useTransition();

  function handleSave() {
    startSave(async () => {
      const dest = destinations.find((d) => d.id === destinationId);
      await onSave({
        ...pkg,
        title, slug, summary, description,
        priceKes, durationDays,
        imageUrl: imageUrl.trim() || null,
        featured,
        destinationId,
        destinationName: dest?.name ?? pkg.destinationName,
      });
    });
  }

  return (
    <EditorShell
      eyebrow="Edit package"
      title="Package details"
      onClose={onClose}
      saving={saving}
      onSave={handleSave}
      tone={tone}
    >
      <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} /></Field>
      <Field label="Slug"><input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} /></Field>
      <Field label="Destination">
        <select value={destinationId} onChange={(e) => setDestinationId(Number(e.target.value))} className={inputClass}>
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (KES)">
          <input type="number" value={priceKes} onChange={(e) => setPriceKes(Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="Duration (days)">
          <input type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className={inputClass} />
        </Field>
      </div>
      <Field label="Summary"><textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={inputClass} /></Field>
      <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClass} /></Field>
      <Field label="Image URL"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} /></Field>
      <ToggleField label="Featured" checked={featured} onChange={setFeatured} tone={tone} />
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* STAY MODULE                                                                */
/* -------------------------------------------------------------------------- */

function StaysModule({
  stays,
  setStays,
  destinations,
  loading,
  tone,
}: {
  stays: StayRow[];
  setStays: React.Dispatch<React.SetStateAction<StayRow[]>>;
  destinations: DestinationRow[];
  loading: boolean;
  tone: ModuleTone;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = stays.find((s) => s.id === editingId);

  function handleCreate() {
    startTransition(async () => {
      try {
        const created = await createStay();
        setStays((curr) => [...curr, created]);
        setEditingId(created.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create");
      }
    });
  }

  async function handleSave(updated: StayRow) {
    const previous = stays;
    setStays((curr) => curr.map((s) => (s.id === updated.id ? updated : s)));
    try {
      await updateStay(updated.id, updated);
      setEditingId(null);
    } catch (err) {
      setStays(previous);
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this stay?")) return;
    const previous = stays;
    setStays((curr) => curr.filter((s) => s.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try {
        await deleteStay(id);
      } catch (err) {
        setStays(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Stay"
      description="Manage hotels, lodges, resorts and camps."
      tone={tone}
      action={<AddButton onClick={handleCreate} pending={pending} label="Add stay" tone={tone} />}
      list={
        <div className="space-y-3">
          {loading && stays.length === 0 && <LoadingSkeletons />}
          {stays.map((s, i) => (
            <FadeIn key={s.id} delay={Math.min(i * 0.04, 0.4)}>
              <RowCard
                active={editingId === s.id}
                title={s.name}
                subtitle={`${s.type} · ${s.location}`}
                description={s.description}
                badge={s.priceRange ?? undefined}
                onEdit={() => setEditingId(s.id)}
                onDelete={() => handleDelete(s.id)}
                disabled={pending}
                tone={tone}
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <StayEditor
            key={editing.id}
            stay={editing}
            destinations={destinations}
            tone={tone}
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select a stay"
            description="Choose a stay to edit."
            tone={tone}
          />
        )
      }
    />
  );
}

function StayEditor({
  stay,
  destinations,
  onClose,
  onSave,
  tone,
}: {
  stay: StayRow;
  destinations: DestinationRow[];
  onClose: () => void;
  onSave: (s: StayRow) => void | Promise<void>;
  tone: ModuleTone;
}) {
  const [name, setName] = useState(stay.name);
  const [slug, setSlug] = useState(stay.slug);
  const [type, setType] = useState(stay.type);
  const [description, setDescription] = useState(stay.description);
  const [location, setLocation] = useState(stay.location);
  const [priceRange, setPriceRange] = useState(stay.priceRange ?? "");
  const [imageUrl, setImageUrl] = useState(stay.imageUrl ?? "");
  const [destinationId, setDestinationId] = useState(stay.destinationId);
  const [saving, startSave] = useTransition();

  function handleSave() {
    startSave(async () => {
      const dest = destinations.find((d) => d.id === destinationId);
      await onSave({
        ...stay,
        name, slug, type, description, location,
        priceRange: priceRange.trim() || null,
        imageUrl: imageUrl.trim() || null,
        destinationId,
        destinationName: dest?.name ?? stay.destinationName,
      });
    });
  }

  return (
    <EditorShell
      eyebrow="Edit stay"
      title="Stay details"
      onClose={onClose}
      saving={saving}
      onSave={handleSave}
      tone={tone}
    >
      <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></Field>
      <Field label="Slug"><input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} /></Field>
      <Field label="Type">
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          <option>Hotel</option>
          <option>Lodge</option>
          <option>Resort</option>
          <option>Tented Camp</option>
        </select>
      </Field>
      <Field label="Destination">
        <select value={destinationId} onChange={(e) => setDestinationId(Number(e.target.value))} className={inputClass}>
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </Field>
      <Field label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} /></Field>
      <Field label="Price range"><input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="KES 25,000 - 55,000" className={inputClass} /></Field>
      <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClass} /></Field>
      <Field label="Image URL"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} /></Field>
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* EVENTS MODULE                                                              */
/* -------------------------------------------------------------------------- */

function EventsModule({
  events,
  setEvents,
  loading,
  tone,
}: {
  events: EventRow[];
  setEvents: React.Dispatch<React.SetStateAction<EventRow[]>>;
  loading: boolean;
  tone: ModuleTone;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = events.find((e) => e.id === editingId);

  function handleCreate() {
    startTransition(async () => {
      try {
        const created = await createEvent();
        setEvents((curr) => [...curr, created]);
        setEditingId(created.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create");
      }
    });
  }

  async function handleSave(updated: EventRow) {
    const previous = events;
    setEvents((curr) => curr.map((e) => (e.id === updated.id ? updated : e)));
    try {
      await updateEvent(updated.id, updated);
      setEditingId(null);
    } catch (err) {
      setEvents(previous);
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this event?")) return;
    const previous = events;
    setEvents((curr) => curr.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try {
        await deleteEvent(id);
      } catch (err) {
        setEvents(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Events"
      description="Manage festivals, expos, and seasonal events."
      tone={tone}
      action={<AddButton onClick={handleCreate} pending={pending} label="Add event" tone={tone} />}
      list={
        <div className="space-y-3">
          {loading && events.length === 0 && <LoadingSkeletons />}
          {events.map((e, i) => (
            <FadeIn key={e.id} delay={Math.min(i * 0.04, 0.4)}>
              <RowCard
                active={editingId === e.id}
                title={e.name}
                subtitle={`${e.startDate}${e.endDate ? " – " + e.endDate : ""} · ${e.location}`}
                description={e.description}
                badge={e.featured ? "Featured" : undefined}
                onEdit={() => setEditingId(e.id)}
                onDelete={() => handleDelete(e.id)}
                disabled={pending}
                tone={tone}
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <EventEditor
            key={editing.id}
            event={editing}
            tone={tone}
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select an event"
            description="Choose an event to edit."
            tone={tone}
          />
        )
      }
    />
  );
}

function EventEditor({
  event,
  onClose,
  onSave,
  tone,
}: {
  event: EventRow;
  onClose: () => void;
  onSave: (e: EventRow) => void | Promise<void>;
  tone: ModuleTone;
}) {
  const [name, setName] = useState(event.name);
  const [slug, setSlug] = useState(event.slug);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate ?? "");
  const [imageUrl, setImageUrl] = useState(event.imageUrl ?? "");
  const [featured, setFeatured] = useState(event.featured);
  const [saving, startSave] = useTransition();

  function handleSave() {
    startSave(async () => {
      await onSave({
        ...event,
        name, slug, description, location,
        startDate,
        endDate: endDate || null,
        imageUrl: imageUrl.trim() || null,
        featured,
      });
    });
  }

  return (
    <EditorShell
      eyebrow="Edit event"
      title="Event details"
      onClose={onClose}
      saving={saving}
      onSave={handleSave}
      tone={tone}
    >
      <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></Field>
      <Field label="Slug"><input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} /></Field>
        <Field label="End date"><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} /></Field>
      </div>
      <Field label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} /></Field>
      <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClass} /></Field>
      <Field label="Image URL"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} /></Field>
      <ToggleField label="Featured" checked={featured} onChange={setFeatured} tone={tone} />
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* POSTS MODULE                                                               */
/* -------------------------------------------------------------------------- */

function PostsModule({
  posts,
  setPosts,
  loading,
  tone,
}: {
  posts: PostRow[];
  setPosts: React.Dispatch<React.SetStateAction<PostRow[]>>;
  loading: boolean;
  tone: ModuleTone;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = posts.find((p) => p.id === editingId);

  function handleCreate() {
    startTransition(async () => {
      try {
        const created = await createPost();
        setPosts((curr) => [created, ...curr]);
        setEditingId(created.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create");
      }
    });
  }

  async function handleSave(updated: PostRow) {
    const previous = posts;
    setPosts((curr) => curr.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await updatePost(updated.id, updated);
      setEditingId(null);
    } catch (err) {
      setPosts(previous);
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    const previous = posts;
    setPosts((curr) => curr.filter((p) => p.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try {
        await deletePost(id);
      } catch (err) {
        setPosts(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Blog"
      description="Manage blog posts, tags, and publication."
      tone={tone}
      action={<AddButton onClick={handleCreate} pending={pending} label="Add post" tone={tone} />}
      list={
        <div className="space-y-3">
          {loading && posts.length === 0 && <LoadingSkeletons />}
          {posts.map((p, i) => (
            <FadeIn key={p.id} delay={Math.min(i * 0.04, 0.4)}>
              <RowCard
                active={editingId === p.id}
                title={p.title}
                subtitle={`${p.publishedAt ?? "unpublished"} · ${p.tags.join(", ")}`}
                description={p.excerpt}
                badge={p.published ? "Published" : "Draft"}
                onEdit={() => setEditingId(p.id)}
                onDelete={() => handleDelete(p.id)}
                disabled={pending}
                tone={tone}
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <PostEditor
            key={editing.id}
            post={editing}
            tone={tone}
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select a post"
            description="Choose a post to edit."
            tone={tone}
          />
        )
      }
    />
  );
}

function PostEditor({
  post,
  onClose,
  onSave,
  tone,
}: {
  post: PostRow;
  onClose: () => void;
  onSave: (p: PostRow) => void | Promise<void>;
  tone: ModuleTone;
}) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);
  const [coverImage, setCoverImage] = useState(post.coverImage ?? "");
  const [tagsText, setTagsText] = useState(post.tags.join(", "));
  const [published, setPublished] = useState(post.published);
  const [publishedAt, setPublishedAt] = useState(post.publishedAt ?? "");
  const [saving, startSave] = useTransition();

  function handleSave() {
    startSave(async () => {
      await onSave({
        ...post,
        title, slug, excerpt, content,
        coverImage: coverImage.trim() || null,
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        published,
        publishedAt: publishedAt || null,
      });
    });
  }

  return (
    <EditorShell
      eyebrow="Edit post"
      title="Post details"
      onClose={onClose}
      saving={saving}
      onSave={handleSave}
      tone={tone}
    >
      <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} /></Field>
      <Field label="Slug"><input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} /></Field>
      <Field label="Excerpt"><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className={inputClass} /></Field>
      <Field label="Content">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className={inputClass} />
      </Field>
      <Field label="Cover image URL"><input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClass} /></Field>
      <Field label="Tags (comma separated)">
        <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Safari, Wildlife, Planning" className={inputClass} />
      </Field>
      <Field label="Published date">
        <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass} />
      </Field>
      <ToggleField label="Published (visible on public site)" checked={published} onChange={setPublished} tone={tone} />
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* SHARED COMPONENTS                                                          */
/* -------------------------------------------------------------------------- */

function ModuleLayout({
  title,
  description,
  action,
  list,
  editor,
  tone,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
  list: React.ReactNode;
  editor: React.ReactNode;
  tone: ModuleTone;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <FadeIn>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.bgSoft} ${tone.text}`}
              aria-hidden
            >
              {tone.icon}
            </span>
            <div>
              <h2 className={`text-xl font-bold ${tone.text}`}>{title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
                {description}
              </p>
            </div>
          </div>
          {action}
        </div>
      </FadeIn>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div>{list}</div>
        <div>
          <FadeIn delay={0.15}>{editor}</FadeIn>
        </div>
      </div>
    </div>
  );
}

function RowCard({
  active,
  title,
  subtitle,
  description,
  badge,
  onEdit,
  onDelete,
  disabled,
  tone,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
  tone: ModuleTone;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border bg-cream-50 p-5 pl-6 transition dark:bg-deep-900",
        active
          ? `${tone.border} ring-2 ${tone.ring} ${tone.bgSoft}`
          : `border-deep-200 ${tone.borderHover} dark:border-deep-800`,
      ].join(" ")}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${tone.bar} ${
          active ? "opacity-100" : "opacity-40"
        }`}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-deep-800 dark:text-cream-100">{title}</h3>
            {badge && (
              <span className={`rounded-full ${tone.pillBg} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.pillText}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">{subtitle}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-deep-600 dark:text-cream-400">
            {description || "No description yet."}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${tone.border} ${tone.text} ${tone.bgSoft} hover:opacity-80 dark:hover:opacity-90`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddButton({
  onClick,
  pending,
  label,
  tone,
}: {
  onClick: () => void;
  pending: boolean;
  label: string;
  tone: ModuleTone;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-xl ${tone.button} ${tone.buttonHover} px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <PlusIcon />
      {pending ? "Adding…" : label}
    </button>
  );
}

function EditorShell({
  eyebrow,
  title,
  onClose,
  onSave,
  saving,
  children,
  tone,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
  tone: ModuleTone;
}) {
  return (
    <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900">
      <span className={`block h-1 w-full ${tone.bar}`} aria-hidden />

      <div className="flex items-start justify-between border-b border-deep-200 bg-cream-50 px-5 py-4 dark:border-deep-800 dark:bg-deep-900">
        <div>
          <div className={`text-xs font-semibold uppercase tracking-[0.14em] ${tone.text}`}>
            {eyebrow}
          </div>
          <h3 className="mt-1 font-semibold text-deep-800 dark:text-cream-100">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-deep-400 transition hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-100"
          aria-label="Close editor"
        >
          <XIcon />
        </button>
      </div>

      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
        <div className="space-y-6">
          {children}

          <div className="flex gap-2 border-t border-deep-200 pt-4 dark:border-deep-800">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className={`flex-1 rounded-xl ${tone.button} ${tone.buttonHover} px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-deep-200 px-4 py-2.5 text-sm font-semibold text-deep-600 transition hover:bg-cream-100 dark:border-deep-800 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  tone,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tone: ModuleTone;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border ${tone.border} ${tone.bgSoft} px-3.5 py-3 text-sm`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-deep-300 focus:ring-2 focus:ring-brand-500/30"
        style={{ accentColor: "var(--brand-500)" }}
      />
      <span className="text-deep-700 dark:text-cream-200">{label}</span>
    </label>
  );
}

function EmptyEditorState({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: ModuleTone;
}) {
  return (
    <div
      className={`sticky top-6 rounded-2xl border-2 border-dashed ${tone.border} ${tone.bgSoft} p-8 text-center`}
    >
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${tone.pillBg} ${tone.text}`}
      >
        <PencilLineIcon />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-deep-800 dark:text-cream-100">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-deep-600 dark:text-cream-400">
        {description}
      </p>
    </div>
  );
}

function LoadingSkeletons() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900"
        />
      ))}
    </>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ICONS — inline SVG line icons                                              */
/* -------------------------------------------------------------------------- */

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
};

function GridIcon() {
  return (
    <svg {...iconBase}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function CompassMarkIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="7" cy="9" r="2" />
      <circle cx="12" cy="6.5" r="2" />
      <circle cx="17" cy="9" r="2" />
      <circle cx="5.5" cy="14" r="2" />
      <path d="M9.5 20c1.5-2 4.5-2.5 6-1 1.5 1 3.5 1 5-1" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg {...iconBase}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h9a3 3 0 0 0 0-6H7a3 3 0 0 1 0-6h9" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 20V8m0 5h18v7M21 20v-4a3 3 0 0 0-3-3H9v7" />
      <path d="M6.5 11.5a1.5 1.5 0 1 0 0-.01" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...iconBase}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg {...iconBase}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...iconBase} className="h-5 w-5">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg {...iconBase} className="h-4 w-4">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function PencilLineIcon() {
  return (
    <svg {...iconBase} className="h-5 w-5">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                                                     */
/* -------------------------------------------------------------------------- */

const inputClass =
  "w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-3 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-950";