// app/admin/components/stacked-bar.tsx
"use client";

export type StackedBarRow = {
  label: string;
  segments: { label: string; value: number; tone: string }[];
};

export function StackedBar({ rows }: { rows: StackedBarRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const total = row.segments.reduce((s, seg) => s + seg.value, 0);
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
              <span className="text-deep-600 dark:text-cream-400">
                {row.label}
              </span>
              <span className="text-deep-500 dark:text-cream-500">
                {row.segments
                  .map((s) => `${s.value} ${s.label.toLowerCase()}`)
                  .join(" · ")}
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-deep-800">
              {total === 0 ? null : (
                row.segments.map((seg, i) => (
                  <div
                    key={`${row.label}-${i}`}
                    className={`h-full ${seg.tone}`}
                    style={{ width: `${(seg.value / total) * 100}%` }}
                    title={`${seg.label}: ${seg.value}`}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}