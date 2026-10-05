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

export function DashboardClient() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const [search, setSearch] = useState("");

  /* ---- Data state ---- */
  const [destinations, setDestinations] = useState<DestinationRow[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [stays, setStays] = useState<StayRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---- Initial load ---- */
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);
        const [
          destRows,
          expRows,
          pkgRows,
          stayRows,
          eventRows,
          postRows,
        ] = await Promise.all([
          listDestinations(),
          listExperiences(),
          listPackages(),
          listStays(),
          listEvents(),
          listPosts(),
        ]);

        if (cancelled) return;
        setDestinations(destRows);
        setExperiences(expRows);
        setPackages(pkgRows);
        setStays(stayRows);
        setEvents(eventRows);
        setPosts(postRows);
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

  /* ---- Filtered lists ---- */
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

  /* ---- Dashboard stats ---- */
  const stats = [
    { label: "Destinations", value: destinations.length, module: "destinations" as ModuleKey },
    { label: "Experiences",  value: experiences.length,  module: "experiences"  as ModuleKey },
    { label: "Packages",     value: packages.length,     module: "packages"     as ModuleKey },
    { label: "Stays",        value: stays.length,        module: "stay"         as ModuleKey },
    { label: "Events",       value: events.length,       module: "events"       as ModuleKey },
    { label: "Blog posts",   value: posts.length,        module: "blog"         as ModuleKey },
  ];

  /* ---- Render ---- */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      <div className="flex min-h-screen">
        <DashboardSidebar activeModule={activeModule} onNavigate={setActiveModule} />

        <main className="min-w-0 flex-1">
          <DashboardHeader
            activeModule={activeModule}
            search={search}
            setSearch={setSearch}
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
              />
            )}

            {activeModule === "experiences" && (
              <ExperiencesModule
                experiences={filteredExperiences}
                setExperiences={setExperiences}
                destinations={destinations}
                loading={loading}
              />
            )}

            {activeModule === "packages" && (
              <PackagesModule
                packages={filteredPackages}
                setPackages={setPackages}
                destinations={destinations}
                loading={loading}
              />
            )}

            {activeModule === "stay" && (
              <StaysModule
                stays={filteredStays}
                setStays={setStays}
                destinations={destinations}
                loading={loading}
              />
            )}

            {activeModule === "events" && (
              <EventsModule
                events={filteredEvents}
                setEvents={setEvents}
                loading={loading}
              />
            )}

            {activeModule === "blog" && (
              <PostsModule
                posts={filteredPosts}
                setPosts={setPosts}
                loading={loading}
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
  const modules: { key: ModuleKey; label: string; description: string; icon: string }[] = [
    { key: "overview",     label: "Overview",     description: "Dashboard summary", icon: "📊" },
    { key: "destinations", label: "Destinations", description: "Manage destinations", icon: "📍" },
    { key: "experiences",  label: "Experiences",  description: "Manage experiences", icon: "🦁" },
    { key: "packages",     label: "Packages",     description: "Manage packages", icon: "🧭" },
    { key: "stay",         label: "Stay",         description: "Manage accommodation", icon: "🏨" },
    { key: "events",       label: "Events",       description: "Manage events", icon: "📅" },
    { key: "blog",         label: "Blog",         description: "Manage blog posts", icon: "📝" },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white dark:border-white/10 dark:bg-ink-900 lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <Link href="/" className="block">
            <div className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              NTSP<span className="text-brand-600">.</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Content Dashboard
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Content
          </div>
          <nav className="space-y-1">
            {modules.map((m) => {
              const active = activeModule === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onNavigate(m.key)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                    active
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
                  ].join(" ")}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{m.label}</span>
                    <span className="block truncate text-xs text-slate-400">
                      {m.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-white/10">
          <Link
            href="/"
            className="block rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
          >
            ← View public site
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
}: {
  activeModule: ModuleKey;
  search: string;
  setSearch: (v: string) => void;
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
    <header className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-ink-900">
      <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-brand-600">
            NTSP Content
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {titles[activeModule]}
          </h1>
        </div>

        {searchable && (
          <div className="relative w-full lg:w-80">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${titles[activeModule].toLowerCase()}...`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
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
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Overview</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage all content that appears on the NTSP public site.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.05}>
            <button
              type="button"
              onClick={() => onNavigate(stat.module)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-white/10 dark:bg-ink-900 dark:hover:border-brand-500/30"
            >
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
              <div className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {stat.value}
              </div>
            </button>
          </FadeIn>
        ))}
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
}: {
  destinations: DestinationRow[];
  setDestinations: React.Dispatch<React.SetStateAction<DestinationRow[]>>;
  loading: boolean;
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
      action={
        <AddButton onClick={handleCreate} pending={pending} label="Add destination" />
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
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState
            title="Select a destination"
            description="Choose a destination to edit its content."
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
}: {
  destination: DestinationRow;
  onClose: () => void;
  onSave: (d: DestinationRow) => void | Promise<void>;
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
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm dark:border-white/10 dark:bg-white/5">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-slate-700 dark:text-slate-200">Featured on homepage</span>
      </label>
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
}: {
  experiences: ExperienceRow[];
  setExperiences: React.Dispatch<React.SetStateAction<ExperienceRow[]>>;
  destinations: DestinationRow[];
  loading: boolean;
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
      try { await deleteExperience(id); }
      catch (err) {
        setExperiences(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Experiences"
      description="Manage attractions and experiences across all destinations."
      action={<AddButton onClick={handleCreate} pending={pending} label="Add experience" />}
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
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState title="Select an experience" description="Choose an experience to edit." />
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
}: {
  experience: ExperienceRow;
  destinations: DestinationRow[];
  onClose: () => void;
  onSave: (e: ExperienceRow) => void | Promise<void>;
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
}: {
  packages: PackageRow[];
  setPackages: React.Dispatch<React.SetStateAction<PackageRow[]>>;
  destinations: DestinationRow[];
  loading: boolean;
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
      try { await deletePackage(id); }
      catch (err) {
        setPackages(previous);
        alert(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <ModuleLayout
      title="Packages"
      description="Manage tour packages and pricing."
      action={<AddButton onClick={handleCreate} pending={pending} label="Add package" />}
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
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState title="Select a package" description="Choose a package to edit." />
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
}: {
  pkg: PackageRow;
  destinations: DestinationRow[];
  onClose: () => void;
  onSave: (p: PackageRow) => void | Promise<void>;
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
    <EditorShell eyebrow="Edit package" title="Package details" onClose={onClose} saving={saving} onSave={handleSave}>
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
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm dark:border-white/10 dark:bg-white/5">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-slate-700 dark:text-slate-200">Featured</span>
      </label>
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
}: {
  stays: StayRow[];
  setStays: React.Dispatch<React.SetStateAction<StayRow[]>>;
  destinations: DestinationRow[];
  loading: boolean;
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
      } catch (err) { alert(err instanceof Error ? err.message : "Failed to create"); }
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
      try { await deleteStay(id); }
      catch (err) { setStays(previous); alert(err instanceof Error ? err.message : "Failed to delete"); }
    });
  }

  return (
    <ModuleLayout
      title="Stay"
      description="Manage hotels, lodges, resorts and camps."
      action={<AddButton onClick={handleCreate} pending={pending} label="Add stay" />}
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
            onClose={() => setEditingId(null)}
            onSave={handleSave}
          />
        ) : (
          <EmptyEditorState title="Select a stay" description="Choose a stay to edit." />
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
}: {
  stay: StayRow;
  destinations: DestinationRow[];
  onClose: () => void;
  onSave: (s: StayRow) => void | Promise<void>;
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
    <EditorShell eyebrow="Edit stay" title="Stay details" onClose={onClose} saving={saving} onSave={handleSave}>
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
}: {
  events: EventRow[];
  setEvents: React.Dispatch<React.SetStateAction<EventRow[]>>;
  loading: boolean;
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
      } catch (err) { alert(err instanceof Error ? err.message : "Failed to create"); }
    });
  }

  async function handleSave(updated: EventRow) {
    const previous = events;
    setEvents((curr) => curr.map((e) => (e.id === updated.id ? updated : e)));
    try { await updateEvent(updated.id, updated); setEditingId(null); }
    catch (err) { setEvents(previous); alert(err instanceof Error ? err.message : "Failed to save"); }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this event?")) return;
    const previous = events;
    setEvents((curr) => curr.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try { await deleteEvent(id); }
      catch (err) { setEvents(previous); alert(err instanceof Error ? err.message : "Failed to delete"); }
    });
  }

  return (
    <ModuleLayout
      title="Events"
      description="Manage festivals, expos, and seasonal events."
      action={<AddButton onClick={handleCreate} pending={pending} label="Add event" />}
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
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <EventEditor key={editing.id} event={editing} onClose={() => setEditingId(null)} onSave={handleSave} />
        ) : (
          <EmptyEditorState title="Select an event" description="Choose an event to edit." />
        )
      }
    />
  );
}

function EventEditor({
  event,
  onClose,
  onSave,
}: {
  event: EventRow;
  onClose: () => void;
  onSave: (e: EventRow) => void | Promise<void>;
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
    <EditorShell eyebrow="Edit event" title="Event details" onClose={onClose} saving={saving} onSave={handleSave}>
      <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></Field>
      <Field label="Slug"><input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} /></Field>
        <Field label="End date"><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} /></Field>
      </div>
      <Field label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} /></Field>
      <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={inputClass} /></Field>
      <Field label="Image URL"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} /></Field>
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm dark:border-white/10 dark:bg-white/5">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-slate-700 dark:text-slate-200">Featured</span>
      </label>
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
}: {
  posts: PostRow[];
  setPosts: React.Dispatch<React.SetStateAction<PostRow[]>>;
  loading: boolean;
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
      } catch (err) { alert(err instanceof Error ? err.message : "Failed to create"); }
    });
  }

  async function handleSave(updated: PostRow) {
    const previous = posts;
    setPosts((curr) => curr.map((p) => (p.id === updated.id ? updated : p)));
    try { await updatePost(updated.id, updated); setEditingId(null); }
    catch (err) { setPosts(previous); alert(err instanceof Error ? err.message : "Failed to save"); }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    const previous = posts;
    setPosts((curr) => curr.filter((p) => p.id !== id));
    if (editingId === id) setEditingId(null);
    startTransition(async () => {
      try { await deletePost(id); }
      catch (err) { setPosts(previous); alert(err instanceof Error ? err.message : "Failed to delete"); }
    });
  }

  return (
    <ModuleLayout
      title="Blog"
      description="Manage blog posts, tags, and publication."
      action={<AddButton onClick={handleCreate} pending={pending} label="Add post" />}
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
              />
            </FadeIn>
          ))}
        </div>
      }
      editor={
        editing ? (
          <PostEditor key={editing.id} post={editing} onClose={() => setEditingId(null)} onSave={handleSave} />
        ) : (
          <EmptyEditorState title="Select a post" description="Choose a post to edit." />
        )
      }
    />
  );
}

function PostEditor({
  post,
  onClose,
  onSave,
}: {
  post: PostRow;
  onClose: () => void;
  onSave: (p: PostRow) => void | Promise<void>;
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
    <EditorShell eyebrow="Edit post" title="Post details" onClose={onClose} saving={saving} onSave={handleSave}>
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
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm dark:border-white/10 dark:bg-white/5">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-slate-700 dark:text-slate-200">Published (visible on public site)</span>
      </label>
    </EditorShell>
  );
}

/* -------------------------------------------------------------------------- */
/* SHARED COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function ModuleLayout({
  title,
  description,
  action,
  list,
  editor,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
  list: React.ReactNode;
  editor: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <FadeIn>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {description}
            </p>
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
}: {
  active: boolean;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-5 transition dark:bg-ink-900",
        active
          ? "border-brand-300 ring-2 ring-brand-500/10 dark:border-brand-500/40"
          : "border-slate-200 dark:border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-950 dark:text-white">{title}</h3>
            {badge && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description || "No description yet."}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
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
}: {
  onClick: () => void;
  pending: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      + {pending ? "Adding…" : label}
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
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-ink-900">
      <div className="sticky -top-5 z-10 -mx-5 -mt-5 mb-4 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-ink-900">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            {eyebrow}
          </div>
          <h3 className="mt-1 font-semibold text-slate-950 dark:text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
          aria-label="Close editor"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {children}

        <div className="flex gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmptyEditorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="sticky top-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-white/10 dark:bg-ink-900">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5">
        ✎
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
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
          className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-ink-900"
        />
      ))}
    </>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10";