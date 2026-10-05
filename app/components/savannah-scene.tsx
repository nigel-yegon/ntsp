"use client";

export function SavannahScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* ═══════════════════════════════════════════════════════
            DEFS
            ═══════════════════════════════════════════════════════ */}
        <defs>
          {/* Sky — sunset gradient from cool top through amber to deep orange */}
          <linearGradient id="sav-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--cream-200)"  stopOpacity="0.15" />
            <stop offset="40%"  stopColor="var(--brand-100)"  stopOpacity="0.4" />
            <stop offset="72%"  stopColor="var(--brand-200)"  stopOpacity="0.75" />
            <stop offset="90%"  stopColor="#e8a24c"           stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97a2b"           stopOpacity="0.95" />
          </linearGradient>

          {/* The sun — a bright disc just above the horizon */}
          <radialGradient id="sav-sun" cx="0.72" cy="0.62" r="0.16">
            <stop offset="0%"   stopColor="#fff3c4" stopOpacity="1" />
            <stop offset="40%"  stopColor="#ffcb63" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f4a13a" stopOpacity="0" />
          </radialGradient>

          {/* Big warm glow surrounding the sun */}
          <radialGradient id="sav-sun-glow" cx="0.72" cy="0.62" r="0.45">
            <stop offset="0%"   stopColor="#f7b860" stopOpacity="0.5" />
            <stop offset="55%"  stopColor="#e8a24c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d97a2b" stopOpacity="0" />
          </radialGradient>

          {/* Ground — dry ochre fading to deep shadow at the bottom */}
          <linearGradient id="sav-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--brand-400)" stopOpacity="0.35" />
            <stop offset="30%"  stopColor="var(--brand-500)" stopOpacity="0.55" />
            <stop offset="70%"  stopColor="var(--brand-600)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--deep-800)"  stopOpacity="0.9" />
          </linearGradient>

          {/* Warm horizon haze */}
          <linearGradient id="sav-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f7d49a" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#f7d49a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f7d49a" stopOpacity="0" />
          </linearGradient>

          {/* Grass gradients — three depths for perspective */}
          <linearGradient id="grass-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--brand-500)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="grass-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--brand-600)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--brand-700)" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="grass-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--brand-700)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--deep-800)"  stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* ═══════════════════════════════════════════════════════
            SKY & SUN
            ═══════════════════════════════════════════════════════ */}
        <rect x="0" y="0" width="1440" height="600" fill="url(#sav-sky)" />
        <rect x="0" y="0" width="1440" height="600" fill="url(#sav-sun-glow)" />

        {/* Sun disc — partially dipped at the horizon line */}
        <circle cx="1036" cy="372" r="48" fill="url(#sav-sun)" />
        <circle cx="1036" cy="372" r="20" fill="#fff3c4" opacity="0.75" />

        {/* Soft cloud bands — long horizontal streaks near the sun */}
        <g className="fill-brand-200/40">
          <ellipse cx="1040" cy="320" rx="220" ry="6" />
          <ellipse cx="980"  cy="344" rx="160" ry="4" />
          <ellipse cx="1120" cy="300" rx="120" ry="4" />
        </g>
        <g className="fill-cream-100/30">
          <ellipse cx="900"  cy="332" rx="90" ry="3" />
          <ellipse cx="1180" cy="352" rx="110" ry="4" />
        </g>

        {/* ═══════════════════════════════════════════════════════
            HORIZON BANDS — three tiers of distant land
            ═══════════════════════════════════════════════════════ */}
        {/* Farthest ridge — barely there */}
        <path
          d="M0,362 C180,358 320,354 500,357 C680,360 820,362 1000,358 C1180,354 1320,360 1440,355 L1440,375 L0,375 Z"
          className="fill-brand-400/25"
        />
        {/* Mid ridge */}
        <path
          d="M0,372 C240,366 420,372 620,368 C820,364 1000,372 1200,368 C1320,364 1380,370 1440,366 L1440,390 L0,390 Z"
          className="fill-brand-500/30"
        />

        {/* ═══════════════════════════════════════════════════════
            DISTANT ANIMALS — tiny silhouettes on the horizon
            ═══════════════════════════════════════════════════════ */}
        <g className="fill-deep-800/70 dark:fill-deep-200/50">
          {/* Elephant herd — left side */}
          <Elephant x={280} y={370} scale={0.34} />
          <Elephant x={320} y={372} scale={0.30} />
          <Elephant x={356} y={369} scale={0.36} />
          <Elephant x={400} y={373} scale={0.28} />

          {/* Giraffes — right of center, near the sun */}
          <Giraffe x={620} y={372} scale={0.42} />
          <Giraffe x={660} y={373} scale={0.38} />

          {/* Lone elephant on the far right */}
          <Elephant x={900} y={371} scale={0.32} />
        </g>

        {/* ═══════════════════════════════════════════════════════
            THE FIELD
            ═══════════════════════════════════════════════════════ */}
        <rect x="0" y="380" width="1440" height="220" fill="url(#sav-ground)" />

        {/* ─── FAR GRASS — dense, short, faint ──────────────── */}
        <g
          className="grass-far"
          stroke="url(#grass-far)"
          strokeLinecap="round"
          fill="none"
        >
          {Array.from({ length: 260 }).map((_, i) => {
            const x = (i * 5.6 + ((i * 37) % 11)) % 1440;
            const baseY = 398 + ((i * 53) % 90);
            const h = 5 + ((i * 13) % 7);
            const lean = ((i % 5) - 2) * 1.6;
            return (
              <path
                key={i}
                d={`M ${x},${baseY} Q ${x + lean / 2},${baseY - h / 2} ${x + lean},${baseY - h}`}
                strokeWidth={0.8}
                opacity={0.3 + (baseY - 398) / 260}
              />
            );
          })}
        </g>

        {/* ─── MID GRASS — mid-height, moderate opacity ────── */}
        <g
          className="grass-mid"
          stroke="url(#grass-mid)"
          strokeLinecap="round"
          fill="none"
        >
          {Array.from({ length: 200 }).map((_, i) => {
            const x = (i * 7.2 + ((i * 41) % 15)) % 1440;
            const baseY = 430 + ((i * 47) % 110);
            const h = 12 + ((i * 11) % 14);
            const lean = ((i % 7) - 3) * 2.6;
            return (
              <path
                key={i}
                d={`M ${x},${baseY} Q ${x + lean / 2},${baseY - h * 0.6} ${x + lean},${baseY - h}`}
                strokeWidth={1.1}
                opacity={0.4 + (baseY - 430) / 280}
              />
            );
          })}
        </g>

        {/* ─── NEAR GRASS — tall, wavy, dark ────────────────── */}
        {/* Wrapped in a sway group; individual blades have a subtle
            per-index phase so they don't all lean the same way. */}
        <g className="grass-sway" style={{ transformOrigin: "50% 100%" }}>
          <g
            stroke="url(#grass-near)"
            strokeLinecap="round"
            fill="none"
          >
            {Array.from({ length: 140 }).map((_, i) => {
              const x = (i * 10.4 + ((i * 29) % 17)) % 1440;
              const baseY = 480 + ((i * 41) % 120);
              const h = 26 + ((i * 19) % 32);
              // Wider lean so the field reads as wind-blown
              const lean = ((i % 9) - 4) * 5;
              // Secondary curve control for a natural arc
              const c1x = x + lean * 0.25;
              const c1y = baseY - h * 0.5;
              const c2x = x + lean * 0.75;
              const c2y = baseY - h * 0.85;
              const endX = x + lean;
              const endY = baseY - h;
              return (
                <path
                  key={i}
                  d={`M ${x},${baseY} C ${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`}
                  strokeWidth={1.4 + ((i % 4) * 0.25)}
                  opacity={0.55 + ((baseY - 480) / 320)}
                />
              );
            })}
          </g>
        </g>

        {/* ─── Extra foreground blades — closest, tallest ───── */}
        <g className="grass-sway-alt" style={{ transformOrigin: "50% 100%" }}>
          <g
            className="text-deep-900/70 dark:text-deep-950/70"
            stroke="currentColor"
            strokeLinecap="round"
            fill="none"
          >
            {Array.from({ length: 60 }).map((_, i) => {
              const x = (i * 24 + ((i * 13) % 22)) % 1440;
              const baseY = 560 + ((i * 37) % 60);
              const h = 40 + ((i * 23) % 40);
              const lean = ((i % 5) - 2) * 8;
              return (
                <path
                  key={i}
                  d={`M ${x},${baseY} C ${x + lean * 0.3},${baseY - h * 0.5} ${x + lean * 0.7},${baseY - h * 0.8} ${x + lean},${baseY - h}`}
                  strokeWidth={2}
                  opacity={0.7}
                />
              );
            })}
          </g>
        </g>

        {/* ═══════════════════════════════════════════════════════
            ACACIA TREES — three depth tiers
            ═══════════════════════════════════════════════════════ */}
        {/* Far cluster — silhouettes against the sky */}
        <g className="text-deep-700/50 dark:text-deep-300/40" fill="currentColor">
          <Acacia x={200} y={372} scale={0.32} />
          <Acacia x={480} y={370} scale={0.30} />
          <Acacia x={880} y={373} scale={0.34} />
          <Acacia x={1200} y={371} scale={0.31} />
        </g>

        {/* Mid row */}
        <g className="text-deep-800/70 dark:text-deep-200/50" fill="currentColor">
          <Acacia x={140} y={410} scale={0.6} />
          <Acacia x={720} y={402} scale={0.55} />
          <Acacia x={1240} y={414} scale={0.65} />
        </g>

        {/* Near trees — the two that frame the composition */}
        <g className="text-deep-900/85 dark:text-cream-400/30" fill="currentColor">
          <Acacia x={80} y={480} scale={1.05} />
          <Acacia x={1380} y={510} scale={1.25} />
        </g>

        {/* ═══════════════════════════════════════════════════════
            HEAT HAZE — soft wash over the horizon
            ═══════════════════════════════════════════════════════ */}
        <rect
          x="0"
          y="345"
          width="1440"
          height="65"
          fill="url(#sav-haze)"
          className="dark:opacity-40"
        />
      </svg>
    </div>
  );
}

