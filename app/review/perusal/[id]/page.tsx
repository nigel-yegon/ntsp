// app/review/perusal/[id]/page.tsx
import { notFound } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "@/app/components/review/applicant-card";
import { DocumentGroup } from "@/app/components/review/document-group";
import { EventTimeline } from "@/app/components/review/event-timeline";
import { StatusBadge } from "@/app/components/review/status-badge";
import { reviewDocument } from "@/app/components/review/actions";
import { PerusalDocumentActions } from "./perusal-actions";

export default async function PerusalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["VERIFIER", "ADMIN"]);

  const application = await prisma.application.findUnique({
    where: { id: (await params).id },
    include: {
      company: true,
      documents: { orderBy: { uploadedAt: "asc" } },
      events: {
        orderBy: { createdAt: "desc" },
        include: { actor: true },
      },
    },
  });

  if (!application) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          Perusal review
        </h1>
        <StatusBadge status={application.status} />
      </header>

      <div className="space-y-6">
        <ApplicantCard application={application} />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Documents
          </h2>
          <DocumentGroup
            documents={application.documents}
            stage="perusal"
            renderActions={(doc) =>
              doc.perusalStatus === "PENDING" ? (
                <PerusalDocumentActions documentId={doc.id} action={reviewDocument} />
              ) : null
            }
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Activity
          </h2>
          <EventTimeline events={application.events} />
        </section>
      </div>
    </main>
  );
}