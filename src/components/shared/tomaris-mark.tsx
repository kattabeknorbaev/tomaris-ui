import { cn } from "@/lib/utils";

/** The khatam mark as drawn in the tomaris.ai nav. Inherits currentColor. */
export function TomarisMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        d="M36.60,161.02 L58.27,163.53 L64.76,154.61 L98.32,187.98 L115.42,174.43 L113.69,163.53 L161.02,163.40 L163.53,141.73 L154.61,135.24 L187.98,101.68 L174.43,84.58 L163.53,86.31 L163.40,38.98 L141.73,36.47 L135.24,45.39 L101.68,12.02 L84.58,25.57 L86.31,36.47 L38.98,36.60 L36.47,58.27 L45.39,64.76 L12.02,98.32 L25.57,115.42 L36.47,113.69 Z M53.06,132.29 L64.27,130.64 L89.64,156.02 L96.40,146.93 L132.29,146.94 L130.64,135.73 L156.02,110.36 L146.93,103.60 L146.94,67.71 L135.73,69.36 L110.36,43.98 L103.60,53.07 L67.71,53.06 L69.36,64.27 L43.98,89.64 L53.07,96.40 Z"
      />
    </svg>
  );
}

/** Mark + TOMARIS wordmark, the landing page's brand lockup. */
export function TomarisLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <TomarisMark size={20} />
      <span className="t-wordmark" translate="no">
        Tomaris
      </span>
    </span>
  );
}

/**
 * The hero's construction figure: circle, cross, two squares and the two
 * eight-point stars. Static strokes with a very slow turn.
 */
export function GirihFigure({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 560" aria-hidden="true" className={cn("girih-figure overflow-visible", className)}>
      <g fill="none">
        <path className="gf-faint" d="M 67.2,280 A 212.8,212.8 0 1 0 492.8,280 A 212.8,212.8 0 1 0 67.2,280 Z" />
        <path className="gf-faint" d="M 67.2,280 L 492.8,280 M 280,67.2 L 280,492.8" />
        <path className="gf-faint" d="M 430.472,430.472 L 129.528,430.472 L 129.528,129.528 L 430.472,129.528 Z" />
        <path className="gf-faint" d="M 492.8,280 L 280,492.8 L 67.2,280 L 280,67.2 Z" />
        <path
          className="gf-star"
          d="M 492.8,280 L 430.472,342.328 L 430.472,430.472 L 342.328,430.472 L 280,492.8 L 217.672,430.472 L 129.528,430.472 L 129.528,342.328 L 67.2,280 L 129.528,217.672 L 129.528,129.528 L 217.672,129.528 L 280,67.2 L 342.328,129.528 L 430.472,129.528 L 430.472,217.672 Z"
        />
        <path
          className="gf-star"
          d="M 386.4,235.928 L 386.4,173.6 L 324.072,173.6 L 280,129.528 L 235.928,173.6 L 173.6,173.6 L 173.6,235.928 L 129.528,280 L 173.6,324.072 L 173.6,386.4 L 235.928,386.4 L 280,430.472 L 324.072,386.4 L 386.4,386.4 L 386.4,324.072 L 430.472,280 Z"
        />
      </g>
      <style>{`
        .girih-figure { animation: girih-turn 120s linear infinite; transform-origin: 50% 50%; }
        .girih-figure .gf-faint { stroke: color-mix(in srgb, var(--ink) 7%, transparent); stroke-width: .75px; }
        .girih-figure .gf-star { stroke: color-mix(in srgb, var(--ink) 22%, transparent); stroke-width: 1.2px; }
        @keyframes girih-turn { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .girih-figure { animation: none; } }
      `}</style>
    </svg>
  );
}
