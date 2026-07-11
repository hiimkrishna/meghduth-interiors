"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { background } from "./heroVariants";

export default function HeroBackground({ slide }) {
  if (!slide) return null;

  return (
    <>
      {/* Container wraps the animated items to enforce absolute stacking */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide.id}
            variants={background}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={slide.image}
              alt={slide.title || "Design background"}
              fill
              priority
              // Mobile Optimization: Downserves images precisely based on device width
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              quality={75}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlays merged into a single layer for GPU rendering optimization */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/45 bg-gradient-to-r from-black/60 via-black/20 to-transparent mix-blend-multiply" />
    </>
  );
}
