"use client";

import { motion } from "framer-motion";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import { container, item } from "./heroVariants";

export default function HeroContent({ slide }) {
  return (
    <Container className="relative z-20 flex min-h-screen items-center">
      <motion.div
        key={slide.id}
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl"
      >
        <motion.span
          variants={item}
          className="inline-block rounded-full border border-[#B79A6A]/30 bg-[#B79A6A]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#B79A6A]"
        >
          {slide.badge}
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-8 text-5xl font-semibold leading-[1.05] text-white md:text-7xl xl:text-8xl"
        >
          {slide.title}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-lg leading-8 text-zinc-300"
        >
          {slide.description}
        </motion.p>

        <motion.div variants={item} className="mt-12 flex flex-wrap gap-5">
          <Button href="/projects">View Projects</Button>

          <Button href="/contact" variant="secondary">
            Free Consultation
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}
