// app/api/dashboard/messages/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  accommodationId?: number;
  tourPackageId?: number;
  body: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only CUSTOMER and BUSINESS accounts can send inquiries.
  // EMPLOYER, VERIFIER, COMMITTEE_MEMBER, PERMANENT_SECRETARY and
  // ADMIN have no reason to message a marketplace business.
  if (
    session.user.role !== "CUSTOMER" &&
    session.user.role !== "BUSINESS"
  ) {
    return NextResponse.json(
      { error: "Only customer and business accounts can send inquiries" },
      { status: 403 }
    );
  }

  let payload: Partial<Payload>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = payload.body?.trim();
  if (!text) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const hasAccommodation = typeof payload.accommodationId === "number";
  const hasPackage = typeof payload.tourPackageId === "number";
  if (hasAccommodation === hasPackage) {
    return NextResponse.json(
      { error: "Provide exactly one of accommodationId or tourPackageId" },
      { status: 400 }
    );
  }

  // Resolve owner and label.
  let businessId: string | null = null;
  let subject: "ACCOMMODATION" | "TOUR_PACKAGE";
  let subjectLabel: string;

  if (hasAccommodation) {
    const acc = await prisma.accommodation.findUnique({
      where: { id: payload.accommodationId! },
      select: {
        name: true,
        businessId: true,
        published: true,
        business: {
          select: {
            businessProfile: { select: { verificationStatus: true } },
          },
        },
      },
    });
    if (!acc) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (!acc.published || !acc.businessId) {
      return NextResponse.json(
        { error: "Listing unavailable" },
        { status: 400 }
      );
    }
    if (acc.business?.businessProfile?.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "This business is not currently accepting messages" },
        { status: 400 }
      );
    }
    businessId = acc.businessId;
    subject = "ACCOMMODATION";
    subjectLabel = acc.name;
  } else {
    const pkg = await prisma.tourPackage.findUnique({
      where: { id: payload.tourPackageId! },
      select: {
        title: true,
        businessId: true,
        published: true,
        business: {
          select: {
            businessProfile: { select: { verificationStatus: true } },
          },
        },
      },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    if (!pkg.published || !pkg.businessId) {
      return NextResponse.json(
        { error: "Listing unavailable" },
        { status: 400 }
      );
    }
    if (pkg.business?.businessProfile?.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "This business is not currently accepting messages" },
        { status: 400 }
      );
    }
    businessId = pkg.businessId;
    subject = "TOUR_PACKAGE";
    subjectLabel = pkg.title;
  }

  // A business can't send an inquiry to its own listing.
  if (businessId === session.user.id) {
    return NextResponse.json(
      { error: "You can't send an inquiry to your own listing" },
      { status: 400 }
    );
  }

  // If the sender already has an open thread for this listing with
  // this business, reuse it — append the message instead of spawning
  // a new thread.
  const existing = await prisma.messageThread.findFirst({
    where: {
      customerId: session.user.id,
      businessId: businessId!,
      accommodationId: hasAccommodation ? payload.accommodationId : null,
      tourPackageId: hasPackage ? payload.tourPackageId : null,
    },
    orderBy: { updatedAt: "desc" },
  });

  const thread = existing
    ? await prisma.messageThread.update({
        where: { id: existing.id },
        data: { updatedAt: new Date() },
      })
    : await prisma.messageThread.create({
        data: {
          customerId: session.user.id,
          businessId: businessId!,
          subject,
          subjectLabel,
          accommodationId: hasAccommodation ? payload.accommodationId : null,
          tourPackageId: hasPackage ? payload.tourPackageId : null,
        },
      });

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      authorId: session.user.id,
      body: text,
      readByCustomer: true,
      readByBusiness: false,
    },
  });

  return NextResponse.json(
    { threadId: thread.id, messageId: message.id },
    { status: 201 }
  );
}