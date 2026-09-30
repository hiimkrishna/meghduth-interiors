"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useFocusTrap } from "@/components/ui/use-focus-trap";

export interface LightboxItem {
  src: string;
  alt: string;
}

interface ProjectLightboxProps {
  items: LightboxItem[];
  index: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
}

// ফুলস্ক্রিন থিয়েটার — বড় ছবি উপরে, বাকিগুলো নিচে থাম্বনেইল, ডানে-বামে ঘোরা যায়।
export default function ProjectLightbox({ items, index, onSelect, onClose }: ProjectLightboxProps) {
  const open = index !== null && items.length > 0;
  const current = index ?? 0;
  const item = items[current] ?? items[0];
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  const goStep = useCallback(
    (step: 1 | -1): void => {
      if (items.length === 0) return;
      const next = (current + step + items.length) % items.length;
      onSelect(next);
    },
    [current, items.length, onSelect],
  );

  // কিবোর্ড — Escape-এ বন্ধ, তীরে ঘোরা। খোলা থাকলে পেছনে স্ক্রল বন্ধ।
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goStep(1);
      if (e.key === "ArrowLeft") goStep(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, goStep]);

  return (
    <AnimatePresence>
      {open && item !== undefined && (
        <motion.div
          style={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex flex-col bg-black/95 p-4 sm:p-8 backdrop-blur"
          onClick={onClose}
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* উপরের বার — কাউন্টার + বন্ধ */}
          <div
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-zinc-400" aria-live="polite">
              {current + 1} / {items.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="rounded-full border border-white/20 p-2.5 text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
            >
              <X size={20} />
            </button>
          </div>

          {/* থিয়েটার — বড় ছবি */}
          <div
            className="relative mx-auto mt-4 w-full max-w-6xl flex-1 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={item.src}
                style={{ opacity: 0, scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* ডানে-বামে */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goStep(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => goStep(1)}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* বিবরণ */}
          <p
            className="mx-auto mt-4 max-w-3xl text-center text-sm sm:text-base text-zinc-300"
            onClick={(e) => e.stopPropagation()}
          >
            {item.alt}
          </p>

          {/* নিচে বাকি ছবি — থাম্বনেইল */}
          {items.length > 1 && (
            <div
              className="mx-auto mt-4 flex w-full max-w-6xl gap-3 overflow-x-auto pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((thumb, i) => (
                <button
                  key={thumb.src}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`View image ${i + 1}: ${thumb.alt}`}
                  aria-current={i === current ? "true" : "false"}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-32 ${
                    i === current
                      ? "border-[#B79A6A] ring-1 ring-[#B79A6A]"
                      : "border-white/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumb.src}
                    alt=""
                    fill
                    sizes="128px"
                    loading="lazy"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
