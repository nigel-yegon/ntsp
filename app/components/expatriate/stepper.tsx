// app/components/expatriate/stepper.tsx
"use client";

import { STEP_DEFINITIONS } from "./steps";
import { useExpatriateForm, type StepId } from "./form-context";

export function Stepper() {
  const { state, setStep } = useExpatriateForm();
  const currentIndex = STEP_DEFINITIONS.findIndex((s) => s.id === state.step);

  return (
    <nav aria-label="Application progress" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {STEP_DEFINITIONS.map((step, index) => {
          const status =
            index < currentIndex
              ? "done"
              : index === currentIndex
              ? "current"
              : "upcoming";

          const canNavigate = index <= currentIndex;

          return (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => canNavigate && setStep(step.id as StepId)}
                disabled={!canNavigate}
                aria-current={status === "current" ? "step" : undefined}
                className={`
                  flex items-center gap-2 rounded-full px-3 py-1.5 transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
                  ${
                    status === "current"
                      ? "bg-brand-400 text-deep-800"
                      : status === "done"
                      ? "bg-brand-50 text-brand-800 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-950/60"
                      : "bg-cream-100 text-deep-400 dark:bg-deep-900 dark:text-cream-500"
                  }
                  ${!canNavigate ? "cursor-not-allowed" : ""}
                `}
              >
                <span
                  className={`
                    flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                    ${
                      status === "current"
                        ? "bg-deep-800 text-cream-50"
                        : status === "done"
                        ? "bg-brand-400 text-deep-800"
                        : "bg-cream-300 text-deep-500 dark:bg-deep-700 dark:text-cream-400"
                    }
                  `}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              {index < STEP_DEFINITIONS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-px w-4 bg-cream-300 dark:bg-deep-700"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}