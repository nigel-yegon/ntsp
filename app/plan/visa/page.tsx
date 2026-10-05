import Link from "next/link";

export const metadata = {
  title: "Visa & Entry — NTSP",
};

export default function VisaPage() {
  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
          <Link
            href="/plan"
            className="text-xs font-medium text-deep-500 transition hover:text-brand-600 dark:text-cream-500 dark:hover:text-brand-400"
          >
            ← Back to Plan Your Trip
          </Link>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Plan · Entry
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Visa &amp; Entry Requirements
          </h1>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <article className="mx-auto max-w-4xl space-y-10 px-4 py-12 text-deep-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Electronic Travel Authorisation (eTA)
          </h2>
          <p className="mt-3 leading-relaxed">
            Since January 2024, most visitors need an eTA instead of a traditional visa.
            Apply online at{" "}
            <a
              href="https://etakenya.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline decoration-brand-300 decoration-1 underline-offset-2 transition hover:text-brand-700 dark:text-brand-400 dark:decoration-brand-700 dark:hover:text-brand-300"
            >
              etakenya.go.ke
            </a>{" "}
            before you travel. Applications typically take up to three working days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            What you&apos;ll need
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed marker:text-brand-500">
            <li>Passport valid for at least 6 months from your arrival date</li>
            <li>Recent passport-style photo</li>
            <li>Confirmed return or onward flight</li>
            <li>Accommodation details for the first night</li>
            <li>Payment card for the eTA fee (USD 30 for most nationalities)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Health &amp; vaccinations
          </h2>
          <p className="mt-3 leading-relaxed">
            Yellow fever vaccination is required if you&apos;re arriving from a
            yellow-fever-endemic country. Otherwise, it&apos;s recommended. Speak to your
            travel clinic about malaria prophylaxis — particularly for coastal and
            safari areas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-deep-800 dark:text-cream-100">
            Exemptions
          </h2>
          <p className="mt-3 leading-relaxed">
            Citizens of most East African Community countries are exempt. Check the
            official eTA portal for the current exemption list before applying.
          </p>
        </section>
      </article>
    </div>
  );
}