// app/dashboard/listings/new/[type]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "../../listing-form";
import { createListing } from "../../listing-actions";

const VALID = ["accommodation", "package"] as const;
type ListingType = (typeof VALID)[number];

export default async function NewListingTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!VALID.includes(type as ListingType)) notFound();
  const listingType = type as ListingType;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // ← Allow both BUSINESS and OPERATOR
  const isAllowed =
    session.user.role === "BUSINESS" || session.user.role === "OPERATOR";
  if (!isAllowed) redirect("/dashboard");

  // Operators can only create packages, not accommodations
  if (session.user.role === "OPERATOR" && listingType === "accommodation") {
    redirect("/dashboard/listings/new/package");
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section className="space-y-6">
      <Link
        href="/dashboard/listings/new"
        className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
      >
        ← Back
      </Link>

      <header>
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          New {listingType === "accommodation" ? "accommodation" : "tour package"}
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {listingType === "accommodation"
            ? "Describe the property. You can edit these details any time."
            : "Describe the itinerary. You can edit these details any time."}
        </p>
      </header>

      <ListingForm
        mode="create"
        type={listingType}
        destinations={destinations}
        onSubmit={createListing}
      />
    </section>
  );
}