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

  // Other packages at the same destination
  const related = await prisma.tourPackage.findMany({
    where: { destinationId: pkg.destinationId, id: { not: pkg.id } },
    take: 3,
  });

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/packages"
        className="text-sm text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← All packages
      </Link>

      <header className="mt-6 mb-8">
        <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          <Link
            href={`/destinations/${pkg.destination.slug}`}
            className="hover:underline"
          >
            {pkg.destination.name}
          </Link>
          {" · "}
          {pkg.destination.county} County
        </p>
        <h1 className="mt-2 text-3xl font-bold">{pkg.title}</h1>
        <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
          {pkg.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Duration
            </div>
            <div className="mt-0.5 text-lg font-semibold">
              {pkg.durationDays} day{pkg.durationDays > 1 ? "s" : ""}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">
              From
            </div>
            <div className="mt-0.5 font-mono text-lg font-semibold">
              KES {pkg.priceKes.toLocaleString()}
            </div>
          </div>
          <Link
            href="/contact"
            className="ml-auto rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Enquire
          </Link>
        </div>
      </header>

      <section className="prose prose-gray max-w-none dark:prose-invert">
        <h2 className="text-xl font-semibold">About this package</h2>
        <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
          {pkg.description}
        </p>
      </section>

      {pkg.destination.attractions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">What you'll experience</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {pkg.destination.attractions.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/experiences/${a.slug}`}
                  className="text-sm text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
                >
                  → {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pkg.destination.stays.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Where you'll stay</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sample lodges and camps in {pkg.destination.name}:
          </p>
          <ul className="mt-3 space-y-2">
            {pkg.destination.stays.slice(0, 3).map((s) => (
              <li
                key={s.id}
                className="flex items-start justify-between rounded-md border border-gray-200 px-3 py-2 dark:border-gray-800"
              >
                <span className="text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-2 text-gray-500">· {s.type}</span>
                </span>
                <span className="text-xs text-gray-500">{s.priceRange}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-xl font-semibold">
            Other packages at {pkg.destination.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/packages/${r.slug}`}
                className="group rounded-lg border border-gray-200 p-4 transition hover:border-emerald-500 dark:border-gray-800 dark:hover:border-emerald-500"
              >
                <h3 className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {r.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {r.summary}
                </p>
                <p className="mt-2 font-mono text-xs font-bold">
                  KES {r.priceKes.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}