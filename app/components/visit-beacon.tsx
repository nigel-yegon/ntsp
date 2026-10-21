// app/components/visit-beacon.tsx
"use client";

import { useEffect } from "react";

/**
 * One-shot visitor beacon. Fires on the first mount per session
 * (deduped via sessionStorage), so refreshes don't inflate the
 * count. Mount it inside app/layout.tsx.
 */
export function VisitBeacon() {
  useEffect(() => {
    if (sessionStorage.getItem("ntsp:visited")) return;
    sessionStorage.setItem("ntsp:visited", "1");
    fetch("/api/visit", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}