import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  variant?: "default" | "active";
}

const GlassCard = ({ children, variant = "default" }: GlassCardProps) => {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        transition-all
        duration-700

        ${
          variant === "active"
            ? `
      border-[#B79A6A]/40
      bg-linear-to-b
      from-[#2B271F]
      to-[#181B20]
      shadow-[0_25px_80px_rgba(183,154,106,0.18)]
    `
            : `
              border-white/10
              bg-white/5
              backdrop-blur-2xl
            `
        }
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
