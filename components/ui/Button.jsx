import Link from "next/link";
import clsx from "clsx";

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}) {
  // Mobile Optimization: Shifted py-3 to py-3.5 to scale total button height to a comfortable, thumb-friendly ~46px target zone
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium tracking-wide " +
    "transition-all duration-200 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A6A] focus-visible:ring-offset-2 focus-visible:ring-offset-black " +
    "active:scale-[0.98]"; // Subtle physical depress effect on mobile click taps

  const variants = {
    primary:
      "bg-[#B79A6A] text-neutral-950 hover:bg-[#c7ac7c] active:bg-[#a68959]",

    secondary:
      "border border-white/15 text-white hover:border-[#B79A6A] hover:text-[#B79A6A] active:bg-white/5",

    ghost: "text-white hover:text-[#B79A6A] active:bg-white/5",
  };

  const combinedStyles = clsx(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {/* Ensures inner icons and text content sit perfectly aligned in mobile viewports */}
        <span className="flex items-center justify-center gap-2 w-full h-full">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"} // Default explicitly to prevent unwanted form submission side-effects
      className={combinedStyles}
      {...props}
    >
      <span className="flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </button>
  );
}
