// app/admin/operators/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OperatorApprovalRow } from "./operator-approval-row";

export const dynamic = "force-dynamic";

export default async function AdminOperatorsPage() {
  const operators = await prisma.businessProfile.findMany({
    where: { businessType: "TOUR_OPERATOR" },
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { email: true, createdAt: true } },
    },
  });

  // Map the Prisma result to the exact shape OperatorApprovalRow expects
  const mapped = operators.map((op) => ({
    id: op.id,
    businessName: op.businessName,
    contactEmail: op.contactEmail,
    traLicenseNumber: op.traLicenseNumber,
    traLicenseDocUrl: op.traLicenseDocUrl,
    katoMember: op.katoMember,
    verificationStatus: op.verificationStatus,
    createdAt: op.createdAt,
    userEmail: op.user.email, // Flatten the email out of the user object
  }));

  const pending = mapped.filter((o) => o.verificationStatus === "PENDING");
  const approved = mapped.filter((o) => o.verificationStatus === "APPROVED");
  const rejected = mapped.filter((o) => o.verificationStatus === "REJECTED");

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-deep-800 dark:text-cream-100">
          Tour Operator Verifications
        </h1>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          Review TRA licenses and approve/reject Tour Operators.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-deep-800 dark:text-cream-100">
          Pending Review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50 p-6 text-center text-sm text-deep-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-400">
            No pending operators.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((op) => (
              <OperatorApprovalRow key={op.id} op={op} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-deep-800 dark:text-cream-100">
          Approved ({approved.length})
        </h2>
        <div className="space-y-3">
          {approved.map((op) => (
            <OperatorApprovalRow key={op.id} op={op} />
          ))}
        </div>
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-deep-800 dark:text-cream-100">
            Rejected ({rejected.length})
          </h2>
          <div className="space-y-3">
            {rejected.map((op) => (
              <OperatorApprovalRow key={op.id} op={op} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}