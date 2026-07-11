import Link from "next/link";
import clsx from "clsx";

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-300";

  const variants = {
    primary: "bg-[#B79A6A] text-black hover:bg-[#c7ac7c]",

    secondary:
      "border border-white/15 text-white hover:border-[#B79A6A] hover:text-[#B79A6A]",

    ghost: "text-white hover:text-[#B79A6A]",
  };

  if (href) {
    return (
      <Link href={href} className={clsx(base, variants[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
