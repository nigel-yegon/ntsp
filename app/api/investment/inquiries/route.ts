// app/api/investment/inquiries/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createInvestorInquiryReferenceNo } from "@/lib/reference";

export const runtime = "nodejs";

const INVESTOR_TYPES = [
  "INDIVIDUAL",
  "COMPANY",
  "FUND",
  "FAMILY_OFFICE",
  "OTHER",
] as const;

const INTERESTS = [
  "LODGE_RESORT",
  "COASTAL",
  "ECO_TOURISM",
  "MICE",
  "CULTURAL_HERITAGE",
  "INFRASTRUCTURE",
  "DOMESTIC_LEISURE",
  "TECHNOLOGY",
  "OTHER",
] as const;

const SCALES = [
  "UNDER_10M",
  "FROM_10M_50M",
  "FROM_50M_100M",
  "FROM_100M_500M",
  "ABOVE_500M",
  "PREFER_NOT_TO_SAY",
] as const;

const schema = z.object({
  fullName: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(200).optional(),
  country: z.string().trim().max(120).optional(),
  investorType: z.enum(INVESTOR_TYPES).optional(),
  interests: z.array(z.enum(INTERESTS)).default([]),
  scale: z
    .enum(SCALES)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 415 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const parsed = schema.safeParse({
    fullName: form.get("fullName") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") || undefined,
    company: form.get("company") || undefined,
    country: form.get("country") || undefined,
    investorType: form.get("investorType") || undefined,
    interests: form.getAll("interests"),
    scale: form.get("scale") || undefined,
    message: form.get("message") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

//  const d = parsed.data;
//  const referenceNo = await createInvestorInquiryReferenceNo();

//   const inquiry = await prisma.investorInquiry.create({
//     data: {
//       referenceNo,
//       status: "NEW",
//       fullName: d.fullName,
//       email: d.email,
//       phone: d.phone || null,
//       company: d.company || null,
//       country: d.country || null,
//       investorType: d.investorType ?? "INDIVIDUAL",
//       interests: d.interests,
//       scale: d.scale ?? null,
//       message: d.message,
//     },
//     select: {
//       id: true,
//       referenceNo: true,
//       status: true,
//       createdAt: true,
//     },
//   });
  const d = parsed.data;

  // Retry on reference-number collision. `nextval` is atomic, so the
  // only way this can fail is if the sequence is behind the table
  // (seeded records without going through the sequence, or a manual
  // setval). Retrying gets the next number without surfacing the
  // error to the user.
  let inquiry;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    const referenceNo = await createInvestorInquiryReferenceNo();
    try {
      inquiry = await prisma.investorInquiry.create({
        data: {
          referenceNo,
          status: "NEW",
          fullName: d.fullName,
          email: d.email,
          phone: d.phone || null,
          company: d.company || null,
          country: d.country || null,
          investorType: d.investorType ?? "INDIVIDUAL",
          interests: d.interests,
          scale: d.scale ?? null,
          message: d.message,
        },
        select: {
          id: true,
          referenceNo: true,
          status: true,
          createdAt: true,
        },
      });
      break;
    } catch (err) {
      const isP2002 =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "P2002";
      if (!isP2002) throw err;
      lastErr = err;
      // Collision — loop and get another number.
    }
  }

  if (!inquiry) {
    console.error(
      "[investment/inquiries] reference collision retries exhausted",
      lastErr
    );
    return NextResponse.json(
      { error: "Could not allocate a reference number. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(inquiry, { status: 201 });
}