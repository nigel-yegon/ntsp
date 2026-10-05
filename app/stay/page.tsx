import { prisma } from "@/lib/prisma";
import { StaysGrid } from "./stays-grid";

export const metadata = {
  title: "Where to Stay — NTSP",
  description: "Hotels, lodges, tented camps, and resorts across Kenya.",
};

export const revalidate = 300;

const TYPE_ORDER = ["Hotel", "Lodge", "Resort", "Tented Camp"];

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

  const presentTypes = Array.from(new Set(stays.map((s) => s.type)));
  const types = TYPE_ORDER.filter((t) => presentTypes.includes(t));

  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Rest &amp; recharge
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Where to Stay
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            From beachfront resorts to eco-friendly tented camps.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {stays.length === 0 ? (
          <p className="text-deep-500 dark:text-cream-500">
            No accommodations yet. Run the seed script.
          </p>
        ) : (
          <StaysGrid stays={stays} types={types} destinations={destinations} />
        )}
      </div>
    </div>
  );
}