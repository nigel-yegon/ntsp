// app/api/auth/signup-business/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  name: string;
  email: string;
  password: string;
  businessName: string;
  contactEmail: string;
  contactPhone?: string;
  registrationNo?: string;
  kraPin?: string;
  description?: string;
  website?: string;
};

function validate(body: Partial<Payload>): string[] {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("Your name is required");
  if (!body.email?.includes("@")) errors.push("A valid email is required");
  if (!body.password || body.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!body.businessName?.trim()) errors.push("Business name is required");
  if (!body.contactEmail?.includes("@")) {
    errors.push("A valid business contact email is required");
  }
  return errors;
}

export async function POST(req: Request) {
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

  const email = body.email!.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { errors: ["An account with that email already exists"] },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(body.password!, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: body.name!.trim(),
        email,
        passwordHash,
        role: "BUSINESS",
      },
    });

    await tx.businessProfile.create({
      data: {
        userId: user.id,
        businessName: body.businessName!.trim(),
        contactEmail: body.contactEmail!.trim(),
        contactPhone: body.contactPhone?.trim() || null,
        registrationNo: body.registrationNo?.trim() || null,
        kraPin: body.kraPin?.trim() || null,
        description: body.description?.trim() || null,
        website: body.website?.trim() || null,
        // New businesses start pending — an admin must approve.
        verificationStatus: "PENDING",
      },
    });

    return user;
  });

  return NextResponse.json(
    { id: result.id, email: result.email },
    { status: 201 }
  );
}