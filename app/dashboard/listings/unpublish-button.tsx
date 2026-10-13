// app/dashboard/listings/unpublish-button.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unpublishListing } from "./listing-actions";

export function UnpublishButton({
  listingId,
  type,
}: {
  listingId: number;
  type: "accommodation" | "package";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (
      !confirm(
        "Unpublish this listing? It will be hidden from the public site but kept in your dashboard."
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await unpublishListing(listingId, type);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 disabled:opacity-60 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
      >
        {pending ? "Unpublishing…" : "Unpublish"}
      </button>
      {error && (
        <span role="alert" className="ml-2 text-xs text-red-700 dark:text-red-400">
          {error}
        </span>
      )}
    </>
  );
}