// app/dashboard/listings/packages/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OperatorPackagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // Both BUSINESS and OPERATOR can manage packages
  if (session.user.role !== "BUSINESS" && session.user.role !== "OPERATOR") {
    redirect("/dashboard");
  }

  const packages = await prisma.tourPackage.findMany({
    where: { businessId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: { select: { name: true } },
    },
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
            Tour Packages
          </h2>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            Manage your safari and travel itineraries.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new/package"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + Create Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-500 dark:text-cream-400">
            You haven't created any tour packages yet.
          </p>
          <Link
            href="/dashboard/listings/new/package"
            className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Create your first package →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-cream-300 bg-cream-50 dark:border-deep-700 dark:bg-deep-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-100/50 dark:border-deep-800 dark:bg-deep-950/50">
              <tr>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Package</th>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Destination</th>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Price</th>
                <th className="px-4 py-3 font-medium text-deep-600 dark:text-cream-300">Status</th>
                <th className="px-4 py-3 text-right font-medium text-deep-600 dark:text-cream-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 dark:divide-deep-800">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-cream-100/50 dark:hover:bg-deep-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-deep-800 dark:text-cream-100">{pkg.title}</p>
                    <p className="text-xs text-deep-500 dark:text-cream-500">{pkg.durationDays} days</p>
                  </td>
                  <td className="px-4 py-3 text-deep-600 dark:text-cream-400">
                    {pkg.destination.name}
                  </td>
                  <td className="px-4 py-3 text-deep-600 dark:text-cream-400">
                    KES {pkg.priceKes.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        pkg.published
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {pkg.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/listings/${pkg.id}/edit`}
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