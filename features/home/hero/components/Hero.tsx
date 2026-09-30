"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as React from "react";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroProgress from "./HeroProgress";
import Skeleton from "@/components/ui/Skeleton";
import { useHeroSlides } from "../hooks/use-hero-slides";

export default function Hero() {
  const { slides, loading, error, retry } = useHeroSlides();
  const [current, setCurrent] = useState<number>(0);
  // স্লাইডের দিক (+1/-1) — কনটেন্ট সেদিক থেকে ঢোকে। টাইমার+বার একই চক্রে চলে।
  const [direction, setDirection] = useState<number>(0);
  const [cycle, setCycle] = useState<number>(0);
  // হোভার/স্পর্শে থামে — টাইমার ও প্রগ্রেস-বার একসাথে থামে।
  const [paused, setPaused] = useState<boolean>(false);

  // dY>��,? FIX 1: Track client-side mounting cycle to bypass server height mismatch conflicts
  const [mounted, setMounted] = useState<boolean>(false);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Memoize handleChange to prevent unnecessary sub-component rerenders
  const goTo = useCallback(
    (index: number): void => {
      if (index === current) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      setCycle((c) => c + 1);
    },
    [current],
  );

  const goStep = useCallback(
    (step: 1 | -1): void => {
      if (slides.length === 0) return;
      setDirection(step);
      setCurrent((prev) => (prev + step + slides.length) % slides.length);
      setCycle((c) => c + 1);
    },
    [slides.length],
  );

  const handleChange = useCallback(
    (index: number): void => {
      goTo(index);
    },
    [goTo],
  );

  // Handle slide transitions automatically — থামা অবস্থায় টাইমার চলে না।
  useEffect(() => {
    if (slides.length === 0 || paused) return;

    const timer = setTimeout(() => {
      goStep(1);
    }, 9000);

    return () => clearTimeout(timer);
  }, [cycle, paused, slides.length, goStep]);

  // তালিকা ছোট হলে চলতি সূচক সীমার ভেতরে রাখো।
  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  // Mobile Optimization: Fix real mobile layout issues by using SVH/DVH or dynamically setting heights
  useEffect(() => {
    const setDynamicHeight = (): void => {
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
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>): void => {
    setPaused(true);
    const touch = e.targetTouches[0];
    if (touch !== undefined) {
      touchStartX.current = touch.clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>): void => {
    const touch = e.targetTouches[0];
    if (touch !== undefined) {
      touchEndX.current = touch.clientX;
    }
  };

  const handleTouchEnd = (): void => {
    const swipeThreshold = 50; // minimum distance in pixels to trigger a swipe
    const difference = touchStartX.current - touchEndX.current;

    if (difference > swipeThreshold) {
      // Swiped Left -> Next Slide
      goStep(1);
    } else if (difference < -swipeThreshold) {
      // Swiped Right -> Previous Slide
      goStep(-1);
    } else {
      // শুধু ছোঁয়া — চক্র আবার চালু করো।
      setCycle((c) => c + 1);
    }
    setPaused(false);

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const slide = slides[current];

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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        dY>��,? FIX 2: Only inject child slides once layout configurations are set.
        This blocks Framer Motion from executing vector translations on uneven server footprints.
      */}
      {/* লোডিং অবস্থা — কঙ্কাল */}
      {mounted && loading && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      )}
      {/* ত্রুটি অবস্থা — বার্তা + পুনঃচেষ্টা */}
      {mounted && !loading && error !== null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center">
          <p className="text-base text-neutral-300">
            Failed to load slides: {error}
          </p>
          <button
            type="button"
            onClick={retry}
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
          >
            Try again
          </button>
        </div>
      )}
      {/* শূন্য অবস্থা */}
      {mounted && !loading && error === null && slide === undefined && (
        <div className="absolute inset-0 flex items-center justify-center bg-black px-6 text-center">
          <p className="text-base text-neutral-300">No slides found.</p>
        </div>
      )}
      {mounted && !loading && error === null && slide !== undefined && (
        <>
          <HeroBackground slide={slide} />
          <HeroContent slide={slide} direction={direction} />
          <HeroProgress
            slides={slides}
            current={current}
            cycle={cycle}
            paused={paused}
            onChange={handleChange}
          />
        </>
      )}
    </section>
  );
}
