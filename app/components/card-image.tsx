// app/components/card-image.tsx
"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/image-url";

type Props = {
  name: string;
  imageUrl: string | null | undefined;
  aspect?: "4:3" | "16:9" | "3:2" | "2:1";
  zoomOnHover?: boolean;
};

const ASPECT_CLASSES = {
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "3:2": "aspect-[3/2]",
  "2:1": "aspect-[2/1]",
} as const;

export function CardImage({
  name,
  imageUrl,
  aspect = "4:3",
  zoomOnHover = true,
}: Props) {
  const src = resolveImageUrl(imageUrl);
  const [failed, setFailed] = useState(false);
  const aspectClass = ASPECT_CLASSES[aspect];

  if (!src || failed) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-linear-to-br from-cream-200 via-cream-100 to-brand-100 dark:from-deep-800 dark:via-deep-900 dark:to-deep-950 ${aspectClass}`}
      >
        <span
          className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-brand-400/40 dark:text-brand-500/20"
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-cream-100 dark:bg-deep-950 ${aspectClass}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition duration-300 ${
          zoomOnHover ? "group-hover:scale-105" : ""
        }`}
      />
    </div>
  );
}