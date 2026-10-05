import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const attraction = await prisma.attraction.findFirst({ where: { slug } });
  return {
    title: attraction ? `${attraction.name} — NTSP` : "Experience not found — NTSP",
  };
}

export default async function ExperiencePage({ params }: { params: Params }) {
  const { slug } = await params;

  const attraction = await prisma.attraction.findFirst({
    where: { slug },
    include: { destination: true },
  });

  if (!attraction) notFound();

  // Other attractions at the same destination
  const nearby = await prisma.attraction.findMany({
    where: {
      destinationId: attraction.destinationId,
      id: { not: attraction.id },
    },
    take: 3,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/experiences"
        className="text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400"
      >
        ← All experiences
      </Link>

      <header className="mt-6 mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-200">
          {attraction.category}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{attraction.name}</h1>
        <p className="mt-2 text-sm text-gray-500">
          📍{" "}
          <Link
            href={`/destinations/${attraction.destination.slug}`}
            className="hover:text-brand-600 dark:hover:text-brand-400"
          >
            {attraction.destination.name}
          </Link>
          {" · "}
          {attraction.destination.county} County
        </p>
      </header>

      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {attraction.description}
      </p>

      {nearby.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-xl font-semibold">
            More at {attraction.destination.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {nearby.map((n) => (
              <Link
                key={n.id}
                href={`/experiences/${n.slug}`}
                className="group rounded-lg border border-gray-200 p-4 transition hover:border-brand-500 dark:border-gray-800 dark:hover:border-brand-500"
              >
                <h3 className="text-sm font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {n.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {n.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link
          href={`/destinations/${attraction.destination.slug}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          See everything at {attraction.destination.name} →
        </Link>
      </div>
    </article>
  );
}