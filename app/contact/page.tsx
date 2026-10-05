import Link from "next/link";

export const metadata = {
  title: "Contact Us — NTSP",
  description:
    "Get in touch with the NTSP team — enquiries, partnerships, and visitor support.",
};

const offices = [
  {
    city: "Nairobi (Head Office)",
    address: "Kenya Tourism Board, Kenya-Re Towers, Ragati Road, Upper Hill",
    phone: "+254 (0)20 271 1262",
    email: "info@ntsp.go.ke",
  },
  {
    city: "Mombasa (Coast Region)",
    address: "Mombasa Regional Office, Nkrumah Road",
    phone: "+254 (0)41 222 4184",
    email: "coast@ntsp.go.ke",
  },
  {
    city: "Kisumu (Western Region)",
    address: "Kisumu Regional Office, Oginga Odinga Street",
    phone: "+254 (0)57 202 3316",
    email: "west@ntsp.go.ke",
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* ─── HERO BAND ─────────────────────────────────────── */}
      <section className="hero-band border-b border-deep-200 dark:border-deep-800">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            Get in touch
          </span>
          <h1 className="mt-2 text-4xl font-bold text-deep-800 md:text-5xl dark:text-cream-100">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-deep-600 dark:text-cream-400">
            Questions about visiting Kenya? Partnerships? Media enquiries?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ─── CONTENT ───────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <section className="lg:col-span-3">
            <form className="space-y-5 rounded-lg border border-deep-200 bg-cream-50 p-6 dark:border-deep-800 dark:bg-deep-900">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" type="text" required />
                <Field label="Email" name="email" type="email" required />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone (optional)" name="phone" type="tel" />
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-semibold text-deep-700 dark:text-cream-300"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className={inputClass}
                  >
                    <option>General enquiry</option>
                    <option>Package booking</option>
                    <option>Accommodation enquiry</option>
                    <option>Partnership / media</option>
                    <option>Report an issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-deep-700 dark:text-cream-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className={inputClass}
                  placeholder="Tell us how we can help…"
                />
              </div>

              <button
                type="submit"
                className="rounded-md bg-deep-800 px-5 py-2.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
              >
                Send message
              </button>

              <p className="text-xs text-deep-500 dark:text-cream-500">
                This form is not yet connected to a backend. We&apos;ll wire it to a
                Server Action that writes to Prisma in a follow-up step.
              </p>
            </form>
          </section>

          {/* Offices */}
          <aside className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-deep-800 dark:text-cream-100">
              Our Offices
            </h2>
            <ul className="space-y-5">
              {offices.map((o) => (
                <li
                  key={o.city}
                  className="rounded-lg border border-deep-200 bg-cream-50 p-4 dark:border-deep-800 dark:bg-deep-900"
                >
                  <h3 className="font-semibold text-deep-800 dark:text-cream-100">
                    {o.city}
                  </h3>
                  <p className="mt-2 text-sm text-deep-600 dark:text-cream-400">
                    {o.address}
                  </p>
                  <p className="mt-2 text-sm">
                    <a
                      href={`tel:${o.phone.replace(/\s/g, "")}`}
                      className="text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      {o.phone}
                    </a>
                  </p>
                  <p className="text-sm">
                    <a
                      href={`mailto:${o.email}`}
                      className="text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      {o.email}
                    </a>
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg border border-deep-200 bg-cream-50 p-4 text-sm dark:border-deep-800 dark:bg-deep-900">
              <p className="font-semibold text-deep-800 dark:text-cream-100">
                Emergency contacts
              </p>
              <p className="mt-2 text-deep-600 dark:text-cream-400">
                Police: <span className="font-mono">999</span> or{" "}
                <span className="font-mono">112</span>
                <br />
                Ambulance: <span className="font-mono">999</span>
                <br />
                Tourist Police Hotline:{" "}
                <span className="font-mono">+254 20 341 4955</span>
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-deep-200 pt-6 dark:border-deep-800">
          <p className="text-sm text-deep-600 dark:text-cream-400">
            Looking for travel tips?{" "}
            <Link
              href="/plan"
              className="font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Visit our Plan Your Trip hub →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable field ────────────────────────────────────────── */
type FieldProps = {
  label: string;
  name: string;
  type: string;
  required?: boolean;
};

function Field({ label, name, type, required }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-deep-700 dark:text-cream-300"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500";