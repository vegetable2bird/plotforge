import type { Transition } from "framer-motion";

// ===== Silky Smooth Animation Presets =====

// Primary entrance: slight overshoot for satisfying "snap" feel
export const smoothEntrance: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

// Secondary transition: professional ease curve
export const smoothEase: Transition = {
  duration: 0.45,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

// Quick interaction: snappy but not abrupt
export const smoothQuick: Transition = {
  duration: 0.3,
  ease: [0.34, 1.56, 0.64, 1] as const,
};

// Fade in from bottom
export const fadeUp = (delay = 0): Transition => ({
  opacity: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  y: { type: "spring", stiffness: 300, damping: 25, mass: 0.7 },
  delay,
});

// Fade in with scale
export const fadeScale = (delay = 0): Transition => ({
  opacity: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  scale: { type: "spring", stiffness: 350, damping: 22, mass: 0.6 },
  delay,
});

// Height expand/collapse
export const expandHeight: Transition = {
  opacity: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  height: { type: "spring", stiffness: 280, damping: 24, mass: 0.9 },
};

// Width animation (progress bars)
export const growWidth = (delay = 0): Transition => ({
  width: { type: "spring", stiffness: 200, damping: 20, mass: 1.2 },
  delay,
});

// Stagger children delay
export const staggerDelay = (index: number, base = 0.06): number => index * base;

// Page entrance variants
export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: fadeUp(i),
  }),
};

// Card variants
export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: fadeUp(staggerDelay(i)),
  }),
  hover: {
    y: -6,
    transition: smoothQuick,
  },
};

// Panel slide variants
export const panelVariants = {
  hidden: { opacity: 0, x: -280 },
  visible: { opacity: 1, x: 0, transition: smoothEase },
  exit: { opacity: 0, x: -280, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};
