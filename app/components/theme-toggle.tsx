"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const options = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark",  label: "Dark",  icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!mounted) {
    // Placeholder with same dimensions to avoid layout shift
    return <div className="h-9 w-9" aria-hidden />;
  }

  const current = options.find((o) => o.value === theme) ?? options[2];
  const displayIcon = resolvedTheme === "dark" ? "🌙" : "☀️";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-sm transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{displayIcon}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          {options.map((o) => (
            <button
              key={o.value}
              role="menuitem"
              onClick={() => {
                setTheme(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                current.value === o.value
                  ? "font-medium text-brand-600 dark:text-brand-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>{o.icon}</span>
              <span>{o.label}</span>
              {current.value === o.value && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}