import { prisma } from "@/lib/prisma";
import { ExperiencesGrid } from "./experiences-grid";

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

  // Unique categories, in alphabetical order
  const categories = Array.from(
    new Set(attractions.map((a) => a.category)),
  ).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Experiences</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From the Great Migration to coral reef snorkeling — find what you came for.
        </p>
      </header>

      {attractions.length === 0 ? (
        <p className="text-gray-500">No experiences yet. Run the seed script.</p>
      ) : (
        <ExperiencesGrid attractions={attractions} categories={categories} />
      )}
    </div>
  );
}