// app/review/committee/[id]/page.tsx
import { notFound } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "@/app/components/review/applicant-card";
import { DocumentGroup } from "@/app/components/review/document-group";
import { EventTimeline } from "@/app/components/review/event-timeline";
import { StatusBadge } from "@/app/components/review/status-badge";
import { VotePanel } from "./vote-panel";
import { committeeQuorum } from "@/lib/workflow";

export default async function CommitteeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole(["COMMITTEE_MEMBER", "ADMIN"]);

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

  const myVote = application.votes.find((v) => v.voterId === user.id);
  const quorum = committeeQuorum(application.votes);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
          Committee review
        </h1>
        <StatusBadge status={application.status} />
      </header>

      <div className="space-y-6">
        <ApplicantCard application={application} />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Documents & prior reviews
          </h2>
          <DocumentGroup
            documents={application.documents}
            stage="verification"
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
            Committee votes ({application.votes.length})
          </h2>

          {/* Quorum meter */}
          <div className="mb-4 rounded-lg border border-cream-300 bg-cream-50 p-3 text-sm dark:border-deep-700 dark:bg-deep-900">
            <div className="flex items-center justify-between gap-3">
              <span className="text-deep-700 dark:text-cream-300">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {quorum.approves}
                </span>{" "}
                approve ·{" "}
                <span className="font-semibold text-red-700 dark:text-red-400">
                  {quorum.declines}
                </span>{" "}
                decline ·{" "}
                <span className="font-semibold text-deep-600 dark:text-cream-400">
                  {quorum.abstains}
                </span>{" "}
                abstain
              </span>
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
                  : `${quorum.needApprove} more to approve`}
              </span>
            </div>
          </div>

          {application.votes.length === 0 ? (
            <p className="text-sm text-deep-500 dark:text-cream-400">
              No votes cast yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {application.votes.map((vote) => (
                <li
                  key={vote.id}
                  className="rounded-lg border border-cream-300 bg-cream-50 p-3 text-sm dark:border-deep-700 dark:bg-deep-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-deep-800 dark:text-cream-100">
                      {vote.voter.name}
                    </span>
                    <span
                      className={
                        vote.decision === "APPROVE"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : vote.decision === "DECLINE"
                          ? "text-red-700 dark:text-red-400"
                          : "text-deep-500 dark:text-cream-400"
                      }
                    >
                      {vote.decision}
                    </span>
                  </div>
                  {vote.comment && (
                    <p className="mt-1 text-xs text-deep-600 dark:text-cream-300">
                      {vote.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Voting + recommendation: only meaningful at AWAITING_COMMITTEE */}
        {application.status === "AWAITING_COMMITTEE" && (
          <VotePanel
            applicationId={application.id}
            existingVote={
              myVote
                ? {
                    decision: myVote.decision,
                    comment: myVote.comment,
                  }
                : null
            }
            quorum={quorum}
          />
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