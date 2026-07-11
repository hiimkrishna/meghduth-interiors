import clsx from "clsx";

export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className = "",
}) {
  return (
    <div
      className={clsx(
        "w-full max-w-3xl transition-all duration-200",
        // Mobile Optimization: Center text by default on mobile if requested, but respect left alignment
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {/* Mobile Badge: Adjusted letter-spacing to prevent premature line-wrapping on narrow screens */}
      {badge && (
        <span className="inline-block text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#B79A6A] select-none">
          {badge}
        </span>
      )}

      {/* Mobile Title: Scaled typography down to text-3xl to keep layouts tight and elegant */}
      {title && (
        <h2 className="mt-3 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.15] tracking-tight text-white text-balance">
          {title}
        </h2>
      )}

      {/* Mobile Description: Relaxed leading but smaller text size for premium editorial legibility */}
      {description && (
        <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-zinc-400 text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
