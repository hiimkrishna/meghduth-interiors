"use client";

import { useEffect, useState } from "react";

import heroSlides from "@/data/heroSlides";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroProgress from "./HeroProgress";

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 9000);

    return () => clearTimeout(timer);
  }, [current]);

  const handleChange = (index) => {
    setCurrent(index);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroBackground slide={heroSlides[current]} />

      <HeroContent slide={heroSlides[current]} />

      <HeroProgress
        slides={heroSlides}
        current={current}
        onChange={handleChange}
      />
    </section>
  );
}
