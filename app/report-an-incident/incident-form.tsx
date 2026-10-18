// app/report-an-incident/incident-form.tsx
"use client";

import { useRef, useState } from "react";

const CATEGORIES = [
  { value: "WILDLIFE", label: "Wildlife" },
  { value: "SAFETY", label: "Safety" },
  { value: "OPERATOR", label: "Operator" },
  { value: "FACILITY", label: "Facility" },
  { value: "GUIDES", label: "Guides" },
  { value: "OTHER", label: "Other" },
] as const;

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; referenceNo: string; id: string; attachments: number }
  | { kind: "error"; message: string };

export default function IncidentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);

    if (picked.length > MAX_FILES) {
      setState({
        kind: "error",
        message: `You can attach at most ${MAX_FILES} files.`,
      });
      e.target.value = "";
      setFiles([]);
      return;
    }

    for (const f of picked) {
      if (f.size > MAX_FILE_BYTES) {
        setState({
          kind: "error",
          message: `"${f.name}" is larger than ${
            MAX_FILE_BYTES / 1024 / 1024
          } MB.`,
        });
        e.target.value = "";
        setFiles([]);
        return;
      }
      if (!ALLOWED_MIME.includes(f.type as (typeof ALLOWED_MIME)[number])) {
        setState({
          kind: "error",
          message: `"${f.name}" has an unsupported type. Upload JPEG, PNG, WebP, or PDF.`,
        });
        e.target.value = "";
        setFiles([]);
        return;
      }
    }

    setState({ kind: "idle" });
    setFiles(picked);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    setFieldErrors({});
    setState({ kind: "submitting" });

    const form = new FormData(e.currentTarget);

    // Normalize datetime-local → ISO with timezone.
    const occurredRaw = form.get("occurredAt");
    if (typeof occurredRaw === "string" && occurredRaw.length > 0) {
      const asDate = new Date(occurredRaw);
      if (!Number.isNaN(asDate.getTime())) {
        form.set("occurredAt", asDate.toISOString());
      } else {
        form.delete("occurredAt");
      }
    } else {
      form.delete("occurredAt");
    }

    form.delete("attachments");
    for (const f of files) form.append("attachments", f);

    let res: Response;
    try {
      res = await fetch("/api/incidents", { method: "POST", body: form });
    } catch {
      setState({
        kind: "error",
        message: "Network error. Please check your connection and try again.",
      });
      return;
    }

    if (res.status === 201) {
      const data = (await res.json()) as {
        id: string;
        referenceNo: string;
        attachments?: number;
      };
      setState({
        kind: "success",
        id: data.id,
        referenceNo: data.referenceNo,
        attachments: data.attachments ?? 0,
      });
      formRef.current?.reset();
      setFiles([]);
      setFileInputKey((k) => k + 1);
      return;
    }

    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      issues?: Record<string, string[]>;
    };

    if (body.issues) setFieldErrors(body.issues);

    setState({
      kind: "error",
      message: body.error ?? `Submission failed (${res.status}).`,
    });
  }

  if (state.kind === "success") {
    return (
      <div className="rounded-lg border border-brand-300 bg-brand-50 p-6 dark:border-brand-700 dark:bg-brand-900/30">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-400 text-deep-900"
          >
            ✓
          </span>
          <div>
            <h2 className="text-lg font-semibold text-brand-800 dark:text-brand-200">
              Report received
            </h2>
            <p className="mt-1 text-sm text-brand-700 dark:text-brand-300">
              Your reference number is{" "}
              <span className="font-mono font-semibold text-brand-900 dark:text-brand-100">
                {state.referenceNo}
              </span>
              . Please keep this for follow-up.
            </p>
            {state.attachments > 0 && (
              <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">
                {state.attachments} attachment
                {state.attachments === 1 ? "" : "s"} uploaded.
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="mt-5 rounded-md border border-brand-500 px-4 py-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-100 dark:border-brand-500 dark:text-brand-200 dark:hover:bg-brand-900/40"
        >
          Submit another report
        </button>
      </div>
    );
  }

  const busy = state.kind === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-8">
      {/* ── Reporter details ─────────────────────────────── */}
      <fieldset className="space-y-4" disabled={busy}>
        <legend className="text-base font-semibold text-deep-900 dark:text-cream-100">
          Your details{" "}
          <span className="text-sm font-normal text-deep-500 dark:text-cream-400">
            (optional)
          </span>
        </legend>
        <p className="text-xs text-deep-500 dark:text-cream-400">
          Leave these blank to submit anonymously.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="reporterName" errors={fieldErrors} />
          <Field
            label="Email"
            name="reporterEmail"
            type="email"
            errors={fieldErrors}
            placeholder="you@example.com"
          />
          <Field
            label="Phone"
            name="reporterPhone"
            type="tel"
            errors={fieldErrors}
            placeholder="+254 …"
          />
        </div>
      </fieldset>

      <hr className="divider-gold" />

      {/* ── Incident details ─────────────────────────────── */}
      <fieldset className="space-y-4" disabled={busy}>
        <legend className="text-base font-semibold text-deep-900 dark:text-cream-100">
          What happened
        </legend>

        <Field
          label="Title"
          name="title"
          required
          maxLength={200}
          errors={fieldErrors}
          placeholder="Short summary of the incident"
        />

        <Textarea
          label="Description"
          name="description"
          required
          rows={6}
          maxLength={10_000}
          errors={fieldErrors}
          placeholder="Describe the incident, who was involved, and what happened."
        />

        <Field
          label="Location"
          name="location"
          maxLength={300}
          errors={fieldErrors}
          placeholder="e.g. Watamu Marine Park"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            name="category"
            options={CATEGORIES}
            errors={fieldErrors}
          />
          <Field
            label="When did it happen?"
            name="occurredAt"
            type="datetime-local"
            errors={fieldErrors}
          />
        </div>
      </fieldset>

      <hr className="divider-gold" />

      {/* ── Attachments ──────────────────────────────────── */}
      <fieldset className="space-y-2" disabled={busy}>
        <legend className="text-base font-semibold text-deep-900 dark:text-cream-100">
          Attachments{" "}
          <span className="text-sm font-normal text-deep-500 dark:text-cream-400">
            (optional)
          </span>
        </legend>
        <p className="text-xs text-deep-500 dark:text-cream-400">
          Up to {MAX_FILES} files, {MAX_FILE_BYTES / 1024 / 1024} MB each.
          Accepted: JPEG, PNG, WebP, PDF.
        </p>
        <input
          key={fileInputKey}
          type="file"
          name="attachments"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={onFileChange}
          className="block w-full cursor-pointer rounded-md border border-cream-300 bg-cream-100 text-sm text-deep-700 file:mr-3 file:cursor-pointer file:rounded-l-md file:border-0 file:bg-brand-400 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-deep-900 hover:file:bg-brand-500 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-300 dark:file:bg-brand-400 dark:file:text-deep-900"
        />
        {files.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-deep-600 dark:text-cream-400">
            {files.map((f) => (
              <li key={`${f.name}-${f.size}`} className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-400" />
                {f.name} · {(f.size / 1024).toFixed(0)} KB
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {/* ── Error banner ─────────────────────────────────── */}
      {state.kind === "error" && (
        <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {state.message}
        </p>
      )}

      {/* ── Submit ───────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-brand-400 px-5 py-2.5 text-sm font-semibold text-deep-900 shadow-sm transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit report"}
        </button>
        {busy && (
          <span className="text-xs text-deep-500 dark:text-cream-400">
            Uploading attachments and saving…
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Presentational helpers ─────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  maxLength,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  errors: Record<string, string[]>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-deep-700 dark:text-cream-200">
        {label}
        {required && (
          <span className="text-brand-600 dark:text-brand-400"> *</span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 shadow-sm placeholder:text-deep-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-400 dark:focus:ring-brand-900"
      />
      <FieldError errors={errors[name]} />
    </label>
  );
}

function Textarea({
  label,
  name,
  rows = 4,
  required,
  placeholder,
  maxLength,
  errors,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  errors: Record<string, string[]>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-deep-700 dark:text-cream-200">
        {label}
        {required && (
          <span className="text-brand-600 dark:text-brand-400"> *</span>
        )}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 block w-full resize-y rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 shadow-sm placeholder:text-deep-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:placeholder:text-cream-500 dark:focus:border-brand-400 dark:focus:ring-brand-900"
      />
      <FieldError errors={errors[name]} />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  errors,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  errors: Record<string, string[]>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-deep-700 dark:text-cream-200">
        {label}
      </span>
      <select
        name={name}
        defaultValue="OTHER"
        className="mt-1 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-deep-800 shadow-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:focus:border-brand-400 dark:focus:ring-brand-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError errors={errors[name]} />
    </label>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <span className="mt-1 block text-xs text-red-600 dark:text-red-400">
      {errors[0]}
    </span>
  );
}