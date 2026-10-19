// app/admin/resources/resources-panel.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  listResources,
  createResource,
  updateResource,
  deleteResource,
  type ResourceRow,
} from "../actions/resources";
import type { ResourceCategory } from "@/lib/db-types";

const CATEGORIES: ResourceCategory[] = [
  "POLICY",
  "RESEARCH",
  "INNOVATION",
  "GUIDELINES",
  "REPORTS",
  "OTHER",
];

const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  POLICY: "Policy",
  RESEARCH: "Research",
  INNOVATION: "Innovation",
  GUIDELINES: "Guidelines",
  REPORTS: "Reports",
  OTHER: "Other",
};

const MAX_BYTES = 50 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResourcesPanel({ search = "" }: { search?: string }) {
  const [rows, setRows] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  async function refresh() {
    try {
      const data = await listResources();
      setRows(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listResources();
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.title, r.description, r.fileName, CATEGORY_LABEL[r.category]]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  function handleDelete(id: string) {
    if (!confirm("Delete this resource? The file will be removed too.")) return;
    const previous = rows;
    setRows((curr) => curr.filter((r) => r.id !== id));
    startTransition(async () => {
      try {
        await deleteResource(id);
      } catch (e) {
        setRows(previous);
        alert(e instanceof Error ? e.message : "Failed to delete");
      }
    });
  }

  function handleTogglePublished(row: ResourceRow) {
    const previous = rows;
    setRows((curr) =>
      curr.map((r) => (r.id === row.id ? { ...r, published: !r.published } : r))
    );
    startTransition(async () => {
      try {
        await updateResource(row.id, { published: !row.published });
      } catch (e) {
        setRows(previous);
        alert(e instanceof Error ? e.message : "Failed to update");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
            aria-hidden
          >
            <FolderIcon />
          </span>
          <div>
            <h2 className="text-xl font-bold text-brand-700 dark:text-brand-300">
              Resources
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-deep-600 dark:text-cream-400">
              Upload policies, research, guidelines, and reports that appear on
              the public resources page.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Upload resource
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {creating && (
        <ResourceForm
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}

      <div className="space-y-3">
        {loading && rows.length === 0 && (
          <div className="h-28 animate-pulse rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900" />
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-deep-200 p-10 text-center text-sm text-deep-500 dark:border-deep-800 dark:text-cream-500">
            {search.trim()
              ? `No resources match "${search.trim()}".`
              : "No resources uploaded yet."}
          </div>
        )}

        {filtered.map((r) => (
          <ResourceRowCard
            key={r.id}
            row={r}
            onDelete={() => handleDelete(r.id)}
            onTogglePublished={() => handleTogglePublished(r)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Upload form ────────────────────────────────────────────

function ResourceForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    if (file) form.set("file", file);

    startTransition(async () => {
      try {
        await createResource(form);
        onCreated();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`File exceeds ${MAX_BYTES / 1024 / 1024} MB`);
      e.target.value = "";
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 space-y-4 rounded-2xl border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
          Upload resource
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-deep-500 hover:text-deep-700 dark:text-cream-500 dark:hover:text-cream-300"
        >
          Cancel
        </button>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-deep-700 dark:text-cream-300">
          Title *
        </span>
        <input
          name="title"
          required
          minLength={3}
          maxLength={200}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-deep-700 dark:text-cream-300">
          Description *
        </span>
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={2000}
          rows={3}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-deep-700 dark:text-cream-300">
            Category
          </span>
          <select name="category" defaultValue="POLICY" className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-deep-700 dark:text-cream-300">
            Order
          </span>
          <input
            name="order"
            type="number"
            defaultValue={0}
            className={inputClass}
          />
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input
            name="published"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-deep-300"
            style={{ accentColor: "var(--brand-500)" }}
          />
          <span className="text-xs text-deep-700 dark:text-cream-300">
            Publish on public page
          </span>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-deep-700 dark:text-cream-300">
          File *
        </span>
        <input
          ref={inputRef}
          type="file"
          name="file"
          required
          onChange={onFile}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
          className="block w-full text-sm text-deep-700 file:mr-3 file:rounded file:border-0 file:bg-brand-400 file:px-3 file:py-2 file:text-sm file:font-medium file:text-deep-900 hover:file:bg-brand-500 dark:text-cream-300"
        />
        {file && (
          <span className="mt-1 block text-xs text-deep-500 dark:text-cream-500">
            {file.name} · {formatBytes(file.size)}
          </span>
        )}
      </label>

      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}

// ─── Row card ────────────────────────────────────────────────

function ResourceRowCard({
  row,
  onDelete,
  onTogglePublished,
}: {
  row: ResourceRow;
  onDelete: () => void;
  onTogglePublished: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 p-5 pl-6 dark:border-deep-800 dark:bg-deep-900">
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${
          row.published ? "bg-brand-500" : "bg-deep-400"
        } opacity-70`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-deep-800 dark:text-cream-100">
              {row.title}
            </h3>
            <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-deep-700 dark:bg-deep-800 dark:text-cream-300">
              {CATEGORY_LABEL[row.category]}
            </span>
            {!row.published && (
              <span className="rounded-full bg-deep-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-deep-600 dark:bg-deep-800 dark:text-cream-400">
                Draft
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-deep-600 dark:text-cream-400">
            {row.description}
          </p>
          <p className="mt-2 text-xs text-deep-500 dark:text-cream-500">
            <span className="font-mono">{row.fileName}</span> ·{" "}
            {formatBytes(row.sizeBytes)} · uploaded{" "}
            {new Date(row.uploadedAt).toLocaleDateString()}
            {row.uploaderName ? ` by ${row.uploaderName}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onTogglePublished}
            className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
          >
            {row.published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-2.5 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-950";

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
};

function FolderIcon() {
  return (
    <svg {...iconBase}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}