// app/components/modal-shell.tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/**
 * Modal shell used by every intercepted slug route.
 *
 * Desktop: centered card over a blurred backdrop.
 * Mobile:  full-screen sheet (dialog fills the viewport).
 *
 * Back button / Esc / clicking the backdrop all close the modal
 * by calling router.back() — which restores the previous URL
 * (the list page) without a hard reload.
 */
export function ModalShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (!d.open) d.showModal();
    return () => {
      if (d.open) d.close();
    };
  }, []);

  function close() {
    const d = dialogRef.current;
    if (d?.open) d.close(); // triggers the <dialog>'s onClose handler
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={() => router.back()}
      onClick={(e) => {
        // Click outside the card (the dialog itself) closes it.
        // Clicks on child elements have their target inside the card.
        if (e.target === dialogRef.current) close();
      }}
      className={[
        // Reset native dialog styles.
        "m-0 bg-transparent p-0",
        // Full-screen on mobile — a real page-like sheet.
        "fixed inset-0 h-full w-full max-h-none max-w-none",
        // Desktop: constrain to a centered card, no full-screen height.
        "md:inset-auto md:left-1/2 md:top-1/2 md:h-auto md:w-[min(920px,92vw)]",
        "md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[90vh]",
        // Backdrop blur — matches your app's glass surfaces.
        "backdrop:bg-deep-900/40 backdrop:backdrop-blur-sm",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-full flex-col overflow-hidden",
          "bg-cream-50 text-deep-800",
          "dark:bg-deep-900 dark:text-cream-100",
          // Mobile: full sheet. Desktop: rounded floating card.
          "md:rounded-2xl md:border md:border-deep-200 dark:md:border-deep-800",
          "md:shadow-2xl",
        ].join(" ")}
      >
        <header className="flex items-start justify-between gap-3 border-b border-deep-200 px-6 py-4 dark:border-deep-800">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">
              {eyebrow}
            </div>
            <h2 className="mt-1 truncate text-xl font-bold tracking-tight">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-deep-200 bg-cream-100 text-deep-600 transition hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-800 dark:text-cream-300 dark:hover:bg-deep-700"
          >
            <X size={16} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </dialog>
  );
}