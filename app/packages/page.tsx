import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Packages — NTSP",
  description: "Curated safari and beach packages across Kenya.",
};

export const revalidate = 300;

export default async function PackagesPage() {
  const packages = await prisma.tourPackage.findMany({
    include: { destination: true },
    orderBy: [{ featured: "desc" }, { priceKes: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Packages</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Curated trips — from a quick day safari to a week-long beach retreat.
        </p>
      </header>

      {packages.length === 0 ? (
        <p className="text-gray-500">No packages yet. Run the seed script.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((p) => (
            <Link
              key={p.id}
              href={`/packages/${p.slug}`}
              className="group flex flex-col rounded-lg border border-gray-200 p-6 transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:hover:border-brand-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    {p.destination.name}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {p.title}
                  </h2>
                </div>
                {p.featured && (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    Featured
                  </span>
                )}
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {p.summary}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="text-xs text-gray-500">
                  {p.durationDays} day{p.durationDays > 1 ? "s" : ""}
                </span>
                <span className="font-mono text-sm font-bold">
                  KES {p.priceKes.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}