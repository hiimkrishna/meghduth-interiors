"use client";

import { useEffect, useState } from "react";

import testimonials from "@/data/testimonials";

import CarouselCard from "./CarouselCard";
import Indicators from "./Indicators";

import { getVisibleTestimonials } from "./helpers";

const AUTO_PLAY_DELAY = 5000;

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, AUTO_PLAY_DELAY);

    return () => clearTimeout(timer);
  }, [current]);

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
        {visibleTestimonials.map((testimonial) => (
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
