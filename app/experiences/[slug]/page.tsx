import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const attraction = await prisma.attraction.findFirst({ where: { slug } });
  return {
    title: attraction ? `${attraction.name} — NTSP` : "Experience not found — NTSP",
  };
}

export default async function ExperiencePage({ params }: { params: Params }) {
  const { slug } = await params;

  const attraction = await prisma.attraction.findFirst({
    where: { slug },
    include: { destination: true },
  });

  if (!attraction) notFound();

  // Other attractions at the same destination
  const nearby = await prisma.attraction.findMany({
    where: {
      destinationId: attraction.destinationId,
      id: { not: attraction.id },
    },
    take: 3,
  });

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <Link
            href="/experiences"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← All experiences
          </Link>

          <span className="mt-6 inline-block rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
            {attraction.category}
          </span>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            {attraction.name}
          </h1>
          <p className="mt-4 text-sm text-deep-500 dark:text-cream-500">
            📍{" "}
            <Link
              href={`/destinations/${attraction.destination.slug}`}
              className="transition hover:text-brand-600 dark:hover:text-brand-400"
            >
              {attraction.destination.name}
            </Link>
            {" · "}
            {attraction.destination.county} County
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-lg leading-relaxed text-deep-700 dark:text-cream-300">
          {attraction.description}
        </p>

        {/* ─── Nearby at same destination ──────────────────── */}
        {nearby.length > 0 && (
          <section className="mt-14 border-t border-deep-200 pt-8 dark:border-deep-800">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
                  More at {attraction.destination.name}
                </h2>
                <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                  Other experiences in this destination
                </p>
              </div>
              <Link
                href={`/destinations/${attraction.destination.slug}`}
                className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                See destination →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {nearby.map((n) => (
                <Link
                  key={n.id}
                  href={`/experiences/${n.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-4 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <h3 className="text-sm font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {n.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-deep-600 dark:text-cream-400">
                    {n.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Footer link ─────────────────────────────────── */}
        <div className="mt-12 border-t border-deep-200 pt-6 dark:border-deep-800">
          <Link
            href={`/destinations/${attraction.destination.slug}`}
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            See everything at {attraction.destination.name} →
          </Link>
        </div>
      </article>
    </div>
  );
}