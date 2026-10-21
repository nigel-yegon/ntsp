// app/review/verification/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/app/components/review/require-role";
import { prisma } from "@/lib/prisma";
import { ApplicantCard } from "@/app/components/review/applicant-card";
import { DocumentGroup } from "@/app/components/review/document-group";
import { EventTimeline } from "@/app/components/review/event-timeline";
import { StatusBadge } from "@/app/components/review/status-badge";
import { reviewDocument } from "@/app/components/review/actions";
import { VerificationDocumentActions } from "./verification-actions";
import { TransitionPanel } from "@/app/components/review/transition-panel";

export default async function VerificationDetailPage({
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
      events: { orderBy: { createdAt: "desc" }, include: { actor: true } },
    },
  });

  if (!application) notFound();

  // Verification readiness is stricter than perusal:
  //  - every required slot must be ACCEPTED (not merely "decided")
  //  - the document must also have been perused (verifier can't sign
  //    off material a peruser never touched)
  const requiredDocs = application.documents.filter((d) => d.slotRequired);
  const verified = requiredDocs.filter(
    (d) =>
      d.verificationStatus === "ACCEPTED" &&
      d.perusalStatus !== "PENDING",
  );
  const pendingCount = requiredDocs.length - verified.length;
  const allVerified = pendingCount === 0;
  const canEscalate =
    application.status === "UNDER_VERIFICATION" && allVerified;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-deep-800 dark:text-cream-100">
            Verification review
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
                {allVerified ? (
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    All {requiredDocs.length} required documents verified
                  </span>
                ) : (
                  <>
                    {verified.length} of {requiredDocs.length} required
                    documents verified
                  </>
                )}
              </p>
            )}
          </div>

          <DocumentGroup
            documents={application.documents}
            stage="verification"
            renderActions={(doc) =>
              doc.verificationStatus === "PENDING" ? (
                <VerificationDocumentActions
                  documentId={doc.id}
                  action={reviewDocument}
                />
              ) : null
            }
          />
        </section>

        {/* ─── Readiness prompt (shown when verification is complete) ─ */}
        {canEscalate && (
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
                  All required documents have been verified
                </h2>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
                  This application is ready for the committee. Add a summary of
                  your verification findings so the committee has the context
                  they need to vote.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <TransitionPanel
                applicationId={application.id}
                from={application.status}
                to="AWAITING_COMMITTEE"
                label="Escalate to committee"
                noteRequired
                noteRequiredMessage="Summarise the verification outcome for the committee."
              />
            </div>
          </section>
        )}

        {/* ─── Pending-docs state: small inline hint ─────────── */}
        {application.status === "UNDER_VERIFICATION" && !allVerified && (
          <section
            aria-live="polite"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
          >
            <p className="font-semibold">
              {pendingCount} required document
              {pendingCount === 1 ? "" : "s"} still awaiting verification
            </p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">
              Use the Accept / Reject / Needs&nbsp;resubmission buttons above to
              verify each document. Once all are accepted, you&apos;ll be
              prompted to escalate this application to the committee.
            </p>
          </section>
        )}

        {/* ─── Status hint if the app is past verification ──── */}
        {application.status !== "UNDER_VERIFICATION" && (
          <section className="rounded-2xl border border-deep-200 bg-cream-50 p-4 text-sm text-deep-600 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-400">
            <p>
              This application has already moved past verification. Current
              status: <StatusBadge status={application.status} />
            </p>
            <Link
              href="/review/verification"
              className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              ← Back to verification queue
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