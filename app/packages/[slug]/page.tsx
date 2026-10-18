// app/packages/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingDetail } from "@/app/components/marketplace/listing-detail";
import { BookingRequestForm } from "@/app/components/marketplace/booking-request-form";
import { InquiryForm } from "@/app/components/marketplace/inquiry-form";
import { resolveImageUrl } from "@/lib/image-url";

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pkg = await prisma.tourPackage.findUnique({
    where: { slug },
    include: {
      destination: { select: { name: true, slug: true } },
      business: {
        select: {
          businessProfile: {
            select: { businessName: true, verificationStatus: true },
          },
        },
      },
    },
  });
  if (!pkg) notFound();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role ?? null;
  const currentUserId = user?.id ?? null;

  const businessApproved =
    pkg.business?.businessProfile?.verificationStatus === "APPROVED";
  const canInteract = businessApproved && !!pkg.published;
  const businessName =
    pkg.business?.businessProfile?.businessName ?? "this business";

  let existingThread: {
    id: string;
    updatedAt: Date;
    lastMessagePreview: string | null;
    unreadCount: number;
  } | null = null;

  if (
    user &&
    (role === "CUSTOMER" || role === "BUSINESS") &&
    pkg.businessId
  ) {
    const thread = await prisma.messageThread.findFirst({
      where: {
        customerId: user.id,
        businessId: pkg.businessId,
        tourPackageId: pkg.id,
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

  const heroImage = resolveImageUrl(pkg.imageUrl);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <ListingDetail
            eyebrow="Tour package"
            title={pkg.title}
            destination={pkg.destination}
            subtitle={`${pkg.durationDays} ${
              pkg.durationDays === 1 ? "day" : "days"
            } · KES ${pkg.priceKes.toLocaleString()} per person`}
            description={pkg.description}
            heroImage={heroImage}
            gallery={
              pkg.imageUrl
                ? [{ url: heroImage ?? "", alt: pkg.title }]
                : []
            }
            businessName={businessName}
            details={[
              {
                label: "Duration",
                value: `${pkg.durationDays} ${
                  pkg.durationDays === 1 ? "day" : "days"
                }`,
              },
              {
                label: "Price",
                value: `KES ${pkg.priceKes.toLocaleString()} per person`,
              },
              {
                label: "Destination",
                value: pkg.destination?.name ?? "—",
              },
              { label: "Summary", value: pkg.summary },
            ]}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {canInteract ? (
            <>
              {!user && (
                <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
                  <h3 className="text-base font-semibold text-deep-800 dark:text-cream-100">
                    Interested in this package?
                  </h3>
                  <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
                    Sign in to request this package or message the operator.
                    All inquiries go through the NTSP portal so you can track
                    replies in one place.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`/login?callbackUrl=${encodeURIComponent(`/packages/${slug}`)}`}
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
                  tourPackageId={pkg.id}
                  isSignedIn
                  showCheckOut={false}
                />
              )}

              <InquiryForm
                tourPackageId={pkg.id}
                businessName={businessName}
                listingBusinessId={pkg.businessId}
                isSignedIn={!!user}
                role={role}
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