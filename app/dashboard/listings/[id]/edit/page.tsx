// app/dashboard/listings/[id]/edit/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "../../listing-form";
import type { ListingInput } from "../../listing-actions";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  if (session.user.role !== "BUSINESS" && session.user.role !== "OPERATOR") {
    redirect("/dashboard");
  }

  const isAccommodation = id.startsWith("acc-");
  const isPackage = id.startsWith("pkg-");
  if (!isAccommodation && !isPackage) notFound();

  const numericId = Number(id.slice(4));
  if (!Number.isFinite(numericId)) notFound();

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (isAccommodation) {
    const listing = await prisma.accommodation.findUnique({
      where: { id: numericId },
    });
    if (!listing) notFound();
    if (listing.businessId !== session.user.id) notFound();

    const initial: ListingInput = {
      type: "accommodation",
      name: listing.name,
      slug: listing.slug,
      accommodationType: listing.type,
      description: listing.description,
      location: listing.location,
      priceRange: listing.priceRange,
      imageUrl: listing.imageUrl,
      destinationId: listing.destinationId,
      published: listing.published,
    };

    return (
      <section className="space-y-6">
        <Link
          href="/dashboard/listings"
          className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
        >
          ← Back to listings
        </Link>

        <header>
          <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
            Edit accommodation
          </h2>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            {listing.name}
          </p>
        </header>

        {/* No onSubmit prop — the client component handles the server action */}
        <ListingForm
          mode="edit"
          type="accommodation"
          destinations={destinations}
          initial={initial}
          listingId={listing.id}
        />
      </section>
    );
  }

  // Package
  const listing = await prisma.tourPackage.findUnique({
    where: { id: numericId },
  });
  if (!listing) notFound();
  if (listing.businessId !== session.user.id) notFound();

  const itinerary: { title: string; description: string }[] = Array.isArray(
    listing.itinerary
  )
    ? (listing.itinerary as { title: string; description: string }[])
    : [];

  const initial: ListingInput = {
    type: "package",
    title: listing.title,
    slug: listing.slug,
    summary: listing.summary,
    description: listing.description,
    priceKes: listing.priceKes,
    durationDays: listing.durationDays,
    imageUrl: listing.imageUrl,
    destinationId: listing.destinationId,
    published: listing.published,
    itinerary,
  };

  return (
    <section className="space-y-6">
      <Link
        href="/dashboard/listings/packages"
        className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
      >
        ← Back to packages
      </Link>

      <header>
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          Edit tour package
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {listing.title}
        </p>
      </header>

      <ListingForm
        mode="edit"
        type="package"
        destinations={destinations}
        initial={initial}
        listingId={listing.id}
      />
    </section>
  );
}