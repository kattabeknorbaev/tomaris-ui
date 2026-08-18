"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const GIRIH_PATH =
  "M 132,66 L 112.669,85.331 L 112.669,112.669 L 85.331,112.669 L 66,132 L 46.669,112.669 L 19.331,112.669 L 19.331,85.331 L 0,66 L 19.331,46.669 L 19.331,19.331 L 46.669,19.331 L 66,0 L 85.331,19.331 L 112.669,19.331 L 112.669,46.669 Z";

export function GirihGround({ className }: { className?: string }) {
  // Generate random drifting stars
  const drifters = useMemo(() => {
    const items = [];
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        x: Math.floor(Math.random() * 15) * 132,
        y: Math.floor(Math.random() * 50) * 132,
        dur: 15 + Math.random() * 30,
        delay: -(Math.random() * 30),
        peak: 0.02 + Math.random() * 0.03,
      });
    }
    return items;
  }, []);

  // Generate glowing lit areas
  const lights = useMemo(() => {
    return [
      { id: 1, x: 132, y: 264, delay: 0 },
      { id: 2, x: 792, y: 132, delay: -8.5 },
      { id: 3, x: 528, y: 528, delay: -12.5 },
    ];
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-background pointer-events-none text-[rgba(255,255,255,0.06)] dark:text-[rgba(255,255,255,0.04)]",
        className
      )}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="girih-ground"
            width="132"
            height="132"
            patternUnits="userSpaceOnUse"
          >
            <path
              d={GIRIH_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
            />
          </pattern>
          <radialGradient id="girih-bloom">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-ground)" />

        {drifters.map((d) => (
          <path
            key={d.id}
            d={GIRIH_PATH}
            transform={`translate(${d.x} ${d.y})`}
            fill="currentColor"
            style={{
              opacity: d.peak,
              animation: `pulse-drifter ${d.dur}s linear infinite`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}

        {lights.map((l) => (
          <g
            key={l.id}
            transform={`translate(${l.x} ${l.y})`}
            style={{
              animation: `pulse-light 15s ease-in-out infinite`,
              animationDelay: `${l.delay}s`,
            }}
          >
            <circle cx="66" cy="66" r="150" fill="url(#girih-bloom)" />
            <path
              d={GIRIH_PATH}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          </g>
        ))}
      </svg>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-drifter {
          0%, 100% { opacity: 0; }
          50% { opacity: var(--peak, 0.05); }
        }
        @keyframes pulse-light {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}} />
    </div>
  );
}
