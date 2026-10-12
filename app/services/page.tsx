// app/services/page.tsx
import Link from "next/link";

type Service = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  badge?: string;
};

const services: Service[] = [
  {
    title: "Expatriate Vetting & Work Permits",
    description:
      "Apply for a work permit, special pass, or renewal. Upload required documents step by step.",
    href: "/services/expatriate",
    badge: "Online application",
  },
  {
    title: "Tourism Licence Application",
    description:
      "Apply for or renew a tourism licence for your operation.",
    href: "https://tourkenya.go.ke/",
    external: true,
  },
  {
    title: "Travel & Safety Information",
    description:
      "Current advisories, entry requirements, and safety guidance for visitors.",
    href: "https://tourkenya.go.ke/",
    external: true,
  },
  {
    title: "Report an Incident / Occurrence",
    description:
      "Report an incident involving a licensed operator, guide, or tourism facility.",
    href: "https://tourkenya.go.ke/",
    external: true,
  },
  {
    title: "Local Guides & Experts",
    description:
      "Find licensed guides and tourism professionals across Kenya.",
    href: "https://tourkenya.go.ke/",
    external: true,
  },
  {
    title: "Events & Activity Calendar",
    description:
      "Upcoming tourism events, festivals, and activities.",
    href: "https://tourkenya.go.ke/",
    external: true,
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-deep-800 dark:text-cream-100">
          Services
        </h1>
        <p className="mt-2 max-w-2xl text-deep-500 dark:text-cream-400">
          Access the National Tourism Service Portal services below. Some
          services open on the main portal; others are handled here.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.title}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-medium text-deep-800 dark:text-cream-100">
          {service.title}
        </h2>
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