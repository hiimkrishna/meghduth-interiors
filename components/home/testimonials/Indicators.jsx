"use client";

const Indicators = ({ total, current, onChange }) => {
  return (
    <div
      className="
        mt-12
        flex
        items-center
        justify-center
        gap-3
      "
    >
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          aria-label={`Go to testimonial ${index + 1}`}
          className="
            group
            relative
            h-1
            w-10
            overflow-hidden
            rounded-full
            bg-white/20

            sm:w-14
          "
        >
          <span
            className={`
              absolute
              inset-y-0
              left-0
              rounded-full
              bg-[#B79A6A]
              transition-all
              duration-500

              ${current === index ? "w-full" : "w-0"}
            `}
          />
        </button>
      ))}
    </div>
  );
};

export default Indicators;
