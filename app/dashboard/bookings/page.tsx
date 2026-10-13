// app/dashboard/bookings/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatusBadge } from "@/app/components/dashboard/booking-status-badge";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  if (session.user.role === "BUSINESS") {
    return <BusinessBookings userId={session.user.id} />;
  }
  return <CustomerBookings userId={session.user.id} />;
}

// ─── Customer view (unchanged from before, but moved to a subcomponent)

async function CustomerBookings({ userId }: { userId: string }) {
  const bookings = await prisma.booking.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      accommodation: { select: { name: true, slug: true, location: true } },
      tourPackage: { select: { title: true, slug: true } },
      business: {
        select: {
          businessProfile: { select: { businessName: true } },
        },
      },
    },
  });

  return (
    <section>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          Bookings
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Requests you've sent to lodges and tour operators.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-500 dark:text-cream-400">
            You haven't made any booking requests yet. Browse stays and
            packages to get started.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/stay"
              className="rounded-lg border border-cream-300 px-3 py-1.5 text-sm text-deep-700 hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              Browse stays
            </Link>
            <Link
              href="/packages"
              className="rounded-lg border border-cream-300 px-3 py-1.5 text-sm text-deep-700 hover:bg-cream-100 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              Browse packages
            </Link>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => {
            const listing =
              b.accommodation?.name ?? b.tourPackage?.title ?? "Listing";
            const businessName =
              b.business.businessProfile?.businessName ?? "Business";
            return (
              <li key={b.id}>
                <Link
                  href={`/dashboard/bookings/${b.id}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 p-4 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-deep-800 dark:text-cream-100">
                      {listing}
                    </p>
                    <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                      {businessName} · {b.guests}{" "}
                      {b.guests === 1 ? "guest" : "guests"}
                    </p>
                    <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                      {b.checkIn.toLocaleDateString()}
                      {b.checkOut
                        ? ` → ${b.checkOut.toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ─── Business view

async function BusinessBookings({ userId }: { userId: string }) {
  const bookings = await prisma.booking.findMany({
    where: { businessId: userId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      accommodation: { select: { name: true, slug: true } },
      tourPackage: { select: { title: true, slug: true } },
      customer: { select: { name: true, email: true } },
    },
  });

  const pending = bookings.filter((b) => b.status === "REQUESTED");
  const resolved = bookings.filter((b) => b.status !== "REQUESTED");

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          Bookings
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Requests from customers. Confirm or decline to update the status.
        </p>
      </header>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
          Awaiting your response ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-4 text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
            No pending requests.
          </p>
        ) : (
          <ul className="space-y-2">
            {pending.map((b) => (
              <BusinessBookingRow key={b.id} booking={b} />
            ))}
          </ul>
        )}
      </div>

      {resolved.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Resolved
          </h3>
          <ul className="space-y-2">
            {resolved.map((b) => (
              <BusinessBookingRow key={b.id} booking={b} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

type BusinessBookingRowProps = {
  booking: {
    id: string;
    checkIn: Date;
    checkOut: Date | null;
    guests: number;
    status: string;
    createdAt: Date;
    customer: { name: string; email: string };
    accommodation: { name: string; slug: string } | null;
    tourPackage: { title: string; slug: string } | null;
  };
};

function BusinessBookingRow({ booking }: BusinessBookingRowProps) {
  const listing =
    booking.accommodation?.name ?? booking.tourPackage?.title ?? "Listing";
  return (
    <li>
      <Link
        href={`/dashboard/bookings/${booking.id}`}
        className="flex items-start justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 p-4 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
      >
        <div className="min-w-0">
          <p className="font-medium text-deep-800 dark:text-cream-100">
            {listing}
          </p>
          <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
            {booking.customer.name} · {booking.guests}{" "}
            {booking.guests === 1 ? "guest" : "guests"}
          </p>
          <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
            {booking.checkIn.toLocaleDateString()}
            {booking.checkOut
              ? ` → ${booking.checkOut.toLocaleDateString()}`
              : ""}
          </p>
        </div>
        <BookingStatusBadge status={booking.status as never} />
      </Link>
    </li>
  );
}