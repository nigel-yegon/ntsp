// app/admin/components/donut.tsx
"use client";

export type DonutSegment = {
  label: string;
  value: number;
  tone: "brand" | "amber" | "emerald" | "rose" | "violet" | "indigo" | "sky";
};

const TONE_STROKE: Record<DonutSegment["tone"], string> = {
  brand: "stroke-brand-500",
  amber: "stroke-amber-500",
  emerald: "stroke-emerald-500",
  rose: "stroke-rose-500",
  violet: "stroke-violet-500",
  indigo: "stroke-indigo-500",
  sky: "stroke-sky-500",
};

const TONE_DOT: Record<DonutSegment["tone"], string> = {
  brand: "bg-brand-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
};

export function Donut({
  segments,
  size = 140,
  strokeWidth = 16,
}: {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width={size} height={size} aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-cream-200 dark:stroke-deep-800"
          />
        </svg>
        <p className="text-xs text-deep-500 dark:text-cream-500">No data</p>
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-cream-200 dark:stroke-deep-800"
        />
        {segments.map((seg) => {
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const offset = circumference - cumulative;
          cumulative += dash;
          return (
            <circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              className={TONE_STROKE[seg.tone]}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>

      <ul className="w-full space-y-1 text-xs">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <li
              key={seg.label}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`inline-block h-2 w-2 rounded-full ${TONE_DOT[seg.tone]}`}
                />
                <span className="text-deep-700 dark:text-cream-300">
                  {seg.label}
                </span>
              </span>
              <span className="font-mono text-deep-800 dark:text-cream-100">
                {seg.value} <span className="text-deep-400 dark:text-cream-600">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}