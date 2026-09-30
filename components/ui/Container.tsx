import clsx from "clsx";
import type { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1216px] px-4 sm:px-6 lg:px-8",
        // Mobile Optimization: Secure safety padding so content never hits the raw screen glass edges
        className,
      )}
    >
      {children}
    </div>
  );
}
