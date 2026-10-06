"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  type: "destination" | "experience" | "package" | "stay" | "event" | "post";
  title: string;
  subtitle: string;
  description: string;
  href: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [destinations, experiences, packages, stays, events, posts] =
    await Promise.all([
      prisma.destination.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          county: true,
          description: true,
        },
      }),
      prisma.attraction.findMany({
        include: { destination: { select: { name: true } } },
      }),
      prisma.tourPackage.findMany({
        include: { destination: { select: { name: true } } },
      }),
      prisma.accommodation.findMany({
        include: { destination: { select: { name: true } } },
      }),
      prisma.event.findMany(),
      prisma.post.findMany({
        where: { published: true },
      }),
    ]);

  const results: SearchResult[] = [];

  for (const d of destinations) {
    if (
      d.name.toLowerCase().includes(q) ||
      d.county.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: `destination-${d.id}`,
        type: "destination",
        title: d.name,
        subtitle: `${d.county} County`,
        description: d.description,
        href: `/destinations/${d.slug}`,
      });
    }
  }

  for (const a of experiences) {
    if (
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.destination.name.toLowerCase().includes(q)
    ) {
      results.push({
        id: `experience-${a.id}`,
        type: "experience",
        title: a.name,
        subtitle: `${a.category} · ${a.destination.name}`,
        description: a.description,
        href: `/experiences/${a.slug}`,
      });
    }
  }

  for (const p of packages) {
    if (
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.destination.name.toLowerCase().includes(q)
    ) {
      results.push({
        id: `package-${p.id}`,
        type: "package",
        title: p.title,
        subtitle: `${p.destination.name} · ${p.durationDays} day${p.durationDays > 1 ? "s" : ""}`,
        description: p.summary,
        href: `/packages/${p.slug}`,
      });
    }
  }

  for (const s of stays) {
    if (
      s.name.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.destination.name.toLowerCase().includes(q)
    ) {
      results.push({
        id: `stay-${s.id}`,
        type: "stay",
        title: s.name,
        subtitle: `${s.type} · ${s.location}`,
        description: s.description,
        href: `/stay/${s.slug}`,
      });
    }
  }

  for (const e of events) {
    if (
      e.name.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: `event-${e.id}`,
        type: "event",
        title: e.name,
        subtitle: e.location,
        description: e.description,
        href: `/events/${e.slug}`,
      });
    }
  }

  for (const post of posts) {
    if (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.toLowerCase().includes(q)
    ) {
      results.push({
        id: `post-${post.id}`,
        type: "post",
        title: post.title,
        subtitle: "From the blog",
        description: post.excerpt,
        href: `/blog/${post.slug}`,
      });
    }
  }

  return results;
}