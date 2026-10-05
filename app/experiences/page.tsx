import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Experiences — NTSP",
  description: "Wildlife, culture, beach, and adventure experiences across Kenya.",
};

export const revalidate = 300;

export default async function ExperiencesPage() {
  const attractions = await prisma.attraction.findMany({
    include: { destination: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Group by category
  const byCategory = attractions.reduce<Record<string, typeof attractions>>(
    (acc, a) => {
      (acc[a.category] ??= []).push(a);
      return acc;
    },
    {},
  );

  const categories = Object.keys(byCategory).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Experiences</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From the Great Migration to coral reef snorkeling — find what you came for.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className="text-gray-500">No experiences yet. Run the seed script.</p>
      ) : (
        <div className="space-y-12">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[cat].map((a) => (
                  <Link
                    key={a.id}
                    href={`/experiences/${a.slug}`}
                    className="group flex flex-col rounded-lg border border-gray-200 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
                  >
                    <span className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                      {a.destination.name}
                    </span>
                    <h3 className="mt-1 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {a.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                      {a.description}
                    </p>
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