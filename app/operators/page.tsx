// app/operators/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FadeIn from "@/app/components/fade-in";
import { OperatorsGrid } from "./operators-grid";

export const metadata = {
  title: "Tour Operators — NTSP",
  description: "Discover verified tour operators across Kenya.",
};

export default async function OperatorsPage() {
  const operators = await prisma.businessProfile.findMany({
    where: {
      businessType: "TOUR_OPERATOR",
      verificationStatus: "APPROVED",
    },
    include: {
      user: {
        select: {
          _count: {
            select: { ownedTourPackages: { where: { published: true } } },
          },
        },
      },
    },
    orderBy: { businessName: "asc" },
  });

  // Map to the shape our Client Component expects
  const mappedOperators = operators.map((op) => ({
    id: op.id,
    businessName: op.businessName,
    description: op.description,
    katoMember: op.katoMember,
    contactEmail: op.contactEmail,
    packageCount: op.user._count.ownedTourPackages,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-deep-800 dark:text-cream-100 md:text-4xl">
              Our Verified Tour Operators
            </h1>
            <p className="mt-4 text-lg text-deep-600 dark:text-cream-400">
              All operators listed below have been verified against the Tourism Regulatory Authority (TRA) registry.
            </p>
          </div>
          
          <Link
            href="/operators/register"
            className="shrink-0 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-sm"
          >
            Register as an Operator
          </Link>
        </div>
      </FadeIn>

      {mappedOperators.length === 0 ? (
        <div className="rounded-xl border border-dashed border-deep-200 p-12 text-center text-deep-500 dark:border-deep-800 dark:text-cream-500">
          <p className="text-lg">No tour operators have been verified yet.</p>
          <p className="mt-2 text-sm">Be the first to join the platform.</p>
          <Link
            href="/operators/register"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Apply Now
          </Link>
        </div>
      ) : (
        <OperatorsGrid operators={mappedOperators} />
      )}
    </div>
  );
}