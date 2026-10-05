import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Where to Stay — NTSP",
  description: "Hotels, lodges, tented camps, and resorts across Kenya.",
};

export const revalidate = 300;

export default async function StayPage() {
  const stays = await prisma.accommodation.findMany({
    include: { destination: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  // Group by type
  const byType = stays.reduce<Record<string, typeof stays>>((acc, s) => {
    (acc[s.type] ??= []).push(s);
    return acc;
  }, {});

  const types = Object.keys(byType).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Where to Stay</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From beachfront resorts to eco-friendly tented camps.
        </p>
      </header>

      {types.length === 0 ? (
        <p className="text-gray-500">No accommodations yet. Run the seed script.</p>
      ) : (
        <div className="space-y-12">
          {types.map((type) => (
            <section key={type}>
              <h2 className="mb-4 text-xl font-semibold">{type}s</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {byType[type].map((s) => (
                  <Link
                    key={s.id}
                    href={`/stay/${s.slug}`}
                    className="group flex flex-col rounded-lg border border-gray-200 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
                  >
                    <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                      {s.destination.name}
                    </span>
                    <h3 className="mt-1 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">📍 {s.location}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                      {s.description}
                    </p>
                    {s.priceRange && (
                      <p className="mt-3 font-mono text-xs font-bold">
                        {s.priceRange}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}