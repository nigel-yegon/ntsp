// app/dashboard/listings/listing-form.tsx
"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createListing,
  updateListing,
  type ListingInput,
} from "./listing-actions";

/* ─── Types ───────────────────────────────────────────────── */

type Destination = { id: number; name: string };

type ItineraryDay = { title: string; description: string };

type Props = {
  mode: "create" | "edit";
  type: "accommodation" | "package";
  destinations: Destination[];
  initial?: Partial<ListingInput>;
  listingId?: number;
};

const ACCOMMODATION_TYPES = ["Hotel", "Lodge", "Resort", "Tented Camp"] as const;

/* ─── Main form ───────────────────────────────────────────── */

export function ListingForm({
  mode,
  type,
  destinations,
  initial,
  listingId,
}: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  // Common
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [destinationId, setDestinationId] = useState<number>(
    initial?.destinationId ?? destinations[0]?.id ?? 0
  );
  const [published, setPublished] = useState(initial?.published ?? false);

  // Accommodation
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

  // Package
  const [title, setTitle] = useState(
    type === "package" && initial?.type === "package" ? initial.title ?? "" : ""
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
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    type === "package" &&
      initial?.type === "package" &&
      Array.isArray(initial.itinerary)
      ? initial.itinerary
      : []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
            priceKes: Number(priceKes),
            durationDays: Number(durationDays),
            imageUrl: imageUrl || null,
            destinationId,
            published,
            itinerary: itinerary.filter(
              (d) => d.title.trim() || d.description.trim()
            ),
          };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createListing(input)
          : await updateListing(listingId!, type, input);

      if (!result.ok) {
        setErrors(result.errors);
        return;
      }

      router.push(
        type === "package"
          ? "/dashboard/listings/packages"
          : "/dashboard/listings"
      );
      router.refresh();
    });
  }

  function handleCancel() {
    router.push(
      type === "package"
        ? "/dashboard/listings/packages"
        : "/dashboard/listings"
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-sm dark:border-deep-700 dark:bg-deep-900 sm:p-8"
    >
      <div className="border-b border-cream-200 pb-4 dark:border-deep-800">
        <h3 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          {mode === "create"
            ? `Create ${type === "accommodation" ? "Accommodation" : "Tour Package"}`
            : `Edit ${type === "accommodation" ? "Accommodation" : "Tour Package"}`}
        </h3>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {type === "accommodation"
            ? "Describe the property. You can edit these details any time."
            : "Describe the itinerary. You can edit these details any time."}
        </p>
      </div>

      <fieldset disabled={pending} className="space-y-5">
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
              options={[...ACCOMMODATION_TYPES]}
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

        {type === "package" && (
          <ItineraryBuilder
            itinerary={itinerary}
            setItinerary={setItinerary}
          />
        )}

        <div className="rounded-xl border border-deep-200 bg-cream-100 p-4 dark:border-deep-800 dark:bg-deep-950/50">
          <ImageUploader
            label="Listing image"
            value={imageUrl}
            onChange={setImageUrl}
            hint="Shown on the public listing page and search results."
            maxSizeMb={5}
            aspect="wide"
          />
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 transition hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-950 dark:hover:bg-deep-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-deep-300 focus:ring-2 focus:ring-brand-500/30"
            style={{ accentColor: "var(--brand-500)" }}
          />
          <div>
            <span className="block text-sm font-medium text-deep-800 dark:text-cream-100">
              Publish this listing
            </span>
            <span className="block text-xs text-deep-500 dark:text-cream-500">
              Visible on the public site once approved by an admin.
            </span>
          </div>
        </label>
      </fieldset>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="space-y-1 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {errors.map((e) => (
            <li key={e} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-cream-200 pt-6 dark:border-deep-800">
        <button
          type="button"
          onClick={handleCancel}
          disabled={pending}
          className="rounded-xl border border-deep-200 px-4 py-2.5 text-sm font-semibold text-deep-600 transition hover:bg-cream-100 disabled:opacity-60 dark:border-deep-800 dark:text-cream-300 dark:hover:bg-deep-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create listing"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}

/* ─── Itinerary builder ───────────────────────────────────── */

function ItineraryBuilder({
  itinerary,
  setItinerary,
}: {
  itinerary: ItineraryDay[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryDay[]>>;
}) {
  function addDay() {
    setItinerary((curr) => [...curr, { title: "", description: "" }]);
  }

  function updateDay(index: number, patch: Partial<ItineraryDay>) {
    setItinerary((curr) =>
      curr.map((day, i) => (i === index ? { ...day, ...patch } : day))
    );
  }

  function removeDay(index: number) {
    setItinerary((curr) => curr.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setItinerary((curr) => {
      const next = [...curr];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    if (index === itinerary.length - 1) return;
    setItinerary((curr) => {
      const next = [...curr];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-deep-200 bg-cream-100 p-4 dark:border-deep-800 dark:bg-deep-950/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold text-deep-700 dark:text-cream-300">
            Day-by-day itinerary
          </span>
          <span className="mt-0.5 block text-xs text-deep-500 dark:text-cream-500">
            Optional — add each day's title and description.
          </span>
        </div>
        <button
          type="button"
          onClick={addDay}
          className="shrink-0 rounded-lg border border-brand-300 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300"
        >
          + Add day
        </button>
      </div>

      {itinerary.length === 0 ? (
        <p className="rounded-lg border border-dashed border-deep-200 p-4 text-center text-xs text-deep-500 dark:border-deep-800 dark:text-cream-500">
          No itinerary days yet. Click &quot;Add day&quot; to start.
        </p>
      ) : (
        <ol className="space-y-3">
          {itinerary.map((day, i) => (
            <li
              key={i}
              className="rounded-lg border border-deep-200 bg-cream-50 p-3 dark:border-deep-800 dark:bg-deep-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Day {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="rounded p-1 text-xs text-deep-500 transition hover:bg-cream-200 hover:text-deep-700 disabled:opacity-30 dark:text-cream-500 dark:hover:bg-deep-800"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === itinerary.length - 1}
                    className="rounded p-1 text-xs text-deep-500 transition hover:bg-cream-200 hover:text-deep-700 disabled:opacity-30 dark:text-cream-500 dark:hover:bg-deep-800"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDay(i)}
                    className="rounded px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <input
                placeholder="Day title (e.g. Arrival & afternoon game drive)"
                value={day.title}
                onChange={(e) => updateDay(i, { title: e.target.value })}
                className="mb-2 w-full rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
              />
              <textarea
                placeholder="What happens on this day…"
                value={day.description}
                onChange={(e) => updateDay(i, { description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100"
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ─── Image uploader ──────────────────────────────────────── */

function ImageUploader({
  label,
  value,
  onChange,
  hint,
  maxSizeMb = 5,
  aspect = "wide",
}: {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  hint?: string;
  maxSizeMb?: number;
  aspect?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMb} MB`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image (JPG, PNG, or WebP).");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
        {label}
      </span>

      {value ? (
        <div
          className={`relative overflow-hidden rounded-xl border border-deep-200 bg-cream-100 dark:border-deep-800 dark:bg-deep-950 ${
            aspect === "square" ? "aspect-square" : "aspect-video"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-linear-to-t from-black/60 to-transparent p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-cream-50 px-3 py-1.5 text-xs font-semibold text-deep-800 transition hover:bg-cream-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-sm font-medium text-white">Uploading…</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-deep-200 bg-cream-100 px-6 py-8 text-center transition hover:border-brand-400 hover:bg-cream-50 dark:border-deep-800 dark:bg-deep-950 dark:hover:border-brand-500 ${
            aspect === "square" ? "aspect-square" : ""
          }`}
        >
          <span className="text-2xl">📷</span>
          <span className="text-sm font-medium text-deep-700 dark:text-cream-300">
            {uploading ? "Uploading…" : "Click or drop an image here"}
          </span>
          <span className="text-xs text-deep-500 dark:text-cream-500">
            JPG, PNG, or WebP · Max {maxSizeMb} MB
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInput}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-xs text-red-700 dark:text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-2 text-xs text-deep-500 dark:text-cream-500">{hint}</p>
      )}
    </div>
  );
}

/* ─── Field primitive ─────────────────────────────────────── */

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
    "w-full rounded-xl border border-deep-200 bg-cream-100 px-3.5 py-3 text-sm text-deep-800 outline-none transition placeholder:text-deep-400 focus:border-brand-500 focus:bg-cream-50 focus:ring-2 focus:ring-brand-500/15 dark:border-deep-800 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-500 dark:focus:bg-deep-950";

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">
        {label}
        {required && (
          <span className="ml-1 text-brand-600 dark:text-brand-400" aria-hidden>
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
        <span className="mt-1.5 block text-xs text-deep-500 dark:text-cream-500">
          {hint}
        </span>
      )}
    </label>
  );
}