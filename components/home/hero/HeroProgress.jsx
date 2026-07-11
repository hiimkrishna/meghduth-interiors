"use client";

import { motion } from "framer-motion";

export default function HeroProgress({ slides = [], current, onChange }) {
  if (!slides.length) return null;

  return (
    <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:gap-3 w-full max-w-[90%] sm:max-w-none justify-center px-4">
      {slides.map((slide, index) => {
        const isActive = current === index;

        return (
          <button
            key={slide.id}
            onClick={() => onChange(index)}
            type="button"
            // Mobile Optimization: Expanded interactive padding (py-3) creates a comfortable 27px+ tap zone while keeping the visual line slim
            className="group relative py-3 flex items-center focus:outline-none"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? "true" : "false"}
          >
            {/* The actual visible track line */}
            <div
              className={`relative h-[3px] rounded-full overflow-hidden transition-all duration-300 bg-white/20
                ${isActive ? "w-12 sm:w-16" : "w-6 sm:w-12 group-hover:bg-white/40"}`}
            >
              {isActive && (
                <motion.div
                  key={current}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 9,
                    ease: "linear",
                  }}
                  className="absolute left-0 top-0 h-full bg-[#B79A6A] will-change-[width]"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
