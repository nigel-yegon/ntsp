import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Destinations — NTSP",
  description: "Explore Kenya's counties, parks, and cities.",
};

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Destinations</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From the Maasai Mara to Diani Beach — discover where to go in Kenya.
        </p>
      </header>

      {destinations.length === 0 ? (
        <p className="text-gray-500">No destinations yet. Run the seed script.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group rounded-lg border border-gray-200 p-5 transition hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:hover:border-emerald-500"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {d.name}
                </h2>
                {d.featured && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500">
                {d.county} County
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                {d.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}