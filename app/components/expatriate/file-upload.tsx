// app/components/expatriate/file-upload.tsx
"use client";

import { useRef, useState } from "react";
import { useExpatriateForm } from "./form-context";
import type { DocumentSlot } from "./steps";

export function FileUpload({ slot }: { slot: DocumentSlot }) {
  const { state, addFiles, removeFile } = useExpatriateForm();
  const files = state.documents[slot.id] ?? [];
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptAttr = normalizeAccept(slot.accept);

  const onPick = (list: FileList | null) => {
    if (!list) return;
    addFiles(slot.id, Array.from(list));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="block text-sm font-medium text-deep-800 dark:text-cream-100">
          {slot.label}
          {slot.required && (
            <span
              className="ml-1 text-brand-600 dark:text-brand-400"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
        {slot.maxSizeMb && (
          <span className="text-xs text-deep-500 dark:text-cream-500">
            up to {slot.maxSizeMb} MB
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onPick(e.dataTransfer.files);
        }}
        className={[
          "group rounded-2xl border-2 border-dashed p-5 text-sm transition",
          dragOver
            ? "border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30"
            : "border-cream-300 bg-cream-100/40 hover:border-brand-300 dark:border-deep-700 dark:bg-deep-950/40 dark:hover:border-brand-700",
        ].join(" ")}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition group-hover:bg-brand-200 dark:bg-brand-950/60 dark:text-brand-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 16V4m0 0L7 9m5-5 5 5" />
              <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
            </svg>
          </span>
          <div>
            <p className="font-medium text-deep-800 dark:text-cream-100">
              Drop a file here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-brand-700 underline underline-offset-2 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-deep-500 dark:text-cream-500">
              {slot.description ?? "PDF, JPG, or PNG"}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptAttr}
            className="sr-only"
            onChange={(e) => onPick(e.target.files)}
          />
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-xs dark:border-deep-700 dark:bg-deep-900"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-deep-800 dark:text-cream-100">
                  {f.name}
                </p>
                <p className="text-[11px] text-deep-500 dark:text-cream-500">
                  {Math.ceil(f.size / 1024)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(slot.id, f.id)}
                className="rounded-lg border border-deep-300 bg-cream-100 px-2.5 py-1 font-medium text-deep-700 transition hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-800 dark:text-cream-300 dark:hover:bg-deep-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function normalizeAccept(accept: unknown): string | undefined {
  if (accept == null) return undefined;
  if (typeof accept === "string") return accept;
  if (Array.isArray(accept)) {
    return accept.filter((x): x is string => typeof x === "string").join(",");
  }
  if (typeof accept === "object") {
    return Object.keys(accept).join(",");
  }
  return undefined;
}