// app/dashboard/listings/listing-form.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ListingInput, ListingActionResult } from "./listing-actions";

type Destination = { id: number; name: string };

type Props = {
  mode: "create" | "edit";
  type: "accommodation" | "package";
  destinations: Destination[];
  initial?: Partial<ListingInput>;
  listingId?: number;
  onSubmit: (input: ListingInput) => Promise<ListingActionResult>;
};

const ACCOMMODATION_TYPES = ["Hotel", "Lodge", "Resort", "Tented Camp"];

export function ListingForm({
  mode,
  type,
  destinations,
  initial,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<string[]>([]);

  // Common fields
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [destinationId, setDestinationId] = useState<number>(
    initial?.destinationId ?? destinations[0]?.id ?? 0
  );
  const [published, setPublished] = useState(initial?.published ?? false);

  // Accommodation-specific
  const [name, setName] = useState(
    type === "accommodation" && initial?.type === "accommodation"
      ? initial.name ?? ""
      : ""
  );
  const [accommodationType, setAccommodationType] = useState(
    type === "accommodation" && initial?.type === "accommodation"
      ? initial.accommodationType ?? "Lodge"
      : "Lodge"
  );
  const [location, setLocation] = useState(
    type === "accommodation" && initial?.type === "accommodation"
      ? initial.location ?? ""
      : ""
  );
  const [priceRange, setPriceRange] = useState(
    type === "accommodation" && initial?.type === "accommodation"
      ? initial.priceRange ?? ""
      : ""
  );

  // Package-specific
  const [title, setTitle] = useState(
    type === "package" && initial?.type === "package"
      ? initial.title ?? ""
      : ""
  );
  const [summary, setSummary] = useState(
    type === "package" && initial?.type === "package"
      ? initial.summary ?? ""
      : ""
  );
  const [priceKes, setPriceKes] = useState(
    type === "package" && initial?.type === "package"
      ? initial.priceKes ?? 0
      : 0
  );
  const [durationDays, setDurationDays] = useState(
    type === "package" && initial?.type === "package"
      ? initial.durationDays ?? 1
      : 1
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);

    const input: ListingInput =
      type === "accommodation"
        ? {
            type: "accommodation",
            name,
            slug,
            accommodationType,
            description,
            location,
            priceRange: priceRange || null,
            imageUrl: imageUrl || null,
            destinationId,
            published,
          }
        : {
            type: "package",
            title,
            slug,
            summary,
            description,
            priceKes,
            durationDays,
            imageUrl: imageUrl || null,
            destinationId,
            published,
          };

    startTransition(async () => {
      const result = await onSubmit(input);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      router.push("/dashboard/listings");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={pending} className="space-y-5">
        <legend className="text-sm font-semibold uppercase tracking-wide text-deep-500 dark:text-cream-400">
          {type === "accommodation"
            ? "Accommodation details"
            : "Package details"}
        </legend>

        {type === "accommodation" ? (
          <>
            <Field
              label="Name"
              value={name}
              onChange={setName}
              required
              placeholder="Mara Serena Safari Lodge"
            />
            <Field
              label="Slug"
              value={slug}
              onChange={setSlug}
              required
              hint="Lowercase, hyphenated. Used in the public URL."
              placeholder="mara-serena"
            />
            <Field
              label="Type"
              as="select"
              value={accommodationType}
              onChange={setAccommodationType}
              options={ACCOMMODATION_TYPES}
            />
            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              required
              placeholder="Maasai Mara, Narok"
            />
            <Field
              label="Price range"
              value={priceRange}
              onChange={setPriceRange}
              placeholder="KES 25,000 - 55,000"
            />
          </>
        ) : (
          <>
            <Field
              label="Title"
              value={title}
              onChange={setTitle}
              required
              placeholder="3-Day Maasai Mara Safari"
            />
            <Field
              label="Slug"
              value={slug}
              onChange={setSlug}
              required
              hint="Lowercase, hyphenated. Used in the public URL."
              placeholder="3-day-maasai-mara"
            />
            <Field
              label="Summary"
              value={summary}
              onChange={setSummary}
              required
              placeholder="Game drives in the world's most famous wildlife reserve."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Price (KES)"
                type="number"
                value={String(priceKes)}
                onChange={(v) => setPriceKes(Number(v))}
                required
                min={1}
              />
              <Field
                label="Duration (days)"
                type="number"
                value={String(durationDays)}
                onChange={(v) => setDurationDays(Number(v))}
                required
                min={1}
              />
            </div>
          </>
        )}

        <Field
          label="Destination"
          as="select"
          value={String(destinationId)}
          onChange={(v) => setDestinationId(Number(v))}
          options={destinations.map((d) => ({
            value: String(d.id),
            label: d.name,
          }))}
        />

        <Field
          label="Description"
          as="textarea"
          value={description}
          onChange={setDescription}
          required
          rows={5}
        />

        <Field
          label="Image URL"
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="/images/stays/… or https://…"
          hint="Paste a URL to an image. File uploads come later."
        />

        <label className="flex items-center gap-3 rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 dark:border-deep-700 dark:bg-deep-900">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-brand-500"
          />
          <span className="text-sm text-deep-800 dark:text-cream-100">
            Publish this listing on the public site
          </span>
        </label>
      </fieldset>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="space-y-1 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-400 px-5 py-2.5 text-sm font-medium text-deep-800 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {pending
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create listing"
              : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/listings")}
          disabled={pending}
          className="rounded-lg border border-cream-300 px-5 py-2.5 text-sm font-medium text-deep-700 transition hover:bg-cream-100 disabled:opacity-60 dark:border-deep-700 dark:text-cream-300 dark:hover:bg-deep-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ─── Field primitive ─────────────────────────────────────────────── */

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: string;
  min?: number;
  rows?: number;
  as?: "input" | "textarea" | "select";
  options?: string[] | { value: string; label: string }[];
};

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
  type = "text",
  min,
  rows = 3,
  as = "input",
  options,
}: FieldProps) {
  const baseClass =
    "mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100";

  return (
    <label className="block">
      <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
        {label}
        {required && (
          <span
            className="ml-1 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </span>

      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={baseClass}
        />
      ) : as === "select" && options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        >
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            )
          )}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          min={min}
          className={baseClass}
        />
      )}

      {hint && (
        <span className="mt-1 block text-xs text-deep-500 dark:text-cream-400">
          {hint}
        </span>
      )}
    </label>
  );
}