"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = (): React.JSX.Element | null => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  const handleClick = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className="
        group

        fixed
        left-5
        bottom-[max(1.25rem,env(safe-area-inset-bottom))]
        z-40

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
