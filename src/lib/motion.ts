import type { Variants } from "framer-motion";

/** DESIGN.md easing — smooth, not bouncy. */
export const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Shared entrance animation. Pass an index via `custom` to stagger.
 * Stays within DESIGN.md limits: ≤16px slide, ≤300ms duration.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: EASE },
  }),
};
