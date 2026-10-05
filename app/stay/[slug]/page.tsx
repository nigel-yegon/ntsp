import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const stay = await prisma.accommodation.findFirst({ where: { slug } });
  return { title: stay ? `${stay.name} — NTSP` : "Stay not found — NTSP" };
}

export default async function StayDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const stay = await prisma.accommodation.findFirst({
    where: { slug },
    include: {
      destination: {
        include: {
          attractions: true,
          packages: { where: { featured: true } },
        },
      },
    },
  });

  if (!stay) notFound();

  const nearby = await prisma.accommodation.findMany({
    where: { destinationId: stay.destinationId, id: { not: stay.id } },
    take: 3,
  });

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <Link
            href="/stay"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← All stays
          </Link>

          <span className="mt-6 inline-block rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
            {stay.type}
          </span>
          <h1 className="mt-3 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            {stay.name}
          </h1>
          <p className="mt-3 text-sm text-deep-500 dark:text-cream-500">
            📍 {stay.location}
            {" · "}
            <Link
              href={`/destinations/${stay.destination.slug}`}
              className="transition hover:text-brand-600 dark:hover:text-brand-400"
            >
              {stay.destination.name}
            </Link>
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-lg leading-relaxed text-deep-700 dark:text-cream-300">
          {stay.description}
        </p>

        {stay.priceRange && (
          <div className="mt-8 rounded-lg border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900">
            <div className="text-xs uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
              Typical rates
            </div>
            <div className="mt-1 font-mono text-lg font-semibold text-deep-800 dark:text-cream-100">
              {stay.priceRange}
            </div>
            <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
              Per night, varies by season and room type.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
          >
            Check availability
          </Link>
          <Link
            href={`/destinations/${stay.destination.slug}`}
            className="rounded-md border border-deep-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-cream-100 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:bg-deep-800"
          >
            See the destination
          </Link>
        </div>

        {stay.destination.packages.length > 0 && (
          <section className="mt-14 border-t border-deep-200 pt-8 dark:border-deep-800">
            <h2 className="mb-5 text-xl font-semibold text-deep-800 dark:text-cream-100">
              Featured packages that include this area
            </h2>
            <ul className="space-y-3">
              {stay.destination.packages.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/packages/${p.slug}`}
                    className="group flex items-start justify-between rounded-lg border border-deep-200 bg-cream-50 p-4 transition hover:border-brand-400 dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                  >
                    <div>
                      <p className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                        {p.title}
                      </p>
                      <p className="text-xs text-deep-500 dark:text-cream-500">
                        {p.durationDays} day{p.durationDays > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="whitespace-nowrap font-mono text-sm font-bold text-deep-800 dark:text-cream-100">
                      KES {p.priceKes.toLocaleString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {stay.destination.attractions.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-deep-800 dark:text-cream-100">
              Things to do nearby
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {stay.destination.attractions.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/experiences/${a.slug}`}
                    className="text-sm text-deep-700 transition hover:text-brand-600 dark:text-cream-300 dark:hover:text-brand-400"
                  >
                    → {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {nearby.length > 0 && (
          <section className="mt-14 border-t border-deep-200 pt-8 dark:border-deep-800">
            <h2 className="mb-5 text-xl font-semibold text-deep-800 dark:text-cream-100">
              Other stays at {stay.destination.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {nearby.map((n) => (
                <Link
                  key={n.id}
                  href={`/stay/${n.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-4 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />

                  <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    {n.type}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {n.name}
                  </h3>
                  {n.priceRange && (
                    <p className="mt-2 font-mono text-xs font-bold text-deep-800 dark:text-cream-100">
                      {n.priceRange}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}