// app/stay/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingDetail } from "@/app/components/marketplace/listing-detail";
import { BookingRequestForm } from "@/app/components/marketplace/booking-request-form";
import { InquiryForm } from "@/app/components/marketplace/inquiry-form";
import {
  AttractionCard,
  RelatedPackageCard,
  AccommodationCard,
  RelatedSection,
} from "@/app/components/marketplace/related-cards";
import { resolveImageUrl } from "@/lib/image-url";

export default async function StayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const stay = await prisma.accommodation.findUnique({
    where: { slug },
    include: {
      destination: { select: { name: true, slug: true, county: true } },
      business: {
        select: {
          businessProfile: {
            select: { businessName: true, verificationStatus: true },
          },
        },
      },
    },
  });
  if (!stay) notFound();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role ?? null;
  const currentUserId = user?.id ?? null;

  const businessApproved =
    stay.business?.businessProfile?.verificationStatus === "APPROVED";
  const canInteract = businessApproved && !!stay.published;
  const businessName =
    stay.business?.businessProfile?.businessName ?? "this business";

  // ── Related content from the stay's destination ──
  // Attractions and other stays in the same destination, plus tour
  // packages whose destination shares the county. All filtered to
  // published, approved content so pending/suspended businesses
  // never leak onto the public page.
  const [attractions, nearbyStays, packagesInCounty] = await Promise.all([
    prisma.attraction.findMany({
      where: {
        destinationId: stay.destinationId,
        published: true,
      },
      orderBy: { order: "asc" },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        imageUrl: true,
      },
    }),

    prisma.accommodation.findMany({
      where: {
        id: { not: stay.id },
        destinationId: stay.destinationId,
        published: true,
        business: { businessProfile: { verificationStatus: "APPROVED" } },
      },
      orderBy: { name: "asc" },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        location: true,
        priceRange: true,
        imageUrl: true,
      },
    }),

    prisma.tourPackage.findMany({
      where: {
        published: true,
        business: { businessProfile: { verificationStatus: "APPROVED" } },
        destination: { county: stay.destination?.county ?? "" },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        priceKes: true,
        durationDays: true,
        imageUrl: true,
        destination: { select: { name: true, county: true } },
      },
    }),
  ]);

  // ── Existing thread lookup ──
  let existingThread: {
    id: string;
    updatedAt: Date;
    lastMessagePreview: string | null;
    unreadCount: number;
  } | null = null;

  if (
    user &&
    (role === "CUSTOMER" || role === "BUSINESS") &&
    stay.businessId
  ) {
    const thread = await prisma.messageThread.findFirst({
      where: {
        customerId: user.id,
        businessId: stay.businessId,
        accommodationId: stay.id,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: {
          select: {
            messages: {
              where: { readByCustomer: false, authorId: { not: user.id } },
            },
          },
        },
      },
    });

    if (thread) {
      existingThread = {
        id: thread.id,
        updatedAt: thread.updatedAt,
        lastMessagePreview: thread.messages[0]?.body ?? null,
        unreadCount: thread._count.messages,
      };
    }
  }

  const heroImage = resolveImageUrl(stay.imageUrl);
  const countyName = stay.destination?.county ?? "this region";
  const destinationName = stay.destination?.name ?? "this destination";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column: listing + related sections */}
        <div>
          <ListingDetail
            eyebrow={stay.type}
            title={stay.name}
            destination={stay.destination}
            subtitle={stay.location}
            description={stay.description}
            heroImage={heroImage}
            gallery={
              stay.imageUrl ? [{ url: heroImage ?? "", alt: stay.name }] : []
            }
            businessName={businessName}
            details={[
              { label: "Type", value: stay.type },
              { label: "Location", value: stay.location },
              {
                label: "Price range",
                value: stay.priceRange ?? "Contact for pricing",
              },
              { label: "Destination", value: stay.destination?.name ?? "—" },
            ]}
          />

          {attractions.length > 0 && (
            <RelatedSection
              title="What you'll experience"
              subtitle={`Attractions and activities in ${destinationName}.`}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {attractions.map((a) => (
                  <AttractionCard key={a.id} attraction={a} />
                ))}
              </div>
            </RelatedSection>
          )}

          {nearbyStays.length > 0 && (
            <RelatedSection
              title="Other stays in the area"
              subtitle={`More accommodations in ${destinationName}.`}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyStays.map((s) => (
                  <AccommodationCard key={s.id} stay={s} />
                ))}
              </div>
            </RelatedSection>
          )}

          {packagesInCounty.length > 0 && (
            <RelatedSection
              title={`Packages in ${countyName}`}
              subtitle="Trips that include this region."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {packagesInCounty.map((p) => (
                  <RelatedPackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </RelatedSection>
          )}
        </div>

        {/* Right column: sticky sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {canInteract ? (
            <>
              {!user && (
                <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
                  <h3 className="text-base font-semibold text-deep-800 dark:text-cream-100">
                    Interested in this stay?
                  </h3>
                  <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
                    Sign in to request a booking or message the business
                    directly. All inquiries go through the NTSP portal so you
                    can track replies in one place.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`/login?callbackUrl=${encodeURIComponent(
                        `/stay/${slug}`
                      )}`}
                      className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-medium text-deep-800 hover:bg-brand-500"
                    >
                      Sign in
                    </a>
                    <a
                      href="/signup"
                      className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-medium text-deep-700 hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
                    >
                      Create account
                    </a>
                  </div>
                </div>
              )}

              {user && (role === "CUSTOMER" || role === "BUSINESS") && (
                <BookingRequestForm
                  accommodationId={stay.id}
                  isSignedIn
                  showCheckOut
                />
              )}

              <InquiryForm
                accommodationId={stay.id}
                businessName={businessName}
                listingBusinessId={stay.businessId}
                isSignedIn={!!user}
                role={role ? String(role) : null}
                currentUserId={currentUserId}
                existingThread={existingThread}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
              This listing is not currently accepting bookings or inquiries.
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}