/* ─── Acacia tree ───────────────────────────────────────────── */
function Acacia({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0,0 L-2,-32 L-4,-60 L-3,-80 L3,-80 L2,-60 L4,-32 Z" />
      <path d="M-2,-62 Q-28,-74 -52,-72 L-46,-78 Q-24,-82 -2,-76 Z" />
      <path d="M2,-62 Q28,-74 52,-72 L46,-78 Q24,-82 2,-76 Z" />
      <path d="M-3,-70 Q-20,-88 -34,-94 L-28,-99 Q-12,-93 -1,-82 Z" />
      <path d="M3,-70 Q20,-88 34,-94 L28,-99 Q12,-93 1,-82 Z" />
      <path d="M-6,-78 Q0,-100 6,-78 L12,-84 Q0,-104 -12,-84 Z" />
      <ellipse cx="0" cy="-92"  rx="58" ry="12" />
      <ellipse cx="0" cy="-100" rx="40" ry="9" />
      <ellipse cx="0" cy="-108" rx="22" ry="6" />
      <ellipse cx="-48" cy="-90" rx="8" ry="4" />
      <ellipse cx="48"  cy="-90" rx="8" ry="4" />
    </g>
  );
}

/* ─── Elephant silhouette ───────────────────────────────────── */
function Elephant({ x, y, scale }: { x: number; y: number; scale: number }) {
  // Body + head + trunk + legs + ear, all in a single fill path
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Body */}
      <path d="M-16,0 Q-18,-8 -12,-12 Q-4,-14 4,-12 Q10,-11 10,-6 L10,0 L6,0 L6,-4 L2,-4 L2,0 L-2,0 L-2,-4 L-6,-4 L-6,0 Z" />
      {/* Head */}
      <path d="M10,-11 Q16,-12 18,-9 Q19,-6 16,-4 L14,-4 Q14,-8 10,-9 Z" />
      {/* Trunk — curved down */}
      <path d="M16,-4 Q18,-2 17,2 Q16,5 14,6 L13,5 Q15,3 15,1 Q14,-1 14,-3 Z" />
      {/* Ear */}
      <path d="M8,-11 Q10,-9 9,-6 L7,-7 Q8,-8 8,-10 Z" opacity="0.85" />
      {/* Tail */}
      <path d="M-16,-8 Q-17,-5 -16,-2" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  );
}

/* ─── Giraffe silhouette ────────────────────────────────────── */
function Giraffe({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Long neck + head */}
      <path d="M4,-30 L8,-30 L8,-6 Q8,-2 6,0 L2,0 Q2,-4 3,-6 Z" />
      {/* Head */}
      <path d="M8,-30 L12,-29 L13,-27 L11,-26 L8,-27 Z" />
      {/* Ossicones (horns) */}
      <path d="M9,-30 L8.5,-33 M11,-30 L10.5,-33" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Body */}
      <path d="M2,-6 Q-4,-6 -6,-4 Q-8,-2 -6,0 L2,0 Z" />
      {/* Legs */}
      <rect x="2" y="0" width="1.5" height="8" />
      <rect x="4.5" y="0" width="1.5" height="8" />
      <rect x="-5" y="0" width="1.5" height="8" />
      <rect x="-3" y="0" width="1.5" height="8" />
      {/* Tail */}
      <path d="M-6,-5 Q-8,-3 -8,0" fill="none" stroke="currentColor" strokeWidth="0.6" />
    </g>
  );
}