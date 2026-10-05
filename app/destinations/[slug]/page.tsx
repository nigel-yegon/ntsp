import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const d = await prisma.destination.findFirst({ where: { slug } });
  return { title: d ? `${d.name} — NTSP` : "Not found — NTSP" };
}

export default async function DestinationPage({ params }: { params: Params }) {
  const { slug } = await params;

  const destination = await prisma.destination.findFirst({
    where: { slug },
    include: {
      attractions: true,
      packages: { where: { featured: true } },
      stays: true,
    },
  });

  if (!destination) notFound();

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
          <Link
            href="/destinations"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← All destinations
          </Link>

          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            {destination.county} County
          </span>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            {destination.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-deep-600 dark:text-cream-400">
            {destination.description}
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-4xl space-y-14 px-4 py-12">
        {/* ─── Attractions ─────────────────────────────────── */}
        {destination.attractions.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Things to See &amp; Do
                </h2>
                <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                  {destination.attractions.length} experience
                  {destination.attractions.length === 1 ? "" : "s"} in this destination
                </p>
              </div>
              <Link
                href="/experiences"
                className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Browse all →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {destination.attractions.map((a) => (
                <Link
                  key={a.id}
                  href={`/experiences/${a.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />

                  <span className="inline-block w-fit rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    {a.category}
                  </span>
                  <h3 className="mt-2 font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {a.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                    {a.description}
                  </p>
                  <span className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Packages ────────────────────────────────────── */}
        {destination.packages.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Featured Packages
                </h2>
                <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                  Curated trips that include this destination
                </p>
              </div>
              <Link
                href="/packages"
                className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Browse all →
              </Link>
            </div>

            <div className="space-y-3">
              {destination.packages.map((p) => (
                <Link
                  key={p.id}
                  href={`/packages/${p.slug}`}
                  className="group relative flex flex-col justify-between gap-3 overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500 sm:flex-row sm:items-center"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-brand-500 transition-transform duration-300 group-hover:scale-y-100"
                    aria-hidden
                  />

                  <div className="min-w-0">
                    <h3 className="font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                      {p.durationDays} day{p.durationDays > 1 ? "s" : ""} · {p.summary}
                    </p>
                  </div>

                  <span className="whitespace-nowrap font-mono text-sm font-bold text-deep-800 dark:text-cream-100">
                    KES {p.priceKes.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Stays ───────────────────────────────────────── */}
        {destination.stays.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Where to Stay
                </h2>
                <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                  {destination.stays.length} option
                  {destination.stays.length === 1 ? "" : "s"} nearby
                </p>
              </div>
              <Link
                href="/stay"
                className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Browse all →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {destination.stays.map((s) => (
                <Link
                  key={s.id}
                  href={`/stay/${s.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />

                  <span className="inline-block w-fit rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    {s.type}
                  </span>
                  <h3 className="mt-2 font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
                    📍 {s.location}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                    {s.description}
                  </p>
                  {s.priceRange && (
                    <p className="mt-3 font-mono text-xs font-bold text-deep-800 dark:text-cream-100">
                      {s.priceRange}
                    </p>
                  )}
                  <span className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-400">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Empty state ─────────────────────────────────── */}
        {destination.attractions.length === 0 &&
          destination.packages.length === 0 &&
          destination.stays.length === 0 && (
            <div className="rounded-lg border border-dashed border-deep-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
              <p className="text-sm text-deep-600 dark:text-cream-400">
                No content linked to this destination yet.
              </p>
            </div>
          )}

        {/* ─── Bottom navigation ───────────────────────────── */}
        <div className="border-t border-deep-200 pt-6 dark:border-deep-800">
          <Link
            href="/destinations"
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            ← Back to all destinations
          </Link>
        </div>
      </article>
    </div>
  );
}