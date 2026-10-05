import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const d = await prisma.destination.findUnique({ where: { slug } });
  return { title: d ? `${d.name} — NTSP` : "Not found — NTSP" };
}

export default async function DestinationPage({ params }: { params: Params }) {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      attractions: true,
      packages: { where: { featured: true } },
      stays: true,
    },
  });

  if (!destination) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/destinations"
        className="text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400"
      >
        ← All destinations
      </Link>

      <header className="mt-6 mb-8">
        <h1 className="text-4xl font-bold">{destination.name}</h1>
        <p className="mt-1 text-sm uppercase tracking-wide text-gray-500">
          {destination.county} County
        </p>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          {destination.description}
        </p>
      </header>

      {destination.attractions.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Things to See & Do</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {destination.attractions.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
              >
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {a.category}
                </span>
                <h3 className="mt-2 font-semibold">{a.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {destination.packages.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Featured Packages</h2>
          <ul className="space-y-3">
            {destination.packages.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
              >
                <div>
                  <Link
                    href={`/packages/${p.slug}`}
                    className="font-semibold hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {p.title}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {p.durationDays} day{p.durationDays > 1 ? "s" : ""} · {p.summary}
                  </p>
                </div>
                <span className="whitespace-nowrap font-mono text-sm font-bold">
                  KES {p.priceKes.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {destination.stays.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Where to Stay</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {destination.stays.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
              >
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {s.type}
                </span>
                <h3 className="mt-2 font-semibold">{s.name}</h3>
                <p className="text-xs text-gray-500">{s.location}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {s.description}
                </p>
                {s.priceRange && (
                  <p className="mt-2 text-sm font-medium">{s.priceRange}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}