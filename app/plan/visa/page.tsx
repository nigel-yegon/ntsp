import Link from "next/link";

export const metadata = {
  title: "Visa & Entry — NTSP",
};

export default function VisaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/plan"
        className="text-sm text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← Back to Plan Your Trip
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Visa & Entry Requirements</h1>

      <div className="mt-8 space-y-8 text-gray-800 dark:text-gray-200">
        <section>
          <h2 className="text-xl font-semibold">Electronic Travel Authorisation (eTA)</h2>
          <p className="mt-3 leading-relaxed">
            Since January 2024, most visitors need an eTA instead of a traditional visa.
            Apply online at{" "}
            <a
              href="https://etakenya.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              etakenya.go.ke
            </a>{" "}
            before you travel. Applications typically take up to three working days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">What you'll need</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Passport valid for at least 6 months from your arrival date</li>
            <li>Recent passport-style photo</li>
            <li>Confirmed return or onward flight</li>
            <li>Accommodation details for the first night</li>
            <li>Payment card for the eTA fee (USD 30 for most nationalities)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Health & vaccinations</h2>
          <p className="mt-3 leading-relaxed">
            Yellow fever vaccination is required if you're arriving from a
            yellow-fever-endemic country. Otherwise, it's recommended. Speak to your
            travel clinic about malaria prophylaxis — particularly for coastal and
            safari areas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Exemptions</h2>
          <p className="mt-3 leading-relaxed">
            Citizens of most East African Community countries are exempt. Check the
            official eTA portal for the current exemption list before applying.
          </p>
        </section>
      </div>
    </article>
  );
}