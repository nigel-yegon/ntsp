// app/components/site-chrome-server.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteChrome, type SiteChromeSession } from "./site-chrome";
import type { ReactNode } from "react";

export async function SiteChromeServer({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  const chromeSession: SiteChromeSession = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }
    : null;

  return <SiteChrome session={chromeSession}>{children}</SiteChrome>;
}