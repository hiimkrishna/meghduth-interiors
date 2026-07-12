"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import heroSlides from "@/data/heroSlides";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroProgress from "./HeroProgress";

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // 🛠️ FIX 1: Track client-side mounting cycle to bypass server height mismatch conflicts
  const [mounted, setMounted] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Memoize handleChange to prevent unnecessary sub-component rerenders
  const handleChange = useCallback((index) => {
    setCurrent(index);
  }, []);

  // Handle slide transitions automatically
  useEffect(() => {
    if (!heroSlides.length) return;

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 9000);

    return () => clearTimeout(timer);
  }, [current]);

  // Mobile Optimization: Fix real mobile layout issues by using SVH/DVH or dynamically setting heights
  useEffect(() => {
    const setDynamicHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setDynamicHeight();

    // Lock mount status to true only AFTER layout metrics are written cleanly into the DOM tree
    setMounted(true);

    window.addEventListener("resize", setDynamicHeight);
    return () => window.removeEventListener("resize", setDynamicHeight);
  }, []);

  // Mobile Touch Gestures (Swiping)
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // minimum distance in pixels to trigger a swipe
    const difference = touchStartX.current - touchEndX.current;

    if (difference > swipeThreshold) {
      // Swiped Left -> Next Slide
      setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    } else if (difference < -swipeThreshold) {
      // Swiped Right -> Previous Slide
      setCurrent((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{
        height: "calc(var(--vh, 1vh) * 100)",
        minHeight: "-webkit-fill-available",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        🛠️ FIX 2: Only inject child slides once layout configurations are set.
        This blocks Framer Motion from executing vector translations on uneven server footprints.
      */}
      {mounted && (
        <>
          <HeroBackground slide={heroSlides[current]} />
          <HeroContent slide={heroSlides[current]} />
          <HeroProgress
            slides={heroSlides}
            current={current}
            onChange={handleChange}
          />
        </>
      )}
    </section>
  );
}
