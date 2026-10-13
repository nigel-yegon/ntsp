// app/dashboard/listings/new/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "BUSINESS") {
    redirect("/dashboard");
  }

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
          Accommodations are lodges, hotels, resorts, and camps. Tour packages
          are multi-day itineraries you operate.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <TypeCard
          href="/dashboard/listings/new/accommodation"
          title="Accommodation"
          description="A physical place where travellers stay. Has a location, price range, and type."
        />
        <TypeCard
          href="/dashboard/listings/new/package"
          title="Tour package"
          description="A guided itinerary with a fixed duration and per-person price."
        />
      </div>
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
      className="rounded-2xl border border-cream-300 bg-cream-50 p-6 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
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