import { prisma } from "@/lib/prisma";
import { PackagesGrid } from "./packages-grid";

export const metadata = {
  title: "Packages — NTSP",
  description: "Curated safari and beach packages across Kenya.",
};

export const revalidate = 300;

export default async function PackagesPage() {
  const [packages, destinations] = await Promise.all([
    prisma.tourPackage.findMany({
      include: { destination: true },
      orderBy: [{ featured: "desc" }, { priceKes: "asc" }],
    }),
    prisma.destination.findMany({
      where: { packages: { some: {} } }, // only destinations with packages
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Packages</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Curated trips — from a quick day safari to a week-long beach retreat.
        </p>
      </header>

      {packages.length === 0 ? (
        <p className="text-gray-500">No packages yet. Run the seed script.</p>
      ) : (
        <PackagesGrid packages={packages} destinations={destinations} />
      )}
    </div>
  );
}