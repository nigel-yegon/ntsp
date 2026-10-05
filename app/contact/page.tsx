import Link from "next/link";
import { submitContact } from "./actions";

// ...



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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Questions about visiting Kenya? Partnerships? Media enquiries? We'd love to hear from you.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* ─── Form ─────────────────────────────────────────────── */}
        <section className="lg:col-span-3">
          <form action={submitContact} className="space-y-5 ...">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" type="text" required />
              <Field label="Email" name="email" type="email" required />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone (optional)" name="phone" type="tel" />
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                placeholder="Tell us how we can help…"
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Send message
            </button>

            <p className="text-xs text-gray-500">
              This form is not yet connected to a backend. We'll wire it to a Server
              Action that writes to Prisma in a follow-up step.
            </p>
          </form>
        </section>

        {/* ─── Offices ──────────────────────────────────────────── */}
        <aside className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Our Offices</h2>
          <ul className="space-y-5">
            {offices.map((o) => (
              <li
                key={o.city}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
              >
                <h3 className="font-semibold">{o.city}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {o.address}
                </p>
                <p className="mt-2 text-sm">
                  <a
                    href={`tel:${o.phone.replace(/\s/g, "")}`}
                    className="text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {o.phone}
                  </a>
                </p>
                <p className="text-sm">
                  <a
                    href={`mailto:${o.email}`}
                    className="text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {o.email}
                  </a>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800">
            <p className="font-medium">Emergency contacts</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Police: <span className="font-mono">999</span> or{" "}
              <span className="font-mono">112</span>
              <br />
              Ambulance: <span className="font-mono">999</span>
              <br />
              Tourist Police Hotline: <span className="font-mono">+254 20 341 4955</span>
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Looking for travel tips?{" "}
          <Link
            href="/plan"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Visit our Plan Your Trip hub →
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Reusable field ──────────────────────────────────────────
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
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
      />
    </div>
  );
}