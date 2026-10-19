// app/explore/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ExploreMap } from "./explore-map";

export const metadata: Metadata = {
  title: "Explore Kenya — NTSP",
  description:
    "Browse destinations, experiences, stays, and tour packages across Kenya on one map.",
};

export type MapPoint = {
  id: string;
  kind: "destination" | "experience" | "stay" | "package";
  title: string;
  subtitle: string | null;
  description: string | null;
  href: string;
  latitude: number;
  longitude: number;
};

export default async function ExplorePage() {
  const [destinations, experiences, stays, packages] = await Promise.all([
    prisma.destination.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        published: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        county: true,
        description: true,
        latitude: true,
        longitude: true,
      },
    }),
    prisma.attraction.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        published: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        latitude: true,
        longitude: true,
      },
    }),
    prisma.accommodation.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        published: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        location: true,
        description: true,
        latitude: true,
        longitude: true,
      },
    }),
    prisma.tourPackage.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        description: true,
        durationDays: true,
        latitude: true,
        longitude: true,
      },
    }),
  ]);

  const points: MapPoint[] = [
    ...destinations.map<MapPoint>((d) => ({
      id: `destination-${d.id}`,
      kind: "destination",
      title: d.name,
      subtitle: `${d.county} County`,
      description: d.description,
      href: `/destinations/${d.slug}`,
      latitude: d.latitude!,
      longitude: d.longitude!,
    })),
    ...experiences.map<MapPoint>((e) => ({
      id: `experience-${e.id}`,
      kind: "experience",
      title: e.name,
      subtitle: e.category,
      description: e.description,
      href: `/experiences/${e.slug}`,
      latitude: e.latitude!,
      longitude: e.longitude!,
    })),
    ...stays.map<MapPoint>((s) => ({
      id: `stay-${s.id}`,
      kind: "stay",
      title: s.name,
      subtitle: `${s.type} · ${s.location}`,
      description: s.description,
      href: `/stay/${s.slug}`,
      latitude: s.latitude!,
      longitude: s.longitude!,
    })),
    ...packages.map<MapPoint>((p) => ({
      id: `package-${p.id}`,
      kind: "package",
      title: p.title,
      subtitle: `${p.durationDays} day${p.durationDays === 1 ? "" : "s"}`,
      description: p.summary,
      href: `/packages/${p.slug}`,
      latitude: p.latitude!,
      longitude: p.longitude!,
    })),
  ];

  return (
    <main className="min-h-screen bg-cream-200 dark:bg-deep-950">
      <header className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Discover
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            Explore Kenya on the Map
          </h1>
          <div className="divider-gold mt-4 w-24" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-deep-600 dark:text-cream-300">
            Destinations, experiences, stays, and tour packages — all on one
            map. Filter by type to narrow the view.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ExploreMap points={points} />
      </div>
    </main>
  );
}