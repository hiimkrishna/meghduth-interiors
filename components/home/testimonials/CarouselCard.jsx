"use client";

import { motion } from "framer-motion";

import TestimonialCard from "./TestimonialCard";

import { CARD_POSITIONS, CARD_TRANSITION } from "./carouselConfig";

const CarouselCard = ({ testimonial }) => {
  const { position } = testimonial;

  const animation = CARD_POSITIONS[position];

  const isCenter = position === "center";

  return (
    <motion.div
      initial={false}
      animate={animation}
      transition={CARD_TRANSITION}
      className="
        absolute
        left-1/2
        top-1/2

        w-[90%]
        max-w-sm

        -translate-x-1/2
        -translate-y-1/2

        sm:max-w-md

        md:max-w-lg

        lg:max-w-xl
      "
      style={{
        pointerEvents: isCenter ? "auto" : "none",
      }}
    >
      {/* Center card glow */}

      {isCenter && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            absolute
            inset-0
            -z-10

            rounded-3xl

            bg-[#B79A6A]/20

            blur-3xl
          "
        />
      )}

      <motion.div
        whileHover={
          isCenter
            ? {
                scale: 1.04,
                y: -8,
              }
            : {}
        }
        transition={{
          duration: 0.35,
        }}
      >
        <TestimonialCard testimonial={testimonial} />
      </motion.div>
    </motion.div>
  );
};

export default CarouselCard;
