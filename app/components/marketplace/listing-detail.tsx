// app/components/marketplace/listing-detail.tsx
import Link from "next/link";

export type ListingImage = {
  url: string;
  alt: string;
};

type Props = {
  /** Small eyebrow above the title — e.g. "Lodge" or "Tour package". */
  eyebrow: string;
  title: string;
  destination?: { name: string; slug: string } | null;
  /** Short one-liner, shown under the title. E.g. location or duration. */
  subtitle?: string;
  description: string;
  /** Primary image, shown large. Falls back to first gallery image. */
  heroImage?: string | null;
  /** Additional images, shown in a strip below the hero. */
  gallery?: ListingImage[];
  /** Label/value pairs shown in the details grid. */
  details: { label: string; value: string }[];
  /** The business that owns this listing, if visible. */
  businessName?: string | null;
};

export function ListingDetail({
  eyebrow,
  title,
  destination,
  subtitle,
  description,
  heroImage,
  gallery = [],
  details,
  businessName,
}: Props) {
  const hasHero = !!heroImage;
  const extraImages = gallery.filter((img) => img.url !== heroImage);

  return (
    <article>
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-deep-500 dark:text-cream-400">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        {destination ? (
          <>
            <Link
              href={`/destinations/${destination.slug}`}
              className="hover:text-brand-600"
            >
              {destination.name}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
          </>
        ) : null}
        <span className="text-deep-700 dark:text-cream-200">{title}</span>
      </nav>

      {/* Hero */}
      {hasHero && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-cream-300 bg-cream-100 dark:border-deep-700 dark:bg-deep-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage!}
            alt={title}
            className="h-80 w-full object-cover sm:h-105"
          />
        </div>
      )}

      {/* Gallery strip */}
      {extraImages.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {extraImages.slice(0, 8).map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="overflow-hidden rounded-lg border border-cream-300 bg-cream-100 dark:border-deep-700 dark:bg-deep-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-deep-800 dark:text-cream-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            {subtitle}
          </p>
        )}
        {businessName && (
          <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
            Operated by{" "}
            <span className="font-medium text-deep-700 dark:text-cream-200">
              {businessName}
            </span>
          </p>
        )}
      </header>

      {/* Description */}
      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-deep-800 dark:text-cream-100">
          About this {eyebrow.toLowerCase()}
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-7 text-deep-700 dark:text-cream-200">
          {description}
        </p>
      </section>

      {/* Details grid */}
      {details.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-deep-800 dark:text-cream-100">
            Details
          </h2>
          <dl className="grid gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-5 sm:grid-cols-2 dark:border-deep-700 dark:bg-deep-900">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs text-deep-500 dark:text-cream-400">
                  {d.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-deep-800 dark:text-cream-100">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}