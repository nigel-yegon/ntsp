// app/admin/components/overview-charts.tsx
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Palette tokens ────────────────────────────────────────────────
const PALETTE = {
  brand: "#d19f2c",
  brandSoft: "rgba(209, 159, 44, 0.15)",
  amber: "#f59e0b",
  amberSoft: "rgba(245, 158, 11, 0.15)",
  emerald: "#10b981",
  emeraldSoft: "rgba(16, 185, 129, 0.15)",
  rose: "#f43f5e",
  roseSoft: "rgba(244, 63, 94, 0.15)",
  violet: "#8b5cf6",
  violetSoft: "rgba(139, 92, 246, 0.15)",
  indigo: "#6366f1",
  indigoSoft: "rgba(99, 102, 241, 0.15)",
  sky: "#0ea5e9",
  skySoft: "rgba(14, 165, 233, 0.15)",
  deep: "#423e37",
  cream: "#f4f1e2",
} as const;

export type ChartTone = keyof Omit<typeof PALETTE, `${string}Soft`>;

const SOFT: Record<ChartTone, string> = {
  brand: PALETTE.brandSoft,
  amber: PALETTE.amberSoft,
  emerald: PALETTE.emeraldSoft,
  rose: PALETTE.roseSoft,
  violet: PALETTE.violetSoft,
  indigo: PALETTE.indigoSoft,
  sky: PALETTE.skySoft,
  deep: "rgba(66, 62, 55, 0.15)",
  cream: "rgba(244, 241, 226, 0.15)",
};

// ─── Soft tooltip ──────────────────────────────────────────────────

function SoftTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:border-deep-700 dark:bg-deep-900/95">
      {label && (
        <p className="mb-1 font-semibold text-deep-800 dark:text-cream-100">
          {label}
        </p>
      )}
      <ul className="space-y-0.5">
        {payload.map((p, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 text-deep-600 dark:text-cream-400"
          >
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </span>
            <span className="font-mono font-semibold text-deep-800 dark:text-cream-100">
              {p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sparkline ─────────────────────────────────────────────────────

export function Sparkline({
  data,
  tone = "brand",
  height = 40,
}: {
  data: number[];
  tone?: ChartTone;
  height?: number;
}) {
  const chartData = data.map((value, i) => ({ i, value }));
  const id = `spark-${tone}-${data.length}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE[tone]} stopOpacity={0.35} />
            <stop offset="100%" stopColor={PALETTE[tone]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={PALETTE[tone]}
          strokeWidth={2}
          fill={`url(#${id})`}
          isAnimationActive
          animationDuration={600}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Combined line chart ───────────────────────────────────────────

export type CombinedPoint = {
  date: string;
  businesses: number;
  operators: number;
  incidents: number;
  inquiries: number;
};

const COMBINED_SERIES: Array<{
  key: keyof Omit<CombinedPoint, "date">;
  label: string;
  tone: ChartTone;
}> = [
  { key: "businesses", label: "Businesses", tone: "brand" },
  { key: "operators", label: "Operators", tone: "indigo" },
  { key: "incidents", label: "Incidents", tone: "rose" },
  { key: "inquiries", label: "Inquiries", tone: "emerald" },
];

export function CombinedLineChart({ data }: { data: CombinedPoint[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatBucketLabel(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid
          stroke="rgba(163, 149, 148, 0.15)"
          vertical={false}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "rgba(133, 124, 115, 0.8)" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={12}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "rgba(133, 124, 115, 0.8)" }}
          axisLine={false}
          tickLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip content={<SoftTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
        {COMBINED_SERIES.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={PALETTE[s.tone]}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive
            animationDuration={800}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Donut ─────────────────────────────────────────────────────────

export type DonutSegment = { label: string; value: number; tone: ChartTone };

export function Donut({
  segments,
  total,
  centerLabel,
}: {
  segments: DonutSegment[];
  total: number;
  centerLabel?: string;
}) {
  const data = segments.filter((s) => s.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-xs text-deep-500 dark:text-cream-500">
        No data
      </div>
    );
  }

  return (
    <div className="relative h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive
            animationDuration={700}
          >
            {data.map((s, i) => (
              <Cell key={i} fill={PALETTE[s.tone]} />
            ))}
          </Pie>
          <Tooltip content={<SoftTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-deep-800 dark:text-cream-100">
          {total}
        </span>
        {centerLabel && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
            {centerLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Formats a bucket date for the x-axis.
 *   YYYY-MM-DD → "Mar 12"
 *   YYYY-MM    → "Mar"
 */
function formatBucketLabel(iso: string): string {
  try {
    if (iso.length === 7) {
      const [y, m] = iso.split("-");
      const d = new Date(Date.UTC(Number(y), Number(m) - 1, 1));
      return d.toLocaleDateString(undefined, { month: "short" });
    }
    const d = new Date(`${iso}T00:00:00Z`);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}
// app/admin/components/overview-charts.tsx — add this below `Donut`

// Palette dot classes for the side legend. Kept local so the
// component is self-contained and callers don't need to know the
// tone-to-class mapping.
const DOT: Record<ChartTone, string> = {
  brand: "bg-brand-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
  deep: "bg-deep-500",
  cream: "bg-cream-500",
};

/**
 * Donut with the legend rendered to its right. Designed for narrow
 * 1/4-width cards where the vertical stack (donut above legend) would
 * waste horizontal space.
 */
export function DonutWithSideLegend({
  segments,
  total,
  centerLabel,
  size = 140,
}: {
  segments: DonutSegment[];
  total: number;
  centerLabel?: string;
  size?: number;
}) {
  const data = segments.filter((s) => s.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-deep-500 dark:text-cream-500">
        No data
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center gap-4 sm:flex-row sm:items-center">
      {/* Donut */}
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive
              animationDuration={700}
            >
              {data.map((s, i) => (
                <Cell key={i} fill={PALETTE[s.tone]} />
              ))}
            </Pie>
            <Tooltip content={<SoftTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-deep-800 dark:text-cream-100">
            {total}
          </span>
          {centerLabel && (
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-deep-500 dark:text-cream-500">
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <ul className="w-full min-w-0 flex-1 space-y-1 text-xs">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                aria-hidden
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT[s.tone]}`}
              />
              <span className="truncate text-deep-700 dark:text-cream-300">
                {s.label}
              </span>
            </span>
            <span className="shrink-0 font-mono text-deep-800 dark:text-cream-100">
              {s.value}
              <span className="ml-1 text-deep-400 dark:text-cream-600">
                ({total > 0 ? Math.round((s.value / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}