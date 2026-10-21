// app/services/expatriate/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ExpatriateFormProvider,
  type DraftPayload,
} from "@/app/components/expatriate/form-context";
import { ExpatriateForm } from "@/app/components/expatriate/expatriate-form";

export default async function ExpatriateDraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const application = await prisma.application.findUnique({
    where: { id },
    include: { documents: { orderBy: { uploadedAt: "asc" } } },
  });
  if (!application) notFound();
  if (application.submittedById !== session.user.id) notFound();
  if (application.status !== "DRAFT") redirect(`/services/applications/${application.id}`);

  const initialDraft: DraftPayload = {
    id: application.id,
    referenceNo: application.referenceNo,
    status: "DRAFT",
    applicant: {
      fullName: application.applicantName,
      nationality: application.applicantNationality,
      passportNumber: application.applicantPassportNo,
      email: application.applicantEmail,
      phone: application.applicantPhone,
      permitClass: permitClassToClient(application.permitClass),
      isRenewal: application.applicationType === "RENEWAL",
    },
    documents: application.documents.map((d) => ({
      id: d.id,
      slotId: d.slotId,
      fileName: d.fileName,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      url: `/api/documents/${d.id}`,
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="hero-band -mx-4 mb-10 rounded-2xl px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-deep-800 dark:text-cream-100">
              Edit draft application
            </h1>
            <p className="mt-2 text-sm text-deep-600 dark:text-cream-400">{application.referenceNo}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
            Draft
          </span>
        </div>
      </header>

      <ExpatriateFormProvider initialDraft={initialDraft}>
        <ExpatriateForm />
      </ExpatriateFormProvider>
    </main>
  );
}

function permitClassToClient(value: string): "class-g" | "class-d" | "special-pass" {
  if (value === "CLASS_G") return "class-g";
  if (value === "CLASS_D") return "class-d";
  return "special-pass";
}