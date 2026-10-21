// app/services/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/app/components/review/status-badge";

const REVIEWER_HOME: Record<string, string> = {
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
};

type Service = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  badge?: string;
};

const publicServices: Service[] = [
  {
    title: "Expatriate Vetting & Work Permits",
    description:
      "Apply for a work permit, special pass, or renewal. Upload required documents step by step.",
    href: "/services/expatriate",
    badge: "Online application",
  },
  {
    title: "Tourism Licence Application",
    description: "Apply for or renew a tourism licence for your operation.",
    href: "https://tra.go.ke/",
    external: true,
  },
  {
    title: "Travel & Safety Information",
    description:
      "Current advisories, entry requirements, and safety guidance for visitors.",
    href: "/safety",
    external: true,
  },
  {
    title: "Report an Incident / Occurrence",
    description:
      "Report an incident involving a licensed operator, guide, or tourism facility.",
    href: "/report-an-incident",
    external: true,
  },
  {
    title: "Local Guides & Experts",
    description: "Find licensed guides and tourism professionals across Kenya.",
    href: "/operators",
    external: true,
  },
  {
    title: "Events & Activity Calendar",
    description: "Upcoming tourism events, festivals, and activities.",
    href: "/events",
    external: true,
  },
];

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // ── 1. Customers and businesses don't belong on this page ──
  // Their home is /dashboard, which is where every action they
  // need lives. Sending them there prevents the "reviewer message"
  // confusion that the old code produced.
  if (user && (user.role === "CUSTOMER" || user.role === "BUSINESS")) {
    redirect("/dashboard");
  }

  // ── 2. Employers without a company must complete their profile first ──
  if (user?.role === "EMPLOYER" && !user.companyId) {
    redirect("/services/profile");
  }

  // ── 3. Fetch drafts only for employers ──
  const drafts =
    user?.role === "EMPLOYER"
      ? await prisma.application.findMany({
          where: { submittedById: user.id, status: "DRAFT" },
          orderBy: { updatedAt: "desc" },
          take: 10,
        })
      : [];

  const isEmployer = user?.role === "EMPLOYER";
  const isReviewer =
    user &&
    (user.role === "VERIFIER" ||
      user.role === "COMMITTEE_MEMBER" ||
      user.role === "PERMANENT_SECRETARY" ||
      user.role === "ADMIN");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-deep-800 dark:text-cream-100">
          Expatriate Vetting & Work Permits
        </h1>
        <p className="mt-2 max-w-2xl text-deep-500 dark:text-cream-400">
          Access National Tourism Service Portal services. Some open on the
          main portal; others are handled here.
        </p>
      </header>

      {/* ── Employer-only: applications listing + drafts ── */}
      {isEmployer && (
        <>
          <section className="mb-8">
            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
                    Your applications
                  </h2>
                  <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
                    Search, filter, and paginate through the applications your
                    company has submitted.
                  </p>
                </div>
                <Link
                  href="/services/applications"
                  className="
                    shrink-0 rounded-lg bg-brand-400 px-4 py-2
                    text-sm font-medium text-deep-800
                    transition hover:bg-brand-500
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-400 focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-deep-900
                  "
                >
                  Open applications →
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-10 border-b border-deep-800 pb-10 dark:border-cream-300/20">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
                Your drafts
              </h2>
              <Link
                href="/services/expatriate"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Start a new application →
              </Link>
            </div>

            {drafts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-6 text-center dark:border-deep-700 dark:bg-deep-900">
                <p className="text-sm text-deep-500 dark:text-cream-400">
                  You have no drafts. Any in-progress applications will appear
                  here.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {drafts.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/services/expatriate/${d.id}`}
                      className="
                        flex items-center justify-between gap-3
                        rounded-xl border border-cream-300 bg-cream-50 p-4
                        transition hover:border-brand-400
                        dark:border-deep-700 dark:bg-deep-900
                        dark:hover:border-brand-500
                      "
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-deep-800 dark:text-cream-100">
                          {d.applicantName || "Untitled draft"}
                        </p>
                        <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                          {d.referenceNo} · updated{" "}
                          {d.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={d.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {/* ── Reviewer-only: shortcut to their queue and all applications ── */}
      {isReviewer && user && (
        <section className="mb-10 border-b border-deep-800 pb-10 dark:border-cream-300/20">
          <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-deep-700 dark:bg-deep-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
                  All applications
                </h2>
                <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
                  Search and filter every application across all companies.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/services/applications"
                  className="
                    rounded-lg bg-brand-400 px-4 py-2
                    text-sm font-medium text-deep-800
                    transition hover:bg-brand-500
                  "
                >
                  Open applications →
                </Link>
                <Link
                  href={REVIEWER_HOME[user.role] ?? "/review"}
                  className="
                    rounded-lg border border-brand-400 px-4 py-2
                    text-sm font-medium text-brand-700
                    transition hover:bg-brand-50
                    dark:text-brand-300 dark:hover:bg-brand-950/40
                  "
                >
                  Go to review queue
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Public services list — always rendered ── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-deep-800 dark:text-cream-100">
          All services
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publicServices.map((service) => (
            <li key={service.title}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium text-deep-800 dark:text-cream-100">
          {service.title}
        </h3>
        {service.badge && (
          <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
            {service.badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-deep-500 dark:text-cream-400">
        {service.description}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-brand-600 dark:text-brand-400">
        {service.external ? "Open portal →" : "Start application →"}
      </span>
    </>
  );

  const className = `
    block h-full rounded-2xl border border-cream-300 bg-cream-50 p-5
    transition hover:border-brand-400 hover:shadow-md
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
    dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500
  `;

  return service.external ? (
    <a
      href={service.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link href={service.href} className={className}>
      {content}
    </Link>
  );
}