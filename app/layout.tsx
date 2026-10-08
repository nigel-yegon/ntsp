import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SiteChrome } from "./components/site-chrome";
import { AccessibilityProvider } from "./components/accessibility/accessibility-provider";
import AccessibilityToolbar from "./components/accessibility/accessibility-toolbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NTSP — Magical Kenya",
  description: "Discover Kenya's wildlife, beaches, culture, and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <SiteChrome>{children}</SiteChrome>
            <AccessibilityToolbar />
          </AccessibilityProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}