// app/resources/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FadeIn from "@/app/components/fade-in";
import { Stagger } from "@/app/components/stagger";
import type { ResourceCategory } from "@/lib/db-types";

export const metadata: Metadata = {
  title: "Resources — NTSP",
  description:
    "Policies, research, innovation briefs, guidelines, and reports from the tourism sector. View online or download.",
};

const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  POLICY: "Policy",
  RESEARCH: "Research",
  INNOVATION: "Innovation",
  GUIDELINES: "Guidelines",
  REPORTS: "Reports",
  OTHER: "Other",
};

const CATEGORY_ORDER: ResourceCategory[] = [
  "POLICY",
  "RESEARCH",
  "INNOVATION",
  "GUIDELINES",
  "REPORTS",
  "OTHER",
];

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { order: "asc" }, { uploadedAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      storageKey: true,
      uploadedAt: true,
    },
  });

  // Group by category, preserving the natural category order and
  // dropping empty groups.
  const grouped = CATEGORY_ORDER.map((c) => ({
    category: c,
    items: resources.filter((r) => r.category === c),
  })).filter((g) => g.items.length > 0);

  const total = resources.length;

  return (
    <main className="min-h-screen bg-cream-200 dark:bg-deep-950">
      <section className="hero-band border-b border-cream-300/60 dark:border-deep-800">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            Library
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-deep-900 dark:text-cream-100 sm:text-4xl">
            Resources
          </h1>
          <div className="divider-gold mt-5 w-24" />
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-deep-600 dark:text-cream-300 sm:text-base">
            Policies, research publications, innovation briefs, guidelines, and
            reports from Kenya&apos;s tourism sector. Every document can be read
            in the browser or downloaded for reference.
          </p>
          {total > 0 && (
            <p className="mt-3 text-xs text-deep-500 dark:text-cream-500">
              {total} {total === 1 ? "document" : "documents"} published
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {grouped.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-deep-200 p-12 text-center dark:border-deep-800">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-deep-500 dark:bg-deep-900 dark:text-cream-500">
              <FolderIcon />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-deep-800 dark:text-cream-100">
              No resources published yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-xs text-deep-500 dark:text-cream-500">
              Documents published through the admin dashboard will appear here.
            </p>
          </div>
        )}

        {grouped.map((group) => (
          <FadeIn key={group.category} whenVisible>
            <section>
              <header className="mb-4">
                <h2 className="text-lg font-bold text-deep-800 dark:text-cream-100">
                  {CATEGORY_LABEL[group.category]}
                </h2>
              </header>
              <div className="grid gap-3">
                <Stagger delayStart={0.05} delayStep={0.04} maxDelay={0.3}>
                  {group.items.map((r) => (
                    <ResourceCard key={r.id} resource={r} />
                  ))}
                </Stagger>
              </div>
            </section>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}

function ResourceCard({
  resource,
}: {
  resource: {
    id: string;
    title: string;
    description: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
    uploadedAt: Date;
  };
}) {
  const viewUrl = `/api/files/${resource.storageKey}`;
  const downloadUrl = `${viewUrl}?download=1`;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
        >
          <FileTypeIcon mimeType={resource.mimeType} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
            {resource.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-deep-600 dark:text-cream-400">
            {resource.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-deep-500 dark:text-cream-500">
            <span className="font-mono">{resource.fileName}</span>
            <span aria-hidden>·</span>
            <span>{formatBytes(resource.sizeBytes)}</span>
            <span aria-hidden>·</span>
            <span>
              Added {new Date(resource.uploadedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-400 px-3.5 py-2 text-xs font-semibold text-deep-900 transition hover:bg-brand-500"
            >
              <EyeIcon />
              View
            </a>
            <a
              href={downloadUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-deep-200 bg-cream-100 px-3.5 py-2 text-xs font-semibold text-deep-700 transition hover:bg-cream-200 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-300 dark:hover:bg-deep-800"
            >
              <DownloadIcon />
              Download
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
};

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType === "application/pdf") {
    return (
      <svg {...iconBase}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
        <path d="M14 3v6h6" />
        <path d="M9 15h6M9 18h4" />
      </svg>
    );
  }
  return (
    <svg {...iconBase}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
      <path d="M14 3v6h6" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg {...iconBase} className="h-3.5 w-3.5">
      <path d="M12 3v12M6 11l6 6 6-6M4 21h16" />
    </svg>
  );
}