import type { TargetAndTransition } from "framer-motion";
import type { CardPosition } from "./helpers";

export const CARD_POSITIONS: Record<CardPosition, TargetAndTransition> = {
  left: {
    x: "-70%",
    rotate: -8,
    scale: 0.8,
    opacity: 0.35,
    zIndex: 10,
    filter: "blur(1px)",
  },

  center: {
    x: "0%",
    rotate: 0,
    scale: 1,
    opacity: 1,
    zIndex: 30,
    filter: "blur(0px)",
  },

  right: {
    x: "70%",
    rotate: 8,
    scale: 0.8,
    opacity: 0.35,
    zIndex: 10,
    filter: "blur(1px)",
  },

  hidden: {
    x: "0%",
    rotate: 0,
    scale: 0.7,
    opacity: 0,
    zIndex: 0,
    filter: "blur(4px)",
  },
};

export const CARD_TRANSITION: {
  duration: number;
  ease: [number, number, number, number];
} = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

export const AUTOPLAY_TIME = 5000;
