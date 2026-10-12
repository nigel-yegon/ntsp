// app/components/review/document-group.tsx
import type { Document } from "@/lib/db-types";
import { DocumentStatusBadge } from "./status-badge";
import { SLOT_LOOKUP } from "@/app/components/expatriate/steps";

type Props = {
  documents: Document[];
  stage: "perusal" | "verification";
  renderActions?: (doc: Document) => React.ReactNode;
};

export function DocumentGroup({ documents, stage, renderActions }: Props) {
  const grouped = new Map<string, Document[]>();
  for (const doc of documents) {
    const list = grouped.get(doc.slotId) ?? [];
    list.push(doc);
    grouped.set(doc.slotId, list);
  }

  return (
    <ul className="space-y-4">
      {Array.from(grouped.entries()).map(([slotId, docs]) => {
        const slot = SLOT_LOOKUP[slotId];
        return (
          <li
            key={slotId}
            className="rounded-xl border border-cream-300 bg-cream-50 p-4 dark:border-deep-700 dark:bg-deep-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-deep-800 dark:text-cream-100">
                  {slot?.label ?? slotId}
                  {slot?.required && (
                    <span
                      className="ml-1 text-brand-600 dark:text-brand-400"
                      aria-hidden="true"
                    >
                      *
                    </span>
                  )}
                </h3>
                {slot?.description && (
                  <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                    {slot.description}
                  </p>
                )}
              </div>
            </div>

            <ul className="mt-3 space-y-2">
              {docs.map((doc) => {
                const status =
                  stage === "perusal"
                    ? doc.perusalStatus
                    : doc.verificationStatus;
                return (
                  <li
                    key={doc.id}
                    className="rounded-lg border border-cream-200 bg-cream-100 p-3 dark:border-deep-800 dark:bg-deep-950"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <a
                          href={`/api/documents/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-sm font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                          {doc.fileName}
                        </a>
                        <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                          {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB ·
                          uploaded {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <DocumentStatusBadge status={status} />
                    </div>

                    {doc.reviewNotes && (
                      <p className="mt-2 rounded-md bg-cream-200/60 px-2 py-1.5 text-xs text-deep-700 dark:bg-deep-800/60 dark:text-cream-300">
                        <span className="font-medium">Reviewer note:</span>{" "}
                        {doc.reviewNotes}
                      </p>
                    )}

                    {renderActions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {renderActions(doc)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}