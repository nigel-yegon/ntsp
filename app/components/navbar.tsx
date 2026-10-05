"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences",  label: "Experiences"  },
  { href: "/packages",     label: "Packages"     },
  { href: "/stay",         label: "Stay"         },
  { href: "/events",       label: "Events"       },
  { href: "/blog",         label: "Blog"         },
  { href: "/about",        label: "About"        },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          scrolled
            ? "border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95"
            : "border-transparent bg-white/70 backdrop-blur-sm dark:bg-gray-950/70"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
            aria-label="NTSP home"
          >
            <Image
              src="/logo-2.png"
              alt="NTSP"
              width={140}
              height={40}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  >
                    {l.label}
                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/plan"
              className="hidden rounded-md bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 md:inline-block"
            >
              Plan Your Trip
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-gray-300 p-2 md:hidden dark:border-gray-700"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center font-bold"
                aria-label="NTSP home"
              >
                <Image
                  src="/logo-2.png"
                  alt="NTSP"
                  width={120}
                  height={34}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-gray-300 p-1.5 text-sm dark:border-gray-700"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <ul className="flex flex-col p-3">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-gray-200 p-3 dark:border-gray-800">
              <Link
                href="/plan"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}