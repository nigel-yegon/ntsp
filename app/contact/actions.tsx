"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const subject = String(formData.get("subject") ?? "General enquiry");
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }

  await prisma.contactSubmission.create({
    data: { name, email, phone, subject, message },
  });

  redirect("/contact?sent=1");
}