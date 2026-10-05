import { prisma } from "@/lib/prisma";
import { DestinationsGrid } from "./destination-grid";

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
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Destinations</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From the Maasai Mara to Diani Beach — discover where to go in Kenya.
        </p>
      </header>

      {destinations.length === 0 ? (
        <p className="text-gray-500">No destinations yet. Run the seed script.</p>
      ) : (
        <DestinationsGrid destinations={destinations} />
      )}
    </div>
  );
}