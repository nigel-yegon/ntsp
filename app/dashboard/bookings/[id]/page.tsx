// app/dashboard/bookings/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatusBadge } from "@/app/components/dashboard/booking-status-badge";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      accommodation: true,
      tourPackage: true,
      business: {
        select: {
          businessProfile: {
            select: {
              businessName: true,
              contactEmail: true,
              contactPhone: true,
            },
          },
        },
      },
    },
  });

  if (!booking || booking.customerId !== session.user.id) notFound();

  const listing = booking.accommodation?.name ?? booking.tourPackage?.title;
  const bp = booking.business.businessProfile;

  return (
    <section className="space-y-6">
      <Link
        href="/dashboard/bookings"
        className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
      >
        ← Back to bookings
      </Link>

      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
              {listing}
            </h2>
            <p className="mt-0.5 text-sm text-deep-500 dark:text-cream-400">
              with {bp?.businessName ?? "the business"}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <Row label="Check-in" value={booking.checkIn.toLocaleDateString()} />
          <Row
            label="Check-out"
            value={booking.checkOut?.toLocaleDateString() ?? "—"}
          />
          <Row
            label="Guests"
            value={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`}
          />
          <Row label="Requested" value={booking.createdAt.toLocaleDateString()} />
        </dl>

        {booking.notes && (
          <div className="mt-5 border-t border-cream-200 pt-4 dark:border-deep-800">
            <p className="text-xs font-medium uppercase tracking-wide text-deep-500 dark:text-cream-400">
              Your notes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-deep-700 dark:text-cream-200">
              {booking.notes}
            </p>
          </div>
        )}

        {booking.responseNote && (
          <div className="mt-5 rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-950/40">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-800 dark:text-brand-300">
              Response from {bp?.businessName ?? "the business"}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-brand-900 dark:text-brand-200">
              {booking.responseNote}
            </p>
            {booking.respondedAt && (
              <p className="mt-1 text-xs text-brand-700 dark:text-brand-400">
                {booking.respondedAt.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {bp?.contactEmail && (
          <div className="mt-5 border-t border-cream-200 pt-4 dark:border-deep-800">
            <p className="text-xs font-medium uppercase tracking-wide text-deep-500 dark:text-cream-400">
              Contact
            </p>
            <p className="mt-1 text-sm text-deep-700 dark:text-cream-200">
              {bp.contactEmail}
              {bp.contactPhone ? ` · ${bp.contactPhone}` : ""}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-deep-500 dark:text-cream-400">{label}</dt>
      <dd className="text-sm text-deep-800 dark:text-cream-100">{value}</dd>
    </div>
  );
}