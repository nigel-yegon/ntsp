// app/components/expatriate/stepper.tsx
"use client";

import { STEP_DEFINITIONS } from "./steps";
import { useExpatriateForm, type StepId } from "./form-context";

export function Stepper() {
  const { state, setStep } = useExpatriateForm();
  const currentIndex = STEP_DEFINITIONS.findIndex((s) => s.id === state.step);

  return (
    <nav aria-label="Application progress">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
        {STEP_DEFINITIONS.map((step, index) => {
          const status =
            index < currentIndex
              ? "done"
              : index === currentIndex
                ? "current"
                : "upcoming";

          const canNavigate = index <= currentIndex;

          return (
            <li key={step.id} className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => canNavigate && setStep(step.id as StepId)}
                disabled={!canNavigate}
                aria-current={status === "current" ? "step" : undefined}
                className={`
                  group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
                  ${
                    status === "current"
                      ? "border-brand-400 bg-brand-400 text-deep-900 shadow-sm dark:border-brand-500 dark:bg-brand-500"
                      : status === "done"
                        ? "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100 dark:border-brand-900 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-950/70"
                        : "border-cream-300 bg-cream-50 text-deep-400 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-500"
                  }
                  ${!canNavigate ? "cursor-not-allowed" : ""}
                `}
              >
                <span
                  className={`
                    flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold
                    ${
                      status === "current"
                        ? "bg-deep-900 text-cream-100 dark:bg-deep-950 dark:text-cream-100"
                        : status === "done"
                          ? "bg-brand-400 text-deep-800"
                          : "bg-cream-200 text-deep-500 dark:bg-deep-800 dark:text-cream-500"
                    }
                  `}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              {index < STEP_DEFINITIONS.length - 1 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 text-cream-500 dark:text-deep-600"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}