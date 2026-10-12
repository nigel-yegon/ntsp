// app/components/expatriate/file-upload.tsx
"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { useExpatriateForm } from "./form-context";
import type { DocumentSlot } from "./steps";

export function FileUpload({ slot }: { slot: DocumentSlot }) {
  const { state, addFiles, removeFile } = useExpatriateForm();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const descId = useId();

  const files = state.documents[slot.id] ?? [];

  const accept = slot.accept ?? "application/pdf,image/png,image/jpeg";
  const maxBytes = (slot.maxSizeMb ?? 10) * 1024 * 1024;

  const validateAndAdd = useCallback(
    (incoming: File[]) => {
      setError(null);
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const valid: File[] = [];
      const problems: string[] = [];

      for (const file of incoming) {
        const typeOk = acceptedTypes.some((t) => {
          if (t.endsWith("/*")) return file.type.startsWith(t.slice(0, -1));
          return file.type === t;
        });
        if (!typeOk) {
          problems.push(`${file.name}: unsupported file type`);
          continue;
        }
        if (file.size > maxBytes) {
          problems.push(
            `${file.name}: exceeds ${slot.maxSizeMb ?? 10} MB limit`
          );
          continue;
        }
        valid.push(file);
      }

      if (valid.length) addFiles(slot.id, valid);
      if (problems.length) setError(problems.join(" · "));
    },
    [accept, addFiles, maxBytes, slot.id, slot.maxSizeMb]
  );

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    validateAndAdd(Array.from(event.dataTransfer.files));
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-deep-800 dark:text-cream-100"
      >
        {slot.label}
        {slot.required && (
          <span className="ml-1 text-brand-600 dark:text-brand-400" aria-hidden="true">
            *
          </span>
        )}
        <span className="sr-only">
          {slot.required ? " (required)" : " (optional)"}
        </span>
      </label>
      {slot.description && (
        <p id={descId} className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
          {slot.description}
        </p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          mt-2 rounded-xl border-2 border-dashed p-4 text-center text-sm transition
          ${
            dragging
              ? "border-brand-400 bg-brand-50 dark:bg-brand-950/30"
              : "border-cream-300 bg-cream-50 dark:border-deep-700 dark:bg-deep-900"
          }
        `}
      >
        <Paperclip
          size={18}
          className="mx-auto text-deep-500 dark:text-cream-400"
          aria-hidden="true"
        />
        <p className="mt-2 text-deep-600 dark:text-cream-300">
          Drag files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-brand-400 dark:hover:text-brand-300"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-deep-400 dark:text-cream-500">
          Accepted: {accept.split(",").join(", ")} · Max {slot.maxSizeMb ?? 10} MB
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={accept}
          aria-describedby={slot.description ? descId : undefined}
          onChange={(e) => {
            if (e.target.files) validateAndAdd(Array.from(e.target.files));
            e.target.value = "";
          }}
          className="sr-only"
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-brand-700 dark:text-brand-400">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-cream-300 bg-cream-100 px-3 py-2 text-sm dark:border-deep-700 dark:bg-deep-950"
            >
              <span className="truncate text-deep-700 dark:text-cream-200">
                {f.name}
              </span>
              <span className="shrink-0 text-xs text-deep-400 dark:text-cream-500">
                {(f.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                type="button"
                onClick={() => removeFile(slot.id, f.id)}
                aria-label={`Remove ${f.name}`}
                className="shrink-0 rounded-md p-1 text-deep-500 transition hover:bg-cream-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-cream-400 dark:hover:bg-deep-800 dark:hover:text-brand-300"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}