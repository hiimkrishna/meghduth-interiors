"use client";

import { motion } from "framer-motion";

export default function HeroProgress({ slides, current, onChange }) {
  return (
    <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 gap-3">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => onChange(index)}
          className="relative h-[3px] w-16 overflow-hidden rounded-full bg-white/20"
        >
          {current === index && (
            <motion.div
              key={current}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 9,
                ease: "linear",
              }}
              className="absolute left-0 top-0 h-full bg-[#B79A6A]"
            />
          )}
        </button>
      ))}
    </div>
  );
}
