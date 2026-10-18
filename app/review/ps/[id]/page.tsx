// app/review/ps/[id]/page.tsx
import { notFound } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "@/app/components/review/applicant-card";
import { DocumentGroup } from "@/app/components/review/document-group";
import { EventTimeline } from "@/app/components/review/event-timeline";
import { StatusBadge } from "@/app/components/review/status-badge";
import { PsDecisionPanel } from "./ps-decision-panel";
import { committeeQuorum } from "@/lib/workflow";

export default async function PsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["PERMANENT_SECRETARY", "ADMIN"]);

  const application = await prisma.application.findUnique({
    where: { id: (await params).id },
    include: {
      company: true,
      documents: { orderBy: { uploadedAt: "asc" } },
      events: { orderBy: { createdAt: "desc" }, include: { actor: true } },
      votes: { include: { voter: true } },
    },
  });

  if (!application) notFound();

  const quorum = committeeQuorum(application.votes);

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
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800 dark:text-brand-300">
              Committee outcome
            </h2>
            <span
              className={
                quorum.approved
                  ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : quorum.declined
                    ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950/40 dark:text-red-300"
                    : "rounded-full bg-cream-200 px-2 py-0.5 text-xs font-medium text-deep-600 dark:bg-deep-800 dark:text-cream-400"
              }
            >
              {quorum.approved
                ? "Quorum met (approve)"
                : quorum.declined
                  ? "Quorum met (decline)"
                  : "No committee quorum"}
            </span>
          </div>
          <p className="mt-2 text-sm text-deep-700 dark:text-cream-200">
            {application.votes.length} vote
            {application.votes.length !== 1 ? "s" : ""} cast ·{" "}
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {quorum.approves} approve
            </span>{" "}
            ·{" "}
            <span className="font-medium text-red-700 dark:text-red-400">
              {quorum.declines} decline
            </span>{" "}
            ·{" "}
            <span className="font-medium text-deep-600 dark:text-cream-400">
              {quorum.abstains} abstain
            </span>
          </p>
          {application.votes.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {application.votes.map((v) => (
                <li key={v.id} className="text-deep-600 dark:text-cream-300">
                  <span className="font-medium text-deep-800 dark:text-cream-100">
                    {v.voter.name}
                  </span>{" "}
                  —{" "}
                  <span
                    className={
                      v.decision === "APPROVE"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : v.decision === "DECLINE"
                          ? "text-red-700 dark:text-red-400"
                          : "text-deep-500 dark:text-cream-400"
                    }
                  >
                    {v.decision}
                  </span>
                  {v.comment && (
                    <span className="text-deep-500 dark:text-cream-400">
                      {" "}
                      · {v.comment}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
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