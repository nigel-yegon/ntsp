"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/packages", label: "Packages" },
  { href: "/stay", label: "Stay" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = pathname.startsWith("/admin");
  const isDashboard = pathname.startsWith("/dashboard");

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
        className={`z-50 border-b transition-colors ${
          isAdmin ? "" : "sticky top-0"
        } ${
          scrolled
            ? "border-deep-200 bg-cream-100/95 backdrop-blur-md dark:border-deep-800 dark:bg-deep-950/95"
            : "border-deep-200 bg-cream-100/70 backdrop-blur-sm dark:bg-deep-950/70"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">

          {/* Logo */}
          <Link
            href="/"
            className={`flex shrink-0 items-center ${
              isDashboard ? "mr-0.5" : ""
            }`}
            aria-label="National Tourism Service Portal home"
          >
            <Image
              src="/logo-2.png"
              alt="National Tourism Service Portal"
              width={140}
              height={48}
              priority
              className="h-13.75 w-auto"
            />
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-1 xl:flex">
            {links.map((l) => {
              const active = isActive(l.href);

              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-brand-600 dark:text-brand-300"
                        : "text-deep-700 hover:text-deep-900 dark:text-cream-300 dark:hover:text-cream-100"
                    }`}
                  >
                    {l.label}

                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

            <Link
              href="/plan"
              className="hidden rounded-md bg-deep-800 px-3.5 py-1.5 text-sm font-medium text-cream-100 transition hover:bg-deep-900 xl:inline-block dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400"
            >
              Plan Your Trip
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-deep-300 p-2 text-deep-700 xl:hidden dark:border-deep-700 dark:text-cream-200"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-deep-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-cream-100 shadow-2xl dark:bg-deep-950">
            <div className="flex items-center justify-between border-b border-deep-200 px-4 py-3 dark:border-deep-800">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center"
                aria-label="National Tourism Service Portal home"
              >
                <Image
                  src="/logo-2.png"
                  alt="National Tourism Service Portal"
                  width={120}
                  height={40}
                  className="h-9 w-auto"
                />
              </Link>

              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-deep-300 p-1.5 text-sm dark:border-deep-700"
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
                          ? "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                          : "text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-900"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-deep-200 p-3 dark:border-deep-800">
              <Link
                href="/plan"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-deep-800 px-3 py-2.5 text-center text-sm font-medium text-cream-100 dark:bg-brand-500 dark:text-brand-900"
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
