// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyRegNo: string;
  kraPin?: string;
  tourismLicenceNo?: string;
};

function validate(body: Partial<Payload>): string[] {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("Name is required");
  if (!body.email?.includes("@")) errors.push("A valid email is required");
  if (!body.password || body.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!body.companyName?.trim()) errors.push("Company name is required");
  if (!body.companyRegNo?.trim()) {
    errors.push("Company registration number is required");
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

  const company = await prisma.company.upsert({
    where: { registrationNo: body.companyRegNo!.trim() },
    update: {},
    create: {
      name: body.companyName!.trim(),
      registrationNo: body.companyRegNo!.trim(),
      kraPin: body.kraPin?.trim() || null,
      tourismLicenceNo: body.tourismLicenceNo?.trim() || null,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: body.name!.trim(),
      email,
      passwordHash,
      role: "EMPLOYER",
      companyId: company.id,
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}