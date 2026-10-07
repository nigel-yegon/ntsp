"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Accessibility, X } from "lucide-react";
import { useAccessibility } from "./accessibility-provider";

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  const {
    textSize,
    highContrast,
    grayscale,
    readableFont,
    increasedSpacing,
    reducedMotion,
    setTextSize,
    toggleHighContrast,
    toggleGrayscale,
    toggleReadableFont,
    toggleIncreasedSpacing,
    toggleReducedMotion,
    resetAccessibility,
  } = useAccessibility();

  // ESC closes the panel and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const closeAndRestoreFocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="fixed right-0 top-1/2 z-9999 -translate-y-1/2">
      {open && (
        <section
          id={panelId}
          aria-labelledby={titleId}
          className="
            absolute right-14 top-1/2 w-85
            max-w-[calc(100vw-5rem)]
            -translate-y-1/2
            rounded-2xl
            border border-cream-300
            bg-cream-50
            p-5
            text-deep-800
            shadow-2xl
            dark:border-deep-700
            dark:bg-deep-900
            dark:text-cream-100
          "
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2
                id={titleId}
                className="text-lg font-semibold text-deep-800 dark:text-cream-100"
              >
                Accessibility
              </h2>
              <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
                Adjust how NTSP looks and behaves.
              </p>
            </div>

            <button
              type="button"
              onClick={closeAndRestoreFocus}
              aria-label="Close accessibility settings"
              className="
                rounded-lg p-2
                text-deep-500
                transition
                hover:bg-cream-200
                hover:text-deep-800
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-400
                dark:text-cream-400
                dark:hover:bg-deep-800
                dark:hover:text-cream-100
              "
            >
              <X size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Text size */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-deep-800 dark:text-cream-100">
                Text size
              </legend>
              <div className="grid grid-cols-3 gap-2">
                <TextSizeButton
                  label="A"
                  ariaLabel="Normal text size"
                  active={textSize === "normal"}
                  onClick={() => setTextSize("normal")}
                />
                <TextSizeButton
                  label="A+"
                  ariaLabel="Large text size"
                  active={textSize === "large"}
                  onClick={() => setTextSize("large")}
                />
                <TextSizeButton
                  label="A++"
                  ariaLabel="Extra large text size"
                  active={textSize === "xlarge"}
                  onClick={() => setTextSize("xlarge")}
                />
              </div>
            </fieldset>

            {/* Toggles */}
            <div className="space-y-2">
              <AccessibilityToggle
                label="High contrast"
                description="Increase visual contrast"
                enabled={highContrast}
                onClick={toggleHighContrast}
              />
              <AccessibilityToggle
                label="Grayscale"
                description="Remove page colours"
                enabled={grayscale}
                onClick={toggleGrayscale}
              />
              <AccessibilityToggle
                label="Readable font"
                description="Use an accessibility-friendly font"
                enabled={readableFont}
                onClick={toggleReadableFont}
              />
              <AccessibilityToggle
                label="Increased spacing"
                description="Increase text and line spacing"
                enabled={increasedSpacing}
                onClick={toggleIncreasedSpacing}
              />
              <AccessibilityToggle
                label="Reduce motion"
                description="Reduce animations and transitions"
                enabled={reducedMotion}
                onClick={toggleReducedMotion}
              />
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={resetAccessibility}
              className="
                w-full rounded-xl
                border border-cream-300
                px-4 py-2.5
                text-sm font-medium
                text-deep-700
                transition
                hover:border-brand-400
                hover:bg-brand-50
                hover:text-brand-700
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-400
                dark:border-deep-700
                dark:text-cream-300
                dark:hover:border-brand-500
                dark:hover:bg-brand-950/40
                dark:hover:text-brand-300
              "
            >
              Reset accessibility settings
            </button>
          </div>
        </section>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          open
            ? "Close accessibility settings"
            : "Open accessibility settings"
        }
        className="
          flex h-14 w-12
          items-center justify-center
          rounded-l-xl
          border border-r-0
          border-brand-500
          bg-brand-400
          text-deep-800
          shadow-lg
          transition
          hover:bg-brand-500
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-brand-400
          focus-visible:ring-offset-2
          focus-visible:ring-offset-cream-200
          dark:border-brand-600
          dark:bg-brand-400
          dark:text-deep-900
          dark:hover:bg-brand-500
          dark:focus-visible:ring-offset-deep-950
        "
      >
        <Accessibility size={24} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

function TextSizeButton({
  label,
  ariaLabel,
  active,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={`
        rounded-lg border px-3 py-2 font-medium transition
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-400
        ${
          active
            ? `
              border-brand-500
              bg-brand-400
              text-deep-800
              hover:bg-brand-500
              dark:border-brand-600
              dark:bg-brand-400
              dark:text-deep-900
              dark:hover:bg-brand-500
            `
            : `
              border-cream-300
              bg-cream-100
              text-deep-700
              hover:border-brand-400
              hover:bg-brand-50
              hover:text-brand-700
              dark:border-deep-700
              dark:bg-deep-950
              dark:text-cream-300
              dark:hover:border-brand-500
              dark:hover:bg-brand-950/40
              dark:hover:text-brand-300
            `
        }
      `}
    >
      {label}
    </button>
  );
}

function AccessibilityToggle({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`
        flex w-full
        items-center justify-between
        rounded-xl
        border
        p-3
        text-left
        transition
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-400
        ${
          enabled
            ? `
              border-brand-300
              bg-brand-50
              dark:border-brand-700
              dark:bg-brand-950/30
            `
            : `
              border-cream-300
              bg-cream-100
              hover:border-brand-300
              hover:bg-brand-50/60
              dark:border-deep-700
              dark:bg-deep-950
              dark:hover:border-brand-700
              dark:hover:bg-brand-950/30
            `
        }
      `}
    >
      <span>
        <span
          className={`
            block text-sm font-medium
            ${
              enabled
                ? "text-brand-700 dark:text-brand-300"
                : "text-deep-800 dark:text-cream-100"
            }
          `}
        >
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-deep-500 dark:text-cream-400">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={`
          ml-3 flex h-6 w-11
          shrink-0 items-center
          rounded-full
          p-1
          transition
          ${
            enabled
              ? "bg-brand-500 dark:bg-brand-400"
              : "bg-cream-400 dark:bg-deep-700"
          }
        `}
      >
        <span
          className={`
            h-4 w-4
            rounded-full
            bg-cream-50
            shadow-sm
            transition
            ${enabled ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </span>
    </button>
  );
}