import { cn } from "@/lib/utils";

const GIRIH_PATH =
  "M 132,66 L 112.669,85.331 L 112.669,112.669 L 85.331,112.669 L 66,132 L 46.669,112.669 L 19.331,112.669 L 19.331,85.331 L 0,66 L 19.331,46.669 L 19.331,19.331 L 46.669,19.331 L 66,0 L 85.331,19.331 L 112.669,19.331 L 112.669,46.669 Z";

const TILE = 132;
const DURATIONS = [13, 17, 19, 23, 29, 31, 37, 41];

// Seeded, so the server and client render the same stars (Math.random here
// used to break hydration on every load).
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const DRIFTERS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 24 }, (_, i) => ({
    x: Math.floor(rand() * 15) * TILE,
    y: Math.floor(rand() * 9) * TILE,
    dur: DURATIONS[i % DURATIONS.length],
    delay: -((i * 4.3) % 24),
    peak: 0.35 + rand() * 0.45,
  }));
})();

const LIGHTS = [
  { x: 132, y: 264, delay: 0 },
  { x: 792, y: 132, delay: -8.5 },
  { x: 1320, y: 528, delay: -12.5 },
];

/**
 * The landing page's girih ground: a faint khatam lattice, a few tiles that
 * drift in and out, and slow-breathing lit stars. Monochrome, masked toward
 * the edges, purely decorative.
 */
export function GirihGround({ className }: { className?: string }) {
  return (
    <div
      className={cn("girih-ground pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" className="absolute inset-0 block">
        <defs>
          <pattern id="girih-ground" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            <path d={GIRIH_PATH} fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
          <radialGradient id="girih-bloom">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.075" />
            <stop offset="45%" stopColor="var(--ink)" stopOpacity="0.02" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-ground)" />

        {DRIFTERS.map((d, i) => (
          <path
            key={i}
            d={GIRIH_PATH}
            transform={`translate(${d.x} ${d.y})`}
            className="girih-drift"
            style={
              {
                "--dur": `${d.dur}s`,
                "--delay": `${d.delay}s`,
                "--peak": d.peak,
              } as React.CSSProperties
            }
          />
        ))}

        {LIGHTS.map((l, i) => (
          <g
            key={i}
            transform={`translate(${l.x} ${l.y})`}
            className="girih-lit"
            style={{ animationDelay: `${l.delay}s` }}
          >
            <circle cx="66" cy="66" r="118.8" fill="url(#girih-bloom)" />
            <path d={GIRIH_PATH} fill="none" strokeWidth="0.9" className="girih-lit-star" />
          </g>
        ))}
      </svg>
      <style>{`
        .girih-ground {
          color: color-mix(in srgb, var(--ink) 3%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.5) 18%, #000 42% 58%, rgba(0,0,0,.5) 82%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.5) 18%, #000 42% 58%, rgba(0,0,0,.5) 82%, transparent 100%);
        }
        .girih-drift {
          fill: none;
          stroke: color-mix(in srgb, var(--ink) 9%, transparent);
          stroke-width: .9px;
          opacity: 0;
          animation: girih-drift var(--dur) var(--ease-state) infinite;
          animation-delay: var(--delay);
        }
        .girih-lit { opacity: 0; animation: girih-breathe 17s var(--ease-state) infinite; }
        .girih-lit-star { stroke: color-mix(in srgb, var(--ink) 30%, transparent); }
        @keyframes girih-drift {
          0%, 3% { opacity: 0; }
          34%, 58% { opacity: var(--peak); }
          97%, 100% { opacity: 0; }
        }
        @keyframes girih-breathe {
          0%, 6% { opacity: 0; }
          22%, 38% { opacity: 1; }
          56%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .girih-lit { opacity: .55; animation: none; }
          .girih-drift { opacity: calc(var(--peak) * .5); animation: none; }
        }
      `}</style>
    </div>
  );
}
