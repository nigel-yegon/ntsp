// app/api/profile/company/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  name: string;
  companyName: string;
  companyRegNo: string;
  kraPin?: string;
  tourismLicenceNo?: string;
};

function validate(body: Partial<Payload>): string[] {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("Your name is required");
  if (!body.companyName?.trim()) errors.push("Company name is required");
  if (!body.companyRegNo?.trim()) {
    errors.push("Certificate of Incorporation number is required");
  }
  return errors;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Already has a company — nothing to do, redirect handled client-side.
  if (session.user.companyId) {
    return NextResponse.json(
      { error: "Company already linked to this account" },
      { status: 409 }
    );
  }

  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const regNo = body.companyRegNo!.trim();

  // If the registration number already exists, link this user to the
  // existing company rather than creating a duplicate. This is the
  // same-company-second-employee case.
  const existing = await prisma.company.findUnique({
    where: { registrationNo: regNo },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name!.trim(),
        companyId: existing.id,
      },
    });

    return NextResponse.json({
      companyId: existing.id,
      linked: true,
    });
  }

  // Create company + link user in one transaction.
  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: body.companyName!.trim(),
        registrationNo: regNo,
        kraPin: body.kraPin?.trim() || null,
        tourismLicenceNo: body.tourismLicenceNo?.trim() || null,
      },
    });

    await tx.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name!.trim(),
        companyId: company.id,
      },
    });

    return company;
  });

  return NextResponse.json({
    companyId: result.id,
    linked: false,
  });
}