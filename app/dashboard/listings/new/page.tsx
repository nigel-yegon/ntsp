// app/dashboard/listings/new/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const role = session.user.role;
  if (role !== "BUSINESS" && role !== "OPERATOR") {
    redirect("/dashboard");
  }

  const isOperator = role === "OPERATOR";

  return (
    <section className="space-y-6">
      <Link
        href="/dashboard/listings"
        className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
      >
        ← Back to listings
      </Link>

      <header>
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          What would you like to list?
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {isOperator
            ? "Tour operators can create tour packages only."
            : "Accommodations are lodges, hotels, resorts, and camps. Tour packages are multi-day itineraries you operate."}
        </p>
      </header>

      {isOperator && (
        <div
          role="note"
          className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[11px] font-bold text-amber-900 dark:bg-amber-800 dark:text-amber-100"
          >
            i
          </span>
          <div>
            <p className="font-semibold">Accommodations are not available for operators</p>
            <p className="mt-1 leading-5">
              Your account is registered as a tour operator, so you can list
              tour packages. To publish accommodations, please register a
              business account.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TypeCard
          href="/dashboard/listings/new/package"
          title="Tour package"
          description="A guided itinerary with a fixed duration and per-person price."
        />

        {isOperator ? (
          <DisabledTypeCard
            title="Accommodation"
            description="A physical place where travellers stay. Has a location, price range, and type."
            reason="Tour operators cannot create accommodations."
          />
        ) : (
          <TypeCard
            href="/dashboard/listings/new/accommodation"
            title="Accommodation"
            description="A physical place where travellers stay. Has a location, price range, and type."
          />
        )}
      </div>

      {isOperator && (
        <div>
          <Link
            href="/dashboard/listings/new/package"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Continue to package form →
          </Link>
        </div>
      )}
    </section>
  );
}

function TypeCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-cream-300 bg-cream-50 p-6 transition hover:border-brand-400 hover:shadow-md dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
    >
      <h3 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-deep-500 dark:text-cream-400">
        {description}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-brand-600 dark:text-brand-400">
        Create →
      </span>
    </Link>
  );
}

function DisabledTypeCard({
  title,
  description,
  reason,
}: {
  title: string;
  description: string;
  reason: string;
}) {
  return (
    <div
      aria-disabled
      className="cursor-not-allowed rounded-2xl border border-dashed border-cream-300 bg-cream-50/60 p-6 opacity-70 dark:border-deep-700 dark:bg-deep-900/60"
    >
      <h3 className="text-lg font-semibold text-deep-600 dark:text-cream-300">
        {title}
      </h3>
      <p className="mt-2 text-sm text-deep-500 dark:text-cream-400">
        {description}
      </p>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
        {reason}
      </p>
    </div>
  );
}