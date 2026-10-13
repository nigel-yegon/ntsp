// app/components/image-upload.tsx
"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({
  value,
  onChange,
  label,
  hint,
  maxSizeMb = 5,
  aspect = "wide",
}: {
  /** Storage key (e.g. "uploads/abc/123-photo.jpg") or empty. */
  value: string;
  onChange: (key: string) => void;
  label: string;
  hint?: string;
  maxSizeMb?: number;
  aspect?: "wide" | "square";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image exceeds ${maxSizeMb} MB`);
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }

      const { key } = (await res.json()) as { key: string };
      onChange(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";

  return (
    <div>
      <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
        {label}
      </span>

      {value ? (
        <div className="mt-1 space-y-2">
          <div
            className={`relative overflow-hidden rounded-xl border border-cream-300 bg-cream-100 dark:border-deep-700 dark:bg-deep-950 ${aspectClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${value}`}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 rounded-full bg-deep-900/80 p-1.5 text-cream-100 transition hover:bg-deep-900"
              aria-label="Remove image"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-xs font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 disabled:opacity-60 dark:text-brand-400"
          >
            {uploading ? "Replacing…" : "Replace image"}
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${aspectClass} ${
            dragging
              ? "border-brand-400 bg-brand-50 dark:bg-brand-950/30"
              : "border-cream-300 bg-cream-50 hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin text-deep-500 dark:text-cream-400"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm text-deep-600 dark:text-cream-300">
                Uploading…
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-deep-400 dark:text-cream-500">
                <ImageIcon size={18} aria-hidden="true" />
                <Upload size={18} aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm text-deep-600 dark:text-cream-300">
                Drag an image here, or click to browse
              </p>
              <p className="mt-1 text-xs text-deep-400 dark:text-cream-500">
                JPEG, PNG, or WebP · up to {maxSizeMb} MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={onPick}
        className="sr-only"
      />

      {hint && !error && (
        <span className="mt-1 block text-xs text-deep-500 dark:text-cream-400">
          {hint}
        </span>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}