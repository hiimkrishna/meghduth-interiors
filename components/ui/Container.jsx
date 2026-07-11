import clsx from "clsx";

export default function Container({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1216px]",
        // Mobile Optimization: Secure safety padding so content never hits the raw screen glass edges
        "px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
