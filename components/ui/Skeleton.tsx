import { twMerge } from "tailwind-merge";

// ডিজাইনের সাথে মানানসই shimmer ব্লক — loading অবস্থায় success JSX-এর জায়গায় বসে।
// রঙ প্রসঙ্গ-নির্ভর: গাঢ় পটভূমিতে ডিফল্ট, হালকা পটভূমিতে className-এ bg-neutral-200 দাও।
interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        "animate-pulse rounded-xl bg-white/10",
        className,
      )}
    />
  );
}
