// app/dashboard/listings/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ListingsOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "BUSINESS" && session.user.role !== "OPERATOR") {
    redirect("/dashboard");
  }

  const [packageCount, accommodationCount] = await Promise.all([
    prisma.tourPackage.count({ where: { businessId: session.user.id } }),
    prisma.accommodation.count({ where: { businessId: session.user.id } }),
  ]);

  const cards = [
    {
      href: "/dashboard/listings/packages",
      title: "Tour Packages",
      description: "Safari itineraries and multi-day trips.",
      count: packageCount,
      noun: "package",
    },
    {
      href: "/dashboard/listings/accommodations",
      title: "Accommodations",
      description: "Lodges, camps, resorts and hotels.",
      count: accommodationCount,
      noun: "accommodation",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
            Listings
          </h1>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            Manage what travellers see from your business.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + Create New Listing
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.href}
            className="flex flex-col rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-deep-800 dark:text-cream-100">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
                  {c.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-deep-600 dark:bg-deep-800 dark:text-cream-400">
                {c.count} {c.count === 1 ? c.noun : `${c.noun}s`}
              </span>
            </div>
            <div className="mt-4">
              <Link
                href={c.href}
                className="rounded-lg border border-deep-200 px-3 py-1.5 text-sm font-medium text-deep-700 transition hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
              >
                View all
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}