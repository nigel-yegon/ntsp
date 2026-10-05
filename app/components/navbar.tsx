"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences",  label: "Experiences"  },
  { href: "/packages",     label: "Packages"     },
  { href: "/stay",         label: "Stay"         },
  { href: "/events",       label: "Events"       },
  {href: "/blog",         label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl">🇰🇪</span>
          <span>NTSP</span>
        </Link>

        <ul className="hidden gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/plan"
            className="hidden rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 md:inline-block"
          >
            Plan Your Trip
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border border-gray-300 p-2 md:hidden dark:border-gray-700"
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden dark:border-gray-800 dark:bg-gray-950">
          <ul className="flex flex-col p-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/plan"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white"
              >
                Plan Your Trip
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}