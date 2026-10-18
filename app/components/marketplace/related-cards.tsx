// app/components/marketplace/related-cards.tsx
import Link from "next/link";
import { resolveImageUrl } from "@/lib/image-url";

// ─── Attraction card ───────────────────────────────────────────────

export type AttractionCardData = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string | null;
};

export function AttractionCard({ attraction }: { attraction: AttractionCardData }) {
  const img = resolveImageUrl(attraction.imageUrl);
  return (
    <article className="overflow-hidden rounded-xl border border-cream-300 bg-cream-50 dark:border-deep-700 dark:bg-deep-900">
      <div className="aspect-video overflow-hidden bg-cream-100 dark:bg-deep-950">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={attraction.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-deep-400 dark:text-cream-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
          {attraction.category}
        </span>
        <h4 className="mt-2 text-sm font-semibold text-deep-800 dark:text-cream-100">
          {attraction.name}
        </h4>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-deep-600 dark:text-cream-400">
          {attraction.description}
        </p>
      </div>
    </article>
  );
}

// ─── Accommodation card ────────────────────────────────────────────

export type AccommodationCardData = {
  id: number;
  name: string;
  slug: string;
  type: string;
  location: string;
  priceRange: string | null;
  imageUrl: string | null;
};

export function AccommodationCard({ stay }: { stay: AccommodationCardData }) {
  const img = resolveImageUrl(stay.imageUrl);
  return (
    <Link
      href={`/stay/${stay.slug}`}
      className="block overflow-hidden rounded-xl border border-cream-300 bg-cream-50 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
    >
      <div className="aspect-video overflow-hidden bg-cream-100 dark:bg-deep-950">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={stay.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-deep-400 dark:text-cream-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-deep-500 dark:text-cream-400">
          {stay.type}
        </p>
        <h4 className="mt-1 text-sm font-semibold text-deep-800 dark:text-cream-100">
          {stay.name}
        </h4>
        <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
          {stay.location}
        </p>
        {stay.priceRange && (
          <p className="mt-2 text-xs font-medium text-brand-700 dark:text-brand-300">
            {stay.priceRange}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Related package card ──────────────────────────────────────────

export type PackageCardData = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  priceKes: number;
  durationDays: number;
  imageUrl: string | null;
  destination: { name: string; county: string };
};

export function RelatedPackageCard({ pkg }: { pkg: PackageCardData }) {
  const img = resolveImageUrl(pkg.imageUrl);
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="flex gap-3 overflow-hidden rounded-xl border border-cream-300 bg-cream-50 p-3 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-100 dark:bg-deep-950">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-deep-400 dark:text-cream-500">
            No img
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-1 text-sm font-semibold text-deep-800 dark:text-cream-100">
          {pkg.title}
        </h4>
        <p className="mt-0.5 line-clamp-1 text-xs text-deep-500 dark:text-cream-400">
          {pkg.destination.name} · {pkg.durationDays}{" "}
          {pkg.durationDays === 1 ? "day" : "days"}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-deep-600 dark:text-cream-300">
          {pkg.summary}
        </p>
        <p className="mt-1 text-xs font-medium text-brand-700 dark:text-brand-300">
          KES {pkg.priceKes.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────

export function RelatedSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-deep-500 dark:text-cream-400">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}