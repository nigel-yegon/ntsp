// app/review/perusal/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "@/app/components/review/applicant-card";
import { DocumentGroup } from "@/app/components/review/document-group";
import { EventTimeline } from "@/app/components/review/event-timeline";
import { StatusBadge } from "@/app/components/review/status-badge";
import { reviewDocument } from "@/app/components/review/actions";
import { PerusalDocumentActions } from "./perusal-actions";
import { TransitionPanel } from "@/app/components/review/transition-panel";

export default async function PerusalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["PERUSER", "ADMIN"]);

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

  // Perusal is complete when every required slot has been decided
  // (ACCEPTED / REJECTED / NEEDS_RESUBMISSION all count as "decided"
  // — only PENDING blocks). Optional slots are excluded.
  const requiredDocs = application.documents.filter((d) => d.slotRequired);
  const decided = requiredDocs.filter((d) => d.perusalStatus !== "PENDING");
  const pendingCount = requiredDocs.length - decided.length;
  const allPerused = pendingCount === 0;
  const canAdvance = application.status === "UNDER_PERUSAL" && allPerused;

  // Show a "you're ready" prompt only while the app is still at
  // UNDER_PERUSAL and perusal is complete.
  const showReadyPrompt = canAdvance;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
            Perusal review
          </h1>
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            {application.referenceNo} · {application.company.name}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </header>

      <div className="space-y-6">
        <ApplicantCard application={application} />

        {/* ─── Documents ─────────────────────────────────────── */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
              Documents
            </h2>
            {requiredDocs.length > 0 && (
              <p className="text-xs text-deep-500 dark:text-cream-500">
                {allPerused ? (
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    All {requiredDocs.length} required documents reviewed
                  </span>
                ) : (
                  <>
                    {decided.length} of {requiredDocs.length} required documents
                    reviewed
                  </>
                )}
              </p>
            )}
          </div>

          <DocumentGroup
            documents={application.documents}
            stage="perusal"
            renderActions={(doc) =>
              doc.perusalStatus === "PENDING" ? (
                <PerusalDocumentActions
                  documentId={doc.id}
                  action={reviewDocument}
                />
              ) : null
            }
          />
        </section>

        {/* ─── Readiness prompt (shown when perusal is complete) ─ */}
        {showReadyPrompt && (
          <section
            aria-live="polite"
            className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
              >
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  All required documents have been reviewed
                </h2>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
                  You can now send this application to verification. Add a
                  summary of your findings so the verification officer knows
                  what to focus on.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <TransitionPanel
                applicationId={application.id}
                from={application.status}
                to="UNDER_VERIFICATION"
                label="Complete perusal and send to verification"
                noteRequired
                noteRequiredMessage="Summarise your perusal findings for the verification officer."
              />
            </div>
          </section>
        )}

        {/* ─── Pending-docs state: small inline hint ─────────── */}
        {application.status === "UNDER_PERUSAL" && !allPerused && (
          <section
            aria-live="polite"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
          >
            <p className="font-semibold">
              {pendingCount} required document
              {pendingCount === 1 ? "" : "s"} still awaiting review
            </p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">
              Use the Accept / Reject / Needs&nbsp;resubmission buttons above to
              review each document. Once all are decided, you&apos;ll be
              prompted to send this application to verification.
            </p>
          </section>
        )}

        {/* ─── Status hint if the app is past perusal ───────── */}
        {application.status !== "UNDER_PERUSAL" && (
          <section className="rounded-2xl border border-deep-200 bg-cream-50 p-4 text-sm text-deep-600 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-400">
            <p>
              This application has already moved past perusal. Current status:{" "}
              <StatusBadge status={application.status} />
            </p>
            <Link
              href="/review/perusal"
              className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              ← Back to perusal queue
            </Link>
          </section>
        )}

        {/* ─── Activity ──────────────────────────────────────── */}
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