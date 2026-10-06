import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ExternalLink,
  ClipboardList,
  Syringe,
  Globe,
  Check,
  type LucideIcon,
} from "lucide-react";

export const metadata = {
  title: "Visa & Entry — NTSP",
};

type Requirement = {
  label: string;
  detail?: string;
};

const requirements: Requirement[] = [
  {
    label: "Passport",
    detail: "Valid for at least 6 months from your arrival date",
  },
  {
    label: "Recent photo",
    detail: "Passport-style, taken within the last 6 months",
  },
  {
    label: "Return or onward flight",
    detail: "Confirmed booking showing you'll leave Kenya",
  },
  {
    label: "First night's accommodation",
    detail: "Hotel name, address, and booking reference",
  },
  {
    label: "Payment card",
    detail: "For the eTA fee — USD 30 for most nationalities",
  },
];

const sections: {
  title: string;
  Icon: LucideIcon;
  body: React.ReactNode;
}[] = [
  {
    title: "Electronic Travel Authorisation",
    Icon: FileText,
    body: (
      <>
        Since January 2024, most visitors need an eTA instead of a traditional
        visa. Apply online at{" "}
        <a
          href="https://etakenya.go.ke"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-brand-600 underline decoration-brand-300 decoration-1 underline-offset-2 transition hover:text-brand-700 dark:text-brand-400 dark:decoration-brand-700 dark:hover:text-brand-300"
        >
          etakenya.go.ke
          <ExternalLink className="h-3.5 w-3.5" />
        </a>{" "}
        before you travel. Applications typically take up to three working days.
      </>
    ),
  },
  {
    title: "Health & vaccinations",
    Icon: Syringe,
    body: (
      <>
        Yellow fever vaccination is required if you&apos;re arriving from a
        yellow-fever-endemic country. Otherwise, it&apos;s recommended. Speak to
        your travel clinic about malaria prophylaxis — particularly for coastal
        and safari areas.
      </>
    ),
  },
  {
    title: "Exemptions",
    Icon: Globe,
    body: (
      <>
        Citizens of most East African Community countries are exempt. Check the
        official eTA portal for the current exemption list before applying.
      </>
    ),
  },
];

export default function VisaPage() {
  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
          <Link
            href="/plan"
            className="inline-flex items-center gap-1 text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Plan Your Trip
          </Link>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Plan · Entry
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Visa &amp; Entry Requirements
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Everything you need before you land — the eTA, health requirements,
            and who&apos;s exempt.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* What you'll need — list card */}
        <section className="mb-8">
          <div className="rounded-2xl border border-deep-200 bg-cream-50 p-6 dark:border-deep-800 dark:bg-deep-900">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
                  What you&apos;ll need
                </h2>
                <p className="mt-1 text-sm text-deep-600 dark:text-cream-400">
                  Five items to have ready before applying.
                </p>

                <ul className="mt-5 space-y-3">
                  {requirements.map((r) => (
                    <li
                      key={r.label}
                      className="flex items-start gap-3 border-t border-deep-200 pt-3 first:border-t-0 first:pt-0 dark:border-deep-800"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-deep-800 dark:text-cream-100">
                          {r.label}
                        </p>
                        {r.detail && (
                          <p className="mt-0.5 text-sm leading-relaxed text-deep-600 dark:text-cream-400">
                            {r.detail}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Remaining sections — icon cards */}
        <div className="space-y-4">
          {sections.map((s) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-lg border border-deep-200 bg-cream-50 p-6 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-deep-800 dark:bg-deep-900 dark:hover:border-brand-500"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />

                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-deep-800 transition group-hover:text-brand-600 dark:text-cream-100 dark:group-hover:text-brand-400">
                      {s.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-deep-600 dark:text-cream-400 sm:text-base">
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-deep-200 pt-6 dark:border-deep-800">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            Ready to plan the rest of your trip?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/plan/getting-around"
              className="inline-flex items-center gap-1.5 rounded-md border border-deep-300 bg-cream-50 px-4 py-2 text-sm font-medium text-deep-800 transition hover:bg-cream-100 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:bg-deep-800"
            >
              Getting Around
            </Link>
            <Link
              href="/plan/when-to-visit"
              className="inline-flex items-center gap-1.5 rounded-md bg-deep-800 px-4 py-2 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
            >
              When to Visit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}