// app/terms/page.tsx
import Link from "next/link";
import { HeroBackground } from "@/app/components/hero-background";

export const metadata = {
  title: "Terms & Conditions — NTSP",
  description:
    "Terms and conditions governing the use of the National Tourism Service Portal and bookings made through it.",
};

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            These terms govern your use of the National Tourism Service Portal
            and any bookings or inquiries made through it.
          </p>
          <p className="mt-2 text-sm text-deep-500 dark:text-cream-500">
            Last updated: {updated}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
            By accessing or using the National Tourism Service Portal (the
            &quot;Portal&quot;), you agree to be bound by these Terms &amp;
            Conditions. If you do not agree, please do not use the Portal.
            These terms are governed by the laws of the Republic of Kenya.
          </p>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              1. About the Portal
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              The Portal is operated by the National Tourism Service Portal
              (&quot;NTSP&quot;, &quot;we&quot;, &quot;us&quot;). It provides a
              platform for discovering tourism listings (destinations,
              experiences, stays, packages, and events), contacting verified
              tour operators and accommodation providers, and submitting
              inquiries or booking requests. The Portal is not itself a tour
              operator, accommodation provider, or travel agent.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              2. Eligibility
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              You must be at least 18 years old to create an account and make
              bookings or inquiries. By using the Portal, you confirm that you
              meet this requirement and that the information you provide is
              accurate and up to date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              3. Accounts
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activity under your account. Notify
              us immediately if you suspect unauthorised access. We may suspend
              or terminate accounts that violate these terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              4. Listings and Verification
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              Tour operators and accommodation providers listed on the Portal
              are required to hold a valid licence from the Tourism Regulatory
              Authority (TRA). Operators are verified against the TRA registry
              before their listings are published. Verification does not
              constitute an endorsement of the quality, safety, or suitability
              of any operator or service.
            </p>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              Listings are provided by the operators themselves. While we make
              reasonable efforts to keep information current, we do not
              guarantee the accuracy, completeness, or availability of any
              listing.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              5. Bookings and Inquiries
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              When you submit a booking request or inquiry through the Portal,
              you are entering into a direct relationship with the relevant
              operator or accommodation provider. The contract for the tour,
              stay, or service is between you and that provider.
            </p>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              NTSP facilitates the introduction but is not a party to the
              contract, is not responsible for the performance of the service,
              and does not handle payments on behalf of providers unless
              expressly stated.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              6. Payments, Cancellations, and Refunds
            </h2>
            <p className="mb-4 text-base leading-7 text-deep-700 dark:text-cream-300">
              Payment terms, cancellation policies, and refund eligibility are
              set by each operator or accommodation provider. You should review
              the provider&apos;s terms before confirming a booking. NTSP does
              not process payments and is not responsible for refunds or
              disputes arising from a booking.
            </p>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              Where a provider cancels a trip due to force majeure, natural
              disaster, political unrest, or other circumstances beyond their
              control, the provider&apos;s cancellation policy applies.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              7. Travel Documents and Health
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              You are responsible for obtaining valid passports, visas, entry
              authorisations (including Kenya&apos;s Electronic Travel
              Authorisation, where applicable), and any required health
              certificates (including yellow fever vaccination where required).
              You are also responsible for complying with any health or safety
              requirements imposed by the provider or by Kenyan authorities.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              8. Travel Insurance
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We strongly recommend that all travellers purchase comprehensive
              travel insurance covering medical emergencies, trip cancellation,
              curtailment, and loss of personal belongings. Neither NTSP nor
              the provider is liable for losses that would ordinarily be
              covered by travel insurance.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              9. User Conduct
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              You agree not to misuse the Portal, including by submitting false
              information, impersonating another person, attempting to gain
              unauthorised access, scraping or harvesting data, or using the
              Portal for unlawful purposes. Reviews and inquiries must be
              honest and respectful.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              10. Intellectual Property
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              The Portal&apos;s design, branding, and original content are
              owned by NTSP or its licensors. Listings, photographs, and
              descriptions submitted by operators remain the property of those
              operators, who grant NTSP a licence to display them on the
              Portal.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              11. Limitation of Liability
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              To the maximum extent permitted by Kenyan law, NTSP is not liable
              for any indirect, incidental, or consequential loss arising from
              your use of the Portal, including losses arising from the acts or
              omissions of operators or accommodation providers. Nothing in
              these terms excludes liability that cannot be excluded under the
              Consumer Protection Act, 2012, or other applicable Kenyan law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              12. Privacy and Data Protection
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We process personal data in accordance with the Data Protection
              Act, 2019. Our collection, use, and protection of personal data
              is described in our{" "}
              <Link
                href="/privacy"
                className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              13. Changes to These Terms
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              We may update these terms from time to time. Material changes
              will be communicated by posting the updated terms on this page
              with a new &quot;last updated&quot; date. Continued use of the
              Portal after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              14. Governing Law and Disputes
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              These terms are governed by the laws of the Republic of Kenya.
              Any dispute arising from your use of the Portal shall be subject
              to the exclusive jurisdiction of the Kenyan courts.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-deep-800 dark:text-cream-100">
              15. Contact
            </h2>
            <p className="text-base leading-7 text-deep-700 dark:text-cream-300">
              Questions about these terms can be sent to{" "}
              <a
                href="mailto:legal@ntsp.go.ke"
                className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
              >
                legal@ntsp.go.ke
              </a>{" "}
              or through our{" "}
              <Link
                href="/contact"
                className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-deep-200 pt-6 dark:border-deep-800">
          <p className="text-sm text-deep-500 dark:text-cream-500">
            See also:{" "}
            <Link
              href="/privacy"
              className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}