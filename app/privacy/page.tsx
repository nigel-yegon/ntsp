// app/privacy/page.tsx
import Link from "next/link";
import { HeroBackground } from "@/app/components/hero-background";

export const metadata = {
  title: "Privacy Policy — NTSP",
  description:
    "How the National Tourism Service Portal collects, uses, and protects personal data under the Data Protection Act, 2019.",
};

export default function PrivacyPage() {
  const updated = "20 October 2026";

  return (
    <div>
      <section className="hero-band relative overflow-hidden border-b border-deep-200 dark:border-deep-800">
        <HeroBackground variant="packages" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Legal
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            How we collect, use, and protect personal data in accordance with
            the Data Protection Act, 2019.
          </p>
          <p className="mt-2 text-sm text-deep-500 dark:text-cream-500">
            Last updated: {updated}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
            The National Tourism Service Portal (&quot;NTSP&quot;,
            &quot;we&quot;, &quot;us&quot;) is committed to protecting your
            personal data. This policy explains what we collect, why we collect
            it, how we use it, and the rights you have under the{" "}
            <strong className="font-bold text-deep-800 dark:text-cream-100">
              Data Protection Act, 2019
            </strong>{" "}
            (Kenya).
          </p>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              1. Who We Are
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              NTSP is a data controller registered with the Office of the Data
              Protection Commissioner (ODPC) in accordance with section 18 of
              the Data Protection Act, 2019. Our registration covers the
              processing of personal data for the purposes described in this
              policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              2. Personal Data We Collect
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              We collect the following categories of personal data:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-7 text-deep-700 dark:text-cream-300">
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Account data:
                </strong>{" "}
                name, email address, phone number, password (hashed), and role
                (traveller, business, operator, or staff).
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Booking and inquiry data:
                </strong>{" "}
                travel dates, guest counts, special requests, and the content
                of messages exchanged with operators through the Portal.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Business and operator data:
                </strong>{" "}
                business name, contact details, TRA licence number, KATO
                membership status, and uploaded verification documents.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Incident reports:
                </strong>{" "}
                name, email, phone, location, and description submitted when
                reporting a wildlife, safety, or operator incident.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Usage data:
                </strong>{" "}
                IP address, browser type, pages visited, and approximate
                location derived from IP, collected via server logs and
                cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              3. Lawful Basis for Processing
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              We process personal data on the following lawful bases under
              section 30 of the Data Protection Act:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-deep-700 dark:text-cream-300">
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Contract:
                </strong>{" "}
                to create and manage your account and to facilitate bookings
                and inquiries between you and operators.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Consent:
                </strong>{" "}
                for marketing communications and optional cookies. You may
                withdraw consent at any time.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Legal obligation:
                </strong>{" "}
                to comply with Kenyan law, including record-keeping
                requirements applicable to tourism enterprises and incident
                reporting.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  Legitimate interests:
                </strong>{" "}
                to secure the Portal, prevent fraud, and improve our services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              4. How We Use Personal Data
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-deep-700 dark:text-cream-300">
              <li>To provide and operate the Portal.</li>
              <li>
                To verify tour operators against the TRA registry and display
                verified listings.
              </li>
              <li>
                To connect travellers with operators and accommodation
                providers and to facilitate inquiries and booking requests.
              </li>
              <li>
                To respond to incident reports and escalate them to the
                relevant authorities (such as the Kenya Wildlife Service) where
                appropriate.
              </li>
              <li>
                To send service-related notices and, with consent, marketing.
              </li>
              <li>To detect and prevent fraud and misuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              5. Sharing Personal Data
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              We share personal data only in the following circumstances:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-7 text-deep-700 dark:text-cream-300">
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  With operators and providers:
                </strong>{" "}
                when you submit an inquiry or booking request, the relevant
                operator receives the information needed to respond.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  With regulators and authorities:
                </strong>{" "}
                where required by law, including the Tourism Regulatory
                Authority, the Office of the Data Protection Commissioner, and
                law enforcement.
              </li>
              <li>
                <strong className="font-semibold text-deep-800 dark:text-cream-100">
                  With service providers:
                </strong>{" "}
                hosting, storage, email, and analytics providers who process
                data on our behalf under written agreements, as required by
                section 42 of the Act.
              </li>
            </ul>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We do not sell personal data. Where personal data is transferred
              outside Kenya, we ensure appropriate safeguards are in place in
              accordance with section 48 of the Act.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              6. Data Retention
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We retain personal data only as long as necessary for the purpose
              for which it was collected, or as required by law. Account data
              is retained while your account is active and for a reasonable
              period after closure. Incident reports are retained for at least
              seven years to support regulatory and legal processes.
              Booking-related records held by operators are subject to the
              Tourism Regulatory Authority&apos;s five-year record-keeping
              requirement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              7. Your Rights Under the Data Protection Act, 2019
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              As a data subject, you have the right to:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-7 text-deep-700 dark:text-cream-300">
              <li>Be informed of how your data is used (section 29).</li>
              <li>Access your personal data (section 26).</li>
              <li>
                Request rectification of inaccurate or incomplete data
                (section 40).
              </li>
              <li>
                Request erasure of data that is no longer necessary or lawfully
                held (section 40).
              </li>
              <li>Object to processing based on legitimate interests.</li>
              <li>
                Data portability, where technically feasible (section 38).
              </li>
              <li>
                Lodge a complaint with the Office of the Data Protection
                Commissioner.
              </li>
            </ul>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@ntsp.go.ke"
                className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
              >
                privacy@ntsp.go.ke
              </a>
              . We will respond within the timelines set by the Act.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              8. Cookies and Analytics
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We use essential cookies to keep you signed in and to remember
              your preferences (such as dark mode). With your consent, we may
              use analytics cookies to understand how the Portal is used. You
              can manage cookie preferences through our cookie banner or your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              9. Security
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We implement appropriate technical and organisational measures to
              protect personal data against unauthorised access, loss, or
              alteration. These include encryption in transit, access controls,
              and regular review of our systems. If a personal data breach
              occurs that is likely to result in a risk to your rights, we will
              notify you and the ODPC as required by section 43 of the Act.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              10. Children&apos;s Data
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              The Portal is not intended for use by anyone under 18. We do not
              knowingly collect personal data from children. If you believe a
              child has provided us with personal data, please contact us so we
              can delete it.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              11. Changes to This Policy
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We may update this policy from time to time. Material changes
              will be posted on this page with a new &quot;last updated&quot;
              date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              12. Contact and Complaints
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              For privacy questions or to exercise your rights, contact our
              Data Protection Officer at{" "}
              <a
                href="mailto:privacy@ntsp.go.ke"
                className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
              >
                privacy@ntsp.go.ke
              </a>
              .
            </p>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              If you are not satisfied with our response, you may lodge a
              complaint with the Office of the Data Protection Commissioner:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-deep-700 dark:text-cream-300">
              <li>
                Website:{" "}
                <a
                  href="https://www.odpc.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
                >
                  odpc.go.ke
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:complaints@odpc.go.ke"
                  className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
                >
                  complaints@odpc.go.ke
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 border-t border-deep-200 pt-6 dark:border-deep-800">
          <p className="text-sm text-deep-500 dark:text-cream-500">
            See also:{" "}
            <Link
              href="/terms"
              className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
            >
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}