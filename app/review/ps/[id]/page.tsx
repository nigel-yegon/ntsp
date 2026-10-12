// app/review/ps/[id]/page.tsx
import { notFound } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "@/app/components/review/applicant-card";
import { DocumentGroup } from "@/app/components/review/document-group";
import { EventTimeline } from "@/app/components/review/event-timeline";
import { StatusBadge } from "@/app/components/review/status-badge";
import { PsDecisionPanel } from "./ps-decision-panel";
import { tallyVotes } from "@/lib/tally";

export default async function PsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireRole(["PERMANENT_SECRETARY", "ADMIN"]);

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      documents: { orderBy: { uploadedAt: "asc" } },
      events: { orderBy: { createdAt: "desc" }, include: { actor: true } },
      votes: { include: { voter: true } },
    },
  });

  if (!application) notFound();

  const tally = tallyVotes(application.votes);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          Final approval
        </h1>
        <StatusBadge status={application.status} />
      </header>

      <div className="space-y-6">
        <ApplicantCard application={application} />

        <section className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/20">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-300">
            Committee outcome
          </h2>
          <p className="mt-2 text-sm text-deep-700 dark:text-cream-200">
            {application.votes.length} vote{application.votes.length !== 1 ? "s" : ""} cast · tally:{" "}
            <span className="font-medium">{tally}</span>
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {application.votes.map((v) => (
              <li key={v.id} className="text-deep-600 dark:text-cream-300">
                {v.voter.name} — {v.decision}
                {v.comment && <span className="text-deep-500"> · {v.comment}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Documents
          </h2>
          <DocumentGroup documents={application.documents} stage="verification" />
        </section>

        {application.status === "AWAITING_PS_APPROVAL" && (
          <PsDecisionPanel applicationId={application.id} />
        )}

        {application.status === "PS_APPROVED" && (
          <PsDecisionPanel applicationId={application.id} forwardOnly />
        )}

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