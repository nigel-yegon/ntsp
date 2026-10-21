// app/admin/components/sparkline.tsx
"use client";

export type SparklineProps = {
  values: number[];
  tone?: "brand" | "amber" | "emerald" | "rose" | "violet" | "indigo" | "sky";
  width?: number;
  height?: number;
  strokeWidth?: number;
};

const TONE_STROKE: Record<NonNullable<SparklineProps["tone"]>, string> = {
  brand: "stroke-brand-500",
  amber: "stroke-amber-500",
  emerald: "stroke-emerald-500",
  rose: "stroke-rose-500",
  violet: "stroke-violet-500",
  indigo: "stroke-indigo-500",
  sky: "stroke-sky-500",
};

const TONE_FILL: Record<NonNullable<SparklineProps["tone"]>, string> = {
  brand: "fill-brand-500/10",
  amber: "fill-amber-500/10",
  emerald: "fill-emerald-500/10",
  rose: "fill-rose-500/10",
  violet: "fill-violet-500/10",
  indigo: "fill-indigo-500/10",
  sky: "fill-sky-500/10",
};

export function Sparkline({
  values,
  tone = "brand",
  width = 120,
  height = 32,
  strokeWidth = 1.5,
}: SparklineProps) {
  if (values.length === 0) return null;

  // Normalise to 0..1, with a small headroom so peaks don't clip.
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const padY = 3;
  const stepX = width / Math.max(values.length - 1, 1);

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - padY - ((v - min) / range) * (height - padY * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");

  const areaPath =
    linePath +
    ` L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      role="img"
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <path d={areaPath} className={TONE_FILL[tone]} />
      <path
        d={linePath}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={TONE_STROKE[tone]}
      />
    </svg>
  );
}