// app/experiences/[slug]/modal-content.tsx
import Link from "next/link";
import { CardImage } from "@/app/components/card-image";

type Experience = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string | null;
  destination: {
    name: string;
    slug: string;
    county: string;
  };
};

export function ExperienceModalContent({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <>
      <div className="border-b border-deep-200 dark:border-deep-800">
        <CardImage
          name={experience.name}
          imageUrl={experience.imageUrl}
          aspect="2:1"
        />
      </div>

      <div className="space-y-6 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
            📍{" "}
            <Link
              href={`/destinations/${experience.destination.slug}`}
              className="transition hover:text-brand-600 dark:hover:text-brand-400"
            >
              {experience.destination.name}
            </Link>
            {" · "}
            {experience.destination.county} County
          </p>

          <p className="mt-4 leading-7 text-deep-700 dark:text-cream-300">
            {experience.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-deep-200 pt-4 dark:border-deep-800">
          <Link
            href={`/experiences/${experience.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-deep-800 px-4 py-2 text-sm font-medium text-cream-100 transition hover:bg-deep-900 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
          >
            View full page →
          </Link>
          <Link
            href={`/destinations/${experience.destination.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-deep-300 bg-cream-50 px-4 py-2 text-sm font-medium text-deep-700 transition hover:bg-cream-100 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:hover:bg-deep-800"
          >
            Explore {experience.destination.name}
          </Link>
        </div>
      </div>
    </>
  );
}