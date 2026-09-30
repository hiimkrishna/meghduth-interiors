import type { Variants } from "framer-motion";

// Check if running in a browser environment to dynamically reduce motion targets for mobile hardware
const isMobile: boolean =
  typeof window !== "undefined" && window.innerWidth < 768;

export const container: Variants = {
  hidden: {},
  show: {
    transition: {
      // Slightly reduced delay on mobile for a snappier, more responsive initial layout render
      staggerChildren: isMobile ? 0.15 : 0.22,
    },
  },
};

export const item: Variants = {
  // দিক-সচেতন প্রবেশ — custom-এ direction (+1/-1) আসে: যেদিকে যাও, কনটেন্ট সেদিক থেকে আসে।
  hidden: (direction: number = 0) => ({
    opacity: 0,
    // Mobile Optimization: Reduced vertical travel (15px vs 30px) to prevent layout thrashing on small viewports
    y: isMobile ? 15 : 30,
    x: direction === 0 ? 0 : direction * 36,
  }),
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: isMobile ? 0.5 : 0.8,
      ease: [0.25, 1, 0.5, 1], // Upgraded to a custom premium cubic-bezier for smoother rendering profiles
    },
  },
};

export const background: Variants = {
  initial: {
    opacity: 0,
    scale: 1,
  },
  animate: {
    opacity: 1,
    // Mobile Optimization: Subtly scale down the zoom effect (1.02 vs 1.05) to keep the GPU frame rate perfectly fluid at 60fps
    scale: isMobile ? 1.02 : 1.05,
    transition: {
      opacity: {
        duration: isMobile ? 1.5 : 2.5, // Faster crossfade response target for quick touch-swipes
      },
      scale: {
        duration: 9,
        ease: "linear",
      },
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: isMobile ? 1.2 : 2.5,
    },
  },
};
