// app/admin/actions/register-tour-operator.ts
"use server";

import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/storage";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const TRA_LICENSE_REGEX = /^TRA[0-9]+\/[0-9]+\/C[0-9]+\/[0-9]+$/i;

export async function registerTourOperator(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const businessName = ((formData.get("businessName") as string) || "").trim();
  const password = (formData.get("password") as string) || "";
  const passwordConfirm = (formData.get("passwordConfirm") as string) || "";
  const rawLicense = ((formData.get("traLicense") as string) || "").trim().toUpperCase();
  const licenseDoc = formData.get("licenseDoc") as File;
  const katoMember = formData.get("katoMember") === "on";

  if (!email || !businessName || !rawLicense || !password) {
    return { error: "Email, Business Name, Password, and TRA License are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== passwordConfirm) {
    return { error: "Passwords do not match." };
  }

  if (!TRA_LICENSE_REGEX.test(rawLicense)) {
    return { error: "Invalid TRA License format. It should look like 'TRA1/47/C01/2057'." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const existingLicense = await prisma.businessProfile.findUnique({
    where: { traLicenseNumber: rawLicense },
  });
  if (existingLicense) {
    return { error: "This TRA License is already registered to another account." };
  }

  if (!licenseDoc || licenseDoc.size === 0) {
    return { error: "Please upload a copy of your TRA License." };
  }
  if (licenseDoc.size > 5 * 1024 * 1024) {
    return { error: "License document must be less than 5MB." };
  }

  const buffer = Buffer.from(await licenseDoc.arrayBuffer());
  const key = `tra-licenses/${randomUUID()}-${licenseDoc.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  await putObject(key, buffer, licenseDoc.type);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name: businessName,
        role: "OPERATOR",
        passwordHash,
        businessProfile: {
          create: {
            businessName,
            contactEmail: email,
            traLicenseNumber: rawLicense,
            traLicenseDocUrl: key,
            katoMember,
            verificationStatus: "PENDING",
            businessType: "TOUR_OPERATOR",
          },
        },
      },
    });

    return { success: true, userId: newUser.id };
  } catch (error: any) {
    console.error("Registration failed:", error);
    if (error.code === "P2002") {
      return { error: "This email or TRA License is already in use." };
    }
    return { error: "Failed to create account. Please try again." };
  }
}