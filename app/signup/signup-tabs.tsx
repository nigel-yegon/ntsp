// app/signup/signup-tabs.tsx
"use client";

import { useState } from "react";
import { CustomerSignupForm } from "./customer-signup-form";
import { BusinessSignupForm } from "./business-signup-form";
import { EmployerSignupForm } from "./signup-form";

type Tab = "customer" | "business" | "employer";

const TABS: { key: Tab; label: string; description: string }[] = [
  {
    key: "customer",
    label: "Traveller",
    description: "Send inquiries, request bookings, and message lodges.",
  },
  {
    key: "business",
    label: "Business",
    description: "List your lodge or tour packages and manage inquiries.",
  },
  {
    key: "employer",
    label: "Employer",
    description: "Submit work permit applications for your staff.",
  },
];

export function SignupTabs() {
  const [tab, setTab] = useState<Tab>("customer");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Account type"
        className="mb-6 grid grid-cols-3 gap-1 rounded-xl border border-cream-300 bg-cream-100 p-1 dark:border-deep-700 dark:bg-deep-900"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-brand-400 text-deep-800"
                : "text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm text-deep-500 dark:text-cream-400">
        {TABS.find((t) => t.key === tab)?.description}
      </p>

      {tab === "customer" && <CustomerSignupForm />}
      {tab === "business" && <BusinessSignupForm />}
      {tab === "employer" && <EmployerSignupForm />}
    </div>
  );
}