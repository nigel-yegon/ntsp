"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

  return (
    <>
      <Navbar {...({ static: isAdmin } as any)} />

      <main
        data-nav-offset
        className={`flex-1 ${isAdmin ? "" : "pt-0"}`}
      >
        {children}
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}