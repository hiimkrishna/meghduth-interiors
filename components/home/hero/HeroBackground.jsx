"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { background } from "./heroVariants";

export default function HeroBackground({ slide }) {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={background}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}

      <div className="absolute inset-0 bg-black/45" />

      {/* Left Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
    </>
  );
}
