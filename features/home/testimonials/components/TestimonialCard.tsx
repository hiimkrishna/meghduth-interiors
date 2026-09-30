import Image from "next/image";
import GlassCard from "./GlassCard";
import type { VisibleTestimonial } from "./helpers";
import { resolveImageSrc } from "@/lib/image-url";

interface TestimonialCardProps {
  testimonial: VisibleTestimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
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
          &ldquo;{testimonial.text}&rdquo;
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
            {/* ছবি না থাকলে খালি src-তে <Image> রেন্ডার নিষেধ (ব্রাউজার ওয়ার্নিং হয়) —
                একই বৃত্তে নামের আদ্যক্ষর থাকে, লেআউট হুবহু থাকে। */}
            {/* DB-তে শুধু key থাকে — resolveImageSrc দেখানোর URL বানায়। */}
            {resolveImageSrc(testimonial.imageKey) !== undefined ? (
              <Image
                src={resolveImageSrc(testimonial.imageKey) as string}
                alt={testimonial.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#B79A6A]/40 via-[#17191B] to-[#0c0d0e] text-xl font-semibold text-[#B79A6A]"
              >
                {testimonial.name.trim().charAt(0).toUpperCase()}
              </div>
            )}
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
              {testimonial.designation}
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
