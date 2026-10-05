import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const pkg = await prisma.tourPackage.findFirst({ where: { slug } });
  return { title: pkg ? `${pkg.title} — NTSP` : "Package not found — NTSP" };
}

export default async function PackagePage({ params }: { params: Params }) {
  const { slug } = await params;

  const pkg = await prisma.tourPackage.findFirst({
    where: { slug },
    include: {
      destination: {
        include: {
          attractions: true,
          stays: true,
        },
      },
    },
  });

  if (!pkg) notFound();

  const related = await prisma.tourPackage.findMany({
    where: { destinationId: pkg.destinationId, id: { not: pkg.id } },
    take: 3,
  });

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
          <Link
            href="/packages"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← All packages
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            <Link
              href={`/destinations/${pkg.destination.slug}`}
              className="transition hover:text-brand-700 dark:hover:text-brand-300"
            >
              {pkg.destination.name}
            </Link>
            {" · "}
            {pkg.destination.county} County
          </p>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-deep-800 md:text-5xl dark:text-cream-100">
            {pkg.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-deep-600 dark:text-cream-400">
            {pkg.summary}
          </p>

          {/* Meta strip */}
          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                Duration
              </div>
              <div className="mt-1 text-lg font-semibold text-deep-800 dark:text-cream-100">
                {pkg.durationDays} day{pkg.durationDays > 1 ? "s" : ""}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                From
              </div>
              <div className="mt-1 font-mono text-lg font-semibold text-deep-800 dark:text-cream-100">
                KES {pkg.priceKes.toLocaleString()}
              </div>
            </div>
            <Link
              href="/contact"
              className="ml-auto rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-4xl space-y-14 px-4 py-12">
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
            About this package
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-deep-700 dark:text-cream-300">
            {pkg.description}
          </p>
        </section>

        {/* What you'll experience */}
        {pkg.destination.attractions.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                What you&apos;ll experience
              </h2>
              <Link
                href={`/destinations/${pkg.destination.slug}`}
                className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                See destination →
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {pkg.destination.attractions.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/experiences/${a.slug}`}
                    className="group flex items-start gap-3 rounded-lg border border-deep-200 bg-cream-50 p-4 transition hover:-translate-y-0.5 hover:border-brand-400 dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <div>
                      <p className="font-medium text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                        {a.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-deep-600 dark:text-cream-400">
                        {a.description}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Where you'll stay */}
        {pkg.destination.stays.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-deep-800 dark:text-cream-100">
                  Where you&apos;ll stay
                </h2>
                <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                  Sample lodges and camps in {pkg.destination.name}
                </p>
              </div>
              <Link
                href="/stay"
                className="shrink-0 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                All stays →
              </Link>
            </div>
            <ul className="space-y-2">
              {pkg.destination.stays.slice(0, 3).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/stay/${s.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-lg border border-deep-200 bg-cream-50 px-4 py-3 transition hover:border-brand-400 dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                        {s.name}
                      </p>
                      <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-500">
                        {s.type}
                      </p>
                    </div>
                    {s.priceRange && (
                      <span className="whitespace-nowrap font-mono text-xs font-bold text-deep-800 dark:text-cream-100">
                        {s.priceRange}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related packages */}
        {related.length > 0 && (
          <section className="border-t border-deep-200 pt-8 dark:border-deep-800">
            <h2 className="mb-5 text-2xl font-bold text-deep-800 dark:text-cream-100">
              Other packages at {pkg.destination.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/packages/${r.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <h3 className="text-sm font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                    {r.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-deep-600 dark:text-cream-400">
                    {r.summary}
                  </p>
                  <p className="mt-3 font-mono text-xs font-bold text-deep-800 dark:text-cream-100">
                    KES {r.priceKes.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}