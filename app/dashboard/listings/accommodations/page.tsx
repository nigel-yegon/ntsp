// app/dashboard/listings/accommodations/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccommodationsListPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "BUSINESS" && session.user.role !== "OPERATOR") {
    redirect("/dashboard");
  }

  const accommodations = await prisma.accommodation.findMany({
    where: { businessId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { destination: { select: { name: true } } },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/listings"
            className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
          >
            ← Back to listings
          </Link>
          <h2 className="mt-2 text-lg font-semibold text-deep-800 dark:text-cream-100">
            Accommodations
          </h2>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            Manage your lodges, camps and resorts.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + Create New Listing
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-500 dark:text-cream-400">
            You haven&apos;t created any accommodations yet.
          </p>
          <Link
            href="/dashboard/listings/new"
            className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Create New Listing →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-cream-300 bg-cream-50 dark:border-deep-700 dark:bg-deep-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-100/50 dark:border-deep-800 dark:bg-deep-950/50">
              <tr>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Name</th>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Type</th>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Location</th>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Status</th>
                <th className="px-4 py-3 text-right font-medium text-deep-600 dark:text-cream-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-deep-800">
              {accommodations.map((acc) => (
                <tr key={acc.id} className="hover:bg-cream-100/50 dark:hover:bg-deep-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-deep-800 dark:text-cream-100">{acc.name}</p>
                  </td>
                  <td className="px-4 py-3 text-deep-600 dark:text-cream-400">{acc.type}</td>
                  <td className="px-4 py-3 text-deep-600 dark:text-cream-400">{acc.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        acc.published
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {acc.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/listings/acc-${acc.id}/edit`}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}