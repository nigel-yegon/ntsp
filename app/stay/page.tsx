import { prisma } from "@/lib/prisma";
import { StaysGrid } from "./stays-grid";

export const metadata = {
  title: "Where to Stay — NTSP",
  description: "Hotels, lodges, tented camps, and resorts across Kenya.",
};

export const revalidate = 300;

export default async function StayPage() {
  const [stays, destinations] = await Promise.all([
    prisma.accommodation.findMany({
      include: { destination: true },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
    prisma.destination.findMany({
      where: { stays: { some: {} } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  // Unique types, in a sensible order (not pure alphabetical)
  const TYPE_ORDER = ["Hotel", "Lodge", "Resort", "Tented Camp"];
  const presentTypes = Array.from(new Set(stays.map((s) => s.type)));
  const types = TYPE_ORDER.filter((t) => presentTypes.includes(t));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Where to Stay</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From beachfront resorts to eco-friendly tented camps.
        </p>
      </header>

      {stays.length === 0 ? (
        <p className="text-gray-500">No accommodations yet. Run the seed script.</p>
      ) : (
        <StaysGrid stays={stays} types={types} destinations={destinations} />
      )}
    </div>
  );
}