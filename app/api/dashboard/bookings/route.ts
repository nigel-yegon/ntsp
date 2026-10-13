// app/api/dashboard/bookings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  accommodationId?: number;
  tourPackageId?: number;
  checkIn: string;
  checkOut?: string;
  guests: number;
  notes?: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "CUSTOMER") {
    return NextResponse.json(
      { error: "Only traveller accounts can make booking requests" },
      { status: 403 }
    );
  }

  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Exactly one of accommodationId / tourPackageId.
  const hasAccommodation = typeof body.accommodationId === "number";
  const hasPackage = typeof body.tourPackageId === "number";
  if (hasAccommodation === hasPackage) {
    return NextResponse.json(
      { error: "Provide exactly one of accommodationId or tourPackageId" },
      { status: 400 }
    );
  }

  if (!body.checkIn) {
    return NextResponse.json({ error: "Check-in date is required" }, { status: 400 });
  }
  if (!body.guests || body.guests < 1) {
    return NextResponse.json({ error: "Guests must be at least 1" }, { status: 400 });
  }

  const checkIn = new Date(body.checkIn);
  if (Number.isNaN(checkIn.getTime())) {
    return NextResponse.json({ error: "Invalid check-in date" }, { status: 400 });
  }
  if (checkIn < new Date()) {
    return NextResponse.json(
      { error: "Check-in date cannot be in the past" },
      { status: 400 }
    );
  }

  let checkOut: Date | null = null;
  if (body.checkOut) {
    checkOut = new Date(body.checkOut);
    if (Number.isNaN(checkOut.getTime())) {
      return NextResponse.json({ error: "Invalid check-out date" }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 }
      );
    }
  }

  // Resolve the business that owns the listing, and verify the
  // listing is public and its business is approved.
  let businessId: string | null = null;

  if (hasAccommodation) {
    const acc = await prisma.accommodation.findUnique({
      where: { id: body.accommodationId! },
      select: {
        businessId: true,
        published: true,
        business: {
          select: { businessProfile: { select: { verificationStatus: true } } },
        },
      },
    });
    if (!acc) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (!acc.published) {
      return NextResponse.json({ error: "Listing is not published" }, { status: 404 });
    }
    if (
      !acc.businessId ||
      acc.business?.businessProfile?.verificationStatus !== "APPROVED"
    ) {
      return NextResponse.json(
        { error: "This listing is not currently accepting requests" },
        { status: 400 }
      );
    }
    businessId = acc.businessId;
  } else {
    const pkg = await prisma.tourPackage.findUnique({
      where: { id: body.tourPackageId! },
      select: {
        businessId: true,
        published: true,
        business: {
          select: { businessProfile: { select: { verificationStatus: true } } },
        },
      },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (!pkg.published) {
      return NextResponse.json({ error: "Listing is not published" }, { status: 404 });
    }
    if (
      !pkg.businessId ||
      pkg.business?.businessProfile?.verificationStatus !== "APPROVED"
    ) {
      return NextResponse.json(
        { error: "This listing is not currently accepting requests" },
        { status: 400 }
      );
    }
    businessId = pkg.businessId;
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: session.user.id,
      businessId: businessId!,
      accommodationId: hasAccommodation ? body.accommodationId : null,
      tourPackageId: hasPackage ? body.tourPackageId : null,
      checkIn,
      checkOut,
      guests: Math.max(1, Math.floor(body.guests)),
      notes: body.notes?.trim() || null,
      status: "REQUESTED",
    },
  });

  return NextResponse.json({ id: booking.id }, { status: 201 });
}