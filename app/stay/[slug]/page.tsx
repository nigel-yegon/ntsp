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

  // Other stays at the same destination
  const nearby = await prisma.accommodation.findMany({
    where: { destinationId: stay.destinationId, id: { not: stay.id } },
    take: 3,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/stay"
        className="text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400"
      >
        ← All stays
      </Link>

      <header className="mt-6 mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
          {stay.type}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{stay.name}</h1>
        <p className="mt-2 text-sm text-gray-500">
          📍 {stay.location}
          {" · "}
          <Link
            href={`/destinations/${stay.destination.slug}`}
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            {stay.destination.name}
          </Link>
        </p>
      </header>

      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {stay.description}
      </p>

      {stay.priceRange && (
        <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Typical rates
          </div>
          <div className="mt-0.5 font-mono text-lg font-semibold">
            {stay.priceRange}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Per night, varies by season and room type.
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href="/contact"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Check availability
        </Link>
        <Link
          href={`/destinations/${stay.destination.slug}`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          See the destination
        </Link>
      </div>

      {stay.destination.packages.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-xl font-semibold">
            Featured packages that include this area
          </h2>
          <ul className="space-y-3">
            {stay.destination.packages.map((p) => (
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
                  <p className="text-xs text-gray-500">
                    {p.durationDays} day{p.durationDays > 1 ? "s" : ""}
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

      {stay.destination.attractions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Things to do nearby</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {stay.destination.attractions.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/experiences/${a.slug}`}
                  className="text-sm text-gray-700 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  → {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-xl font-semibold">
            Other stays at {stay.destination.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {nearby.map((n) => (
              <Link
                key={n.id}
                href={`/stay/${n.slug}`}
                className="group rounded-lg border border-gray-200 p-4 transition hover:border-brand-500 dark:border-gray-800 dark:hover:border-brand-500"
              >
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {n.type}
                </span>
                <h3 className="mt-1 text-sm font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {n.name}
                </h3>
                {n.priceRange && (
                  <p className="mt-1 font-mono text-xs">{n.priceRange}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}