"use client";

import { useEffect, useState } from "react";
import CarouselCard from "./CarouselCard";
import Indicators from "./Indicators";
import Skeleton from "@/components/ui/Skeleton";
import { AUTOPLAY_TIME } from "./carouselConfig";
import { getVisibleTestimonials } from "./helpers";
import { useTestimonials } from "../hooks/use-testimonials";

const Carousel = () => {
  const { testimonials, loading, error, retry } = useTestimonials();
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, AUTOPLAY_TIME);

    return () => clearTimeout(timer);
  }, [current, testimonials.length]);

  // তালিকা ছোট হলে চলতি সূচক সীমার ভেতরে রাখো।
  useEffect(() => {
    if (testimonials.length > 0 && current >= testimonials.length) {
      setCurrent(0);
    }
  }, [current, testimonials.length]);

  const visibleTestimonials = getVisibleTestimonials(testimonials, current);

  return (
    <div
      className="
        relative
        h-[550px]

        sm:h-[600px]

        lg:h-[650px]
      "
    >
      <div
        className="
          relative
          h-full
          w-full
        "
      >
        {/* লোডিং অবস্থা — কঙ্কাল */}
        {loading && (
          <Skeleton className="absolute left-1/2 top-1/2 h-[60%] w-[90%] max-w-xl -translate-x-1/2 -translate-y-1/2" />
        )}
        {/* ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা */}
        {!loading && error !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-base text-neutral-300">
              Failed to load testimonials: {error}
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
        {!loading && error === null && testimonials.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-base text-neutral-300">
              No testimonials found.
            </p>
          </div>
        )}
        {!loading &&
          error === null &&
          visibleTestimonials.map((testimonial) => (
            <CarouselCard key={testimonial.id} testimonial={testimonial} />
          ))}
      </div>

      <Indicators
        total={testimonials.length}
        current={current}
        onChange={setCurrent}
      />
    </div>
  );
};

export default Carousel;
