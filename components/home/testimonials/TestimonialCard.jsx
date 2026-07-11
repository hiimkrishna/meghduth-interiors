import Image from "next/image";

import GlassCard from "./GlassCard";

const TestimonialCard = ({ testimonial }) => {
  const isActive = testimonial.position === "center";

  return (
    <GlassCard variant={isActive ? "active" : "default"}>
      <div
        className="
          flex
          flex-col
          items-center
          text-center
          p-8

          sm:p-10
        "
      >
        {/* Quote */}

        <p
          className={`
            text-base
            leading-8
            transition-colors
            duration-500

            sm:text-lg

            ${isActive ? "text-neutral-200" : "text-neutral-400"}
          `}
        >
          "{testimonial.quote}"
        </p>

        {/* Divider */}

        <div
          className="
            my-8
            h-px
            w-full
            bg-white/10
          "
        />

        {/* Client */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              relative
              h-14
              w-14
              overflow-hidden
              rounded-full
              border
              border-white/10
            "
          >
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          <div className="text-left">
            <h3
              className="
                text-base
                font-medium
                text-white
              "
            >
              {testimonial.name}
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-neutral-400
              "
            >
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Rating */}

        <div
          className="
            mt-6
            flex
            gap-1
          "
        >
          {Array.from({
            length: testimonial.rating,
          }).map((_, index) => (
            <span
              key={index}
              className="
                text-[#B79A6A]
              "
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default TestimonialCard;
