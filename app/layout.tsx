// app/layout.tsx
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { SiteChromeServer as SiteChrome } from "./components/site-chrome-server";
import { AccessibilityProvider } from "./components/accessibility/accessibility-provider";
import AccessibilityToolbar from "./components/accessibility/accessibility-toolbar";
import { AppSessionProvider } from "./components/session-provider";
import { CookieConsent } from "./components/cookie-consent";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { VisitBeacon } from "./components/visit-beacon";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NTSP — Magical Kenya",
  description: "Discover Kenya's wildlife, beaches, culture, and beyond.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
        suppressHydrationWarning
      >
        <AppSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AccessibilityProvider>
              <SiteChrome>{children}</SiteChrome>
              {modal}
              <AccessibilityToolbar />
              <CookieConsent />
            </AccessibilityProvider>
          </ThemeProvider>
        </AppSessionProvider>
        <Analytics />
        <ScrollToTop />
        <VisitBeacon />
      </body>
    </html>
  );
}