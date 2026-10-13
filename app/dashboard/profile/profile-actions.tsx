// app/dashboard/profile/profile-actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type ActionResult = { ok: true } | { ok: false; errors: string[] };

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

// ─── Customer: name + phone ─────────────────────────────────────────

export async function updateCustomerProfile(input: {
  name: string;
  phone: string;
}): Promise<ActionResult> {
  let userId: string;
  try {
    const user = await requireUser();
    if (user.role !== "CUSTOMER") {
      return { ok: false, errors: ["Not a customer account"] };
    }
    userId = user.id;
  } catch (e) {
    return { ok: false, errors: [e instanceof Error ? e.message : "Unauthorized"] };
  }

  const errors: string[] = [];
  if (!input.name.trim()) errors.push("Name is required");
  if (errors.length) return { ok: false, errors };

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name.trim(),
      phone: input.phone.trim() || null,
    },
  });

  return { ok: true };
}

// ─── Business: name + phone + business fields ───────────────────────

export async function updateBusinessProfile(input: {
  name: string;
  phone: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  registrationNo: string;
  kraPin: string;
  website: string;
  description: string;
  logoUrl: string;
}): Promise<ActionResult> {
  let userId: string;
  try {
    const user = await requireUser();
    if (user.role !== "BUSINESS") {
      return { ok: false, errors: ["Not a business account"] };
    }
    userId = user.id;
  } catch (e) {
    return { ok: false, errors: [e instanceof Error ? e.message : "Unauthorized"] };
  }

  const errors: string[] = [];
  if (!input.name.trim()) errors.push("Your name is required");
  if (!input.businessName.trim()) errors.push("Business name is required");
  if (!input.contactEmail.includes("@")) {
    errors.push("A valid public contact email is required");
  }
  if (errors.length) return { ok: false, errors };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name.trim(),
        phone: input.phone.trim() || null,
      },
    }),
    prisma.businessProfile.update({
      where: { userId },
      data: {
        businessName: input.businessName.trim(),
        contactEmail: input.contactEmail.trim(),
        contactPhone: input.contactPhone.trim() || null,
        registrationNo: input.registrationNo.trim() || null,
        kraPin: input.kraPin.trim() || null,
        website: input.website.trim() || null,
        description: input.description.trim() || null,
        logoUrl: input.logoUrl.trim() || null,
      },
    }),
  ]);

  return { ok: true };
}

// ─── Password change (both roles) ───────────────────────────────────

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch (e) {
    return { ok: false, errors: [e instanceof Error ? e.message : "Unauthorized"] };
  }

  const errors: string[] = [];
  if (!input.currentPassword) errors.push("Current password is required");
  if (!input.newPassword || input.newPassword.length < 8) {
    errors.push("New password must be at least 8 characters");
  }
  if (input.newPassword !== input.confirmPassword) {
    errors.push("New passwords do not match");
  }
  if (input.currentPassword && input.newPassword === input.currentPassword) {
    errors.push("New password must differ from the current one");
  }
  if (errors.length) return { ok: false, errors };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  // Users who signed up via OAuth have no password — they can't change
  // one from here. Show a specific message rather than "wrong password".
  if (!user?.passwordHash) {
    return {
      ok: false,
      errors: [
        "Your account uses social sign-in and has no password to change",
      ],
    };
  }

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) {
    return { ok: false, errors: ["Current password is incorrect"] };
  }

  const newHash = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return { ok: true };
}