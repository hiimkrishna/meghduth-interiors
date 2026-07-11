"use client";

import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className="
        group

        flex
        h-11
        w-11
        items-center
        justify-center

        rounded-full

        border
        border-white/10

        bg-white/5

        text-neutral-400

        backdrop-blur-md

        transition-all
        duration-300

        hover:border-[#B79A6A]/50
        hover:bg-[#B79A6A]
        hover:text-black
      "
    >
      <ArrowUp
        size={18}
        className="
          transition-transform
          duration-300

          group-hover:-translate-y-1
        "
      />
    </button>
  );
};

export default BackToTop;
