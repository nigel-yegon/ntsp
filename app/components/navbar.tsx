// app/components/navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import type { SiteChromeSession } from "./site-chrome";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/packages", label: "Packages" },
  { href: "/stay", label: "Stay" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
];

const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
};

const ROLE_LABEL: Record<string, string> = {
  EMPLOYER: "Employer",
  VERIFIER: "Verifier",
  COMMITTEE_MEMBER: "Committee",
  PERMANENT_SECRETARY: "Permanent Secretary",
  ADMIN: "Administrator",
};

export function Navbar({
  static: isStatic = false,
  session,
}: {
  static?: boolean;
  session: SiteChromeSession;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Now tracks "which dropdown is open": null | 'user' | 'anon'
  const [menuOpen, setMenuOpen] = useState<null | "user" | "anon">(null);

  const isDashboard =
    isStatic ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/admin");

  // Close all menus on route change
  useEffect(() => {
    setOpen(false);
    setMenuOpen(null);
  }, [pathname]);

  // Track scroll position for the header's background treatment
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close whichever dropdown is open on outside click and Escape
  useEffect(() => {
    if (!menuOpen) return;

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setMenuOpen(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(null);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`z-50 border-b transition-colors ${
          isDashboard ? "" : "top-0"
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
              isDashboard ? "ml-0.5" : ""
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

            {/* Auth slot — always one button, dropdown handles both states */}
            <div className="relative" data-user-menu>
              {session ? (
                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen((v) => (v === "user" ? null : "user"))
                  }
                  aria-expanded={menuOpen === "user"}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-full border border-deep-300 bg-cream-100 py-1 pl-1 pr-2.5 text-sm text-deep-800 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:border-brand-500"
                >
                  <Avatar name={session.name} />
                  <span className="hidden max-w-40 truncate sm:inline">
                    {session.name}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen((v) => (v === "anon" ? null : "anon"))
                  }
                  aria-expanded={menuOpen === "anon"}
                  aria-haspopup="menu"
                  aria-label="Account"
                  className="flex items-center gap-2 rounded-full border border-deep-300 bg-cream-100 p-2 text-deep-800 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:text-cream-100 dark:hover:border-brand-500"
                >
                  <UserIcon size={18} aria-hidden="true" />
                </button>
              )}

              {session && menuOpen === "user" && (
                <UserMenuPanel
                  session={session}
                  onClose={() => setMenuOpen(null)}
                />
              )}

              {!session && menuOpen === "anon" && (
                <AnonMenuPanel onClose={() => setMenuOpen(null)} />
              )}
            </div>

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
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — unchanged except the auth section below */}
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-deep-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-cream-100 shadow-2xl dark:bg-deep-950">
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
                className="rounded-md border border-deep-300 p-1.5 text-deep-700 dark:border-deep-700 dark:text-cream-200"
                aria-label="Close menu"
              >
                <X size={16} aria-hidden="true" />
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
              {session ? (
                <>
                  <div className="mb-3 flex items-center gap-3 rounded-md bg-cream-200/60 px-3 py-2.5 dark:bg-deep-900/60">
                    <Avatar name={session.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-deep-800 dark:text-cream-100">
                        {session.name}
                      </p>
                      <p className="truncate text-xs text-deep-500 dark:text-cream-400">
                        {session.email}
                      </p>
                    </div>
                  </div>

                  <p className="mb-2 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
                    {ROLE_LABEL[session.role] ?? session.role}
                  </p>

                  <Link
                    href={ROLE_HOME[session.role] ?? "/"}
                    onClick={() => setOpen(false)}
                    className="mb-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-900"
                  >
                    <LayoutDashboard size={16} aria-hidden="true" />
                    My dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-900"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mb-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-900"
                  >
                    <LogIn size={16} aria-hidden="true" />
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="mb-2 flex items-center gap-2 rounded-md bg-deep-800 px-3 py-2.5 text-sm font-medium text-cream-100 dark:bg-brand-500 dark:text-deep-900"
                  >
                    <UserPlus size={16} aria-hidden="true" />
                    Create account
                  </Link>
                </>
              )}

              <Link
                href="/plan"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-md bg-deep-800 px-3 py-2.5 text-center text-sm font-medium text-cream-100 dark:bg-brand-500 dark:text-brand-900"
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

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-400 text-xs font-semibold text-deep-800"
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}

function UserMenuPanel({
  session,
  onClose,
}: {
  session: NonNullable<SiteChromeSession>;
  onClose: () => void;
}) {
  const home = ROLE_HOME[session.role] ?? "/";

  return (
    <div
      role="menu"
      aria-label="Account"
      className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-deep-200 bg-cream-100 p-1.5 shadow-xl dark:border-deep-800 dark:bg-deep-950"
    >
      <div className="px-3 py-2.5">
        <p className="truncate text-sm font-medium text-deep-800 dark:text-cream-100">
          {session.name}
        </p>
        <p className="truncate text-xs text-deep-500 dark:text-cream-400">
          {session.email}
        </p>
        <p className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
          {ROLE_LABEL[session.role] ?? session.role}
        </p>
      </div>

      <div className="my-1 h-px bg-deep-200 dark:bg-deep-800" />

      <Link
        href={home}
        role="menuitem"
        onClick={onClose}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-cream-200 dark:hover:bg-deep-900"
      >
        <LayoutDashboard size={15} aria-hidden="true" />
        Go to my dashboard
      </Link>

      <button
        type="button"
        role="menuitem"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-deep-700 transition hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-cream-200 dark:hover:bg-deep-900"
      >
        <LogOut size={15} aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
}

function AnonMenuPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="menu"
      aria-label="Account"
      className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-deep-200 bg-cream-100 p-1.5 shadow-xl dark:border-deep-800 dark:bg-deep-950"
    >
      <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-deep-500 dark:text-cream-400">
        Account
      </p>

      <Link
        href="/login"
        role="menuitem"
        onClick={onClose}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-cream-200 dark:hover:bg-deep-900"
      >
        <LogIn size={15} aria-hidden="true" />
        Sign in
      </Link>

      <Link
        href="/signup"
        role="menuitem"
        onClick={onClose}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-brand-300 dark:hover:bg-brand-950/40"
      >
        <UserPlus size={15} aria-hidden="true" />
        Create account
      </Link>
    </div>
  );
}