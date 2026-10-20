// app/components/navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  FileText,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import type { SiteChromeSession } from "./site-chrome";

// ─── Navigation structure ───────────────────────────────────
const destinationsSub = [
  { href: "/experiences", label: "Experiences" },
  { href: "/packages", label: "Packages" },
  { href: "/stay", label: "Stays" },
] as const;

const aboutSub = [
  { href: "/about/government-agencies", label: "Government Agencies" },
  { href: "/about/resources", label: "Resources" },
  { href: "/blog", label: "Travel Blog" },
  { href: "/contact", label: "Contact Us" },
] as const;

const investmentSub = [
  { href: "/investment/opportunities", label: "Opportunities" },
  { href: "/investment/inquiry", label: "Investor inquiry" },
] as const;

const safetySub = [
  { href: "/report-an-incident", label: "Report an incident" },
] as const;

const links = [
  { href: "/destinations", label: "Destinations", dropdown: destinationsSub },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About", dropdown: aboutSub },
  { href: "/investment", label: "Investment", dropdown: investmentSub },
  { href: "/events", label: "Events" },
  { href: "/safety", label: "Safety", dropdown: safetySub },
] as const;

const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  CUSTOMER: "/dashboard",
  BUSINESS: "/dashboard",
  OPERATOR: "/dashboard",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
};

const ROLE_LABEL: Record<string, string> = {
  EMPLOYER: "Employer",
  CUSTOMER: "Traveller",
  BUSINESS: "Business",
  OPERATOR: "Tour Operator",
  VERIFIER: "Verifier",
  COMMITTEE_MEMBER: "Committee",
  PERMANENT_SECRETARY: "Permanent Secretary",
  ADMIN: "Administrator",
};

const APPLICATIONS_ROLES = new Set([
  "PERMANENT_SECRETARY",
  "COMMITTEE_MEMBER",
  "VERIFIER",
]);

// ─── Scroll direction hook (inlined) ────────────────────────
function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (Math.abs(delta) < threshold) return;

      setDirection(delta > 0 ? "down" : "up");
      setScrolled(y > threshold);
      lastY.current = y;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, scrolled };
}

// ─── Navbar ─────────────────────────────────────────────────
export function Navbar({
  static: isStatic = false,
  session,
}: {
  static?: boolean;
  session: SiteChromeSession;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<null | "user" | "anon">(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { direction, scrolled } = useScrollDirection(8);

  const isDashboard =
    isStatic ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/services/applications");

  // Close all menus on route change
  useEffect(() => {
    setOpen(false);
    setMenuOpen(null);
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdowns/menus when the header hides on scroll-down
  useEffect(() => {
    if (direction === "down" && scrolled && !isDashboard) {
      setOpenDropdown(null);
      setMenuOpen(null);
    }
  }, [direction, scrolled, isDashboard]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close user/anon dropdown on outside click and Escape
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

  // Close top-level dropdown on outside click and Escape
  useEffect(() => {
    if (!openDropdown) return;

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown-root]")) {
        setOpenDropdown(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Hide the header only on non-dashboard pages when scrolling down
  const hideHeader = !isDashboard && direction === "down" && scrolled;

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 border-b",
          "transition-[transform,background-color,border-color] duration-200",
          hideHeader ? "-translate-y-full" : "translate-y-0",
          scrolled
            ? "border-deep-200 bg-cream-100/95 backdrop-blur-md dark:border-deep-800 dark:bg-deep-950/95"
            : "border-deep-200 bg-cream-100/70 backdrop-blur-sm dark:bg-deep-950/70",
        ].join(" ")}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
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
              const hasDropdown = "dropdown" in l && l.dropdown;
              const dropdownActive =
                hasDropdown &&
                l.dropdown.some((sub: { href: string }) => isActive(sub.href));
              const active = isActive(l.href) || dropdownActive;

              if (!hasDropdown) {
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
              }

              const isOpen = openDropdown === l.href;
              return (
                <li key={l.href} className="relative" data-dropdown-root>
                  <div
                    className={`flex items-center rounded-md transition-colors ${
                      active || isOpen
                        ? "text-brand-600 dark:text-brand-300"
                        : "text-deep-700 hover:text-deep-900 dark:text-cream-300 dark:hover:text-cream-100"
                    }`}
                  >
                    <Link
                      href={l.href}
                      className="relative rounded-l-md px-3 py-2 text-sm font-medium"
                    >
                      {l.label}
                      {active && (
                        <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((v) => (v === l.href ? null : l.href))
                      }
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      aria-label={`Open ${l.label.toLowerCase()} menu`}
                      className="rounded-r-md py-2 pl-1 pr-2.5"
                    >
                      <ChevronDown
                        size={14}
                        aria-hidden
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      role="menu"
                      aria-label={l.label}
                      className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-deep-200 bg-cream-100 p-1.5 shadow-xl dark:border-deep-800 dark:bg-deep-950"
                    >
                      {l.dropdown.map(
                        (sub: { href: string; label: string }) => {
                          const subActive = isActive(sub.href);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-center rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                                subActive
                                  ? "bg-brand-100 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
                                  : "text-deep-700 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-deep-900"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        }
                      )}
                      <div className="my-1 h-px bg-deep-200 dark:bg-deep-800" />
                      <Link
                        href={l.href}
                        role="menuitem"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-brand-300 dark:hover:bg-brand-950/40"
                      >
                        + {l.label.toLowerCase()}
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

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

      {/* Mobile menu — unchanged */}
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
                const hasDropdown = "dropdown" in l && l.dropdown;
                const dropdownActive =
                  hasDropdown &&
                  l.dropdown.some((sub: { href: string }) =>
                    isActive(sub.href)
                  );
                const active = isActive(l.href) || dropdownActive;

                if (!hasDropdown) {
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
                }

                return (
                  <li key={l.href} className="mt-1">
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
                    <ul className="ml-3 mt-1 space-y-0.5 border-l border-deep-200 pl-3 dark:border-deep-800">
                      {l.dropdown.map(
                        (sub: { href: string; label: string }) => {
                          const subActive = isActive(sub.href);
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={() => setOpen(false)}
                                className={`block rounded-md px-3 py-2 text-sm transition ${
                                  subActive
                                    ? "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                                    : "text-deep-600 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-900"
                                }`}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          );
                        }
                      )}
                    </ul>
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

                  {APPLICATIONS_ROLES.has(session.role) && (
                    <Link
                      href="/services/applications"
                      onClick={() => setOpen(false)}
                      className="mb-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-deep-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-deep-900"
                    >
                      <FileText size={16} aria-hidden="true" />
                      Applications
                    </Link>
                  )}

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
  const canViewApplications = APPLICATIONS_ROLES.has(session.role);

  const applicationsLabel =
    session.role === "COMMITTEE_MEMBER"
      ? "Committee reviews"
      : session.role === "PERMANENT_SECRETARY"
        ? "PS reviews"
        : session.role === "VERIFIER"
          ? "Verification queue"
          : "Permit applications";

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

      {canViewApplications && (
        <Link
          href="/services/applications"
          role="menuitem"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-deep-700 transition hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:text-cream-200 dark:hover:bg-deep-900"
        >
          <FileText size={15} aria-hidden="true" />
          {applicationsLabel}
        </Link>
      )}

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