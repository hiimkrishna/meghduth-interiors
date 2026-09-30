import type { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className = "", hover = true }: CardProps) => {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#17191B]
        p-8

        transition-all
        duration-500

        ${
          hover
            ? "hover:-translate-y-2 hover:border-[#B79A6A]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,.35)]"
            : ""
        }

        ${className}
      `}
    >
      {/* Gold Accent */}
      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-0
          bg-[#B79A6A]

          transition-all
          duration-500

          group-hover:w-full
        "
      />

      {children}
    </div>
  );
};

export default Card;
