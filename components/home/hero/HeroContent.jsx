"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { container, item } from "./heroVariants";

export default function HeroContent({ slide }) {
  if (!slide) return null;

  return (
    // Changed min-h-screen to pull from dynamic viewport height calculations if passed, and fixed mobile padding
    <Container className="relative z-20 flex min-h-[100dvh] items-center pt-24 pb-16 md:pt-0 md:pb-0">
      <motion.div
        key={slide.id}
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl w-full"
      >
        {/* Mobile-Friendly Badge: Responsive text tracking and sizing */}
        <motion.span
          variants={item}
          className="inline-block rounded-full border border-[#B79A6A]/30 bg-[#B79A6A]/10 px-3 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#B79A6A] select-none"
        >
          {slide.badge}
        </motion.span>

        {/* Scaled-down mobile typography to prevent screen spillover */}
        <motion.h1
          variants={item}
          className="mt-4 sm:mt-6 text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-semibold leading-[1.1] tracking-tight text-white balance-text"
        >
          {slide.title}
        </motion.h1>

        {/* Relaxed but compact descriptions for mobile reading */}
        <motion.p
          variants={item}
          className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300"
        >
          {slide.description}
        </motion.p>

        {/* Stacked button layout on small mobile screen widths */}
        <motion.div
          variants={item}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto"
        >
          <Button
            href="/projects"
            className="w-full sm:w-auto text-center justify-center"
          >
            View Projects
          </Button>

          <Button
            href="/contact"
            variant="secondary"
            className="w-full sm:w-auto text-center justify-center"
          >
            Free Consultation
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}
