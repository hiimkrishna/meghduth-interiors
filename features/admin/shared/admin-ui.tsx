// অ্যাডমিন ভাগ করা UI খণ্ড — সাদামাটা ডার্ক থিম (পাবলিক সাইট ছোঁয়া নিষেধ)।
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useFocusTrap } from "@/components/ui/use-focus-trap";

// ফরম/বোতামে একই রূপ — বারবার লেখা এড়াতে।
export const inputClass =
  "w-full rounded-lg border border-[#2d3238] bg-[#111315] px-3.5 py-2.5 text-sm text-[#f5f5f2] placeholder:text-[#7a828c] focus:border-[#b79a6a] focus:outline-none focus:ring-1 focus:ring-[#b79a6a]/40 transition-colors";

export const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#b6bcc5]";

export const primaryBtnClass =
  "rounded-lg bg-[#b79a6a] px-4 py-2 text-sm font-semibold text-[#111315] hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 transition";

export const ghostBtnClass =
  "rounded-lg border border-[#2d3238] bg-transparent px-4 py-2 text-sm text-[#b6bcc5] hover:border-[#b79a6a] hover:text-[#f5f5f2] disabled:cursor-not-allowed disabled:opacity-50 transition";

export const dangerBtnClass =
  "rounded-lg border border-red-900 bg-transparent px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50 transition";

export const smallBtnClass =
  "rounded-lg border border-[#2d3238] px-3 py-1.5 text-xs font-medium text-[#b6bcc5] hover:border-[#b79a6a] hover:text-[#f5f5f2] disabled:cursor-not-allowed disabled:opacity-50 transition";

export function AdminPageHeader(props: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}): ReactNode {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[#f5f5f2]">{props.title}</h1>
        {props.subtitle !== undefined && props.subtitle !== "" && (
          <p className="mt-1.5 text-sm text-[#7a828c]">{props.subtitle}</p>
        )}
      </div>
      {props.action !== undefined && (
        <div className="flex shrink-0 items-center gap-2">{props.action}</div>
      )}
    </div>
  );
}

export function AdminCard(props: { children: ReactNode }): ReactNode {
  return (
    <div className="rounded-2xl border border-[#2d3238] bg-[#181b20] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:p-6">
      {props.children}
    </div>
  );
}

export function FieldErrorText(props: { message?: string }): ReactNode {
  if (props.message === undefined || props.message === "") return null;
  return <p className="mt-1.5 text-xs text-red-400">{props.message}</p>;
}

export function LoadingState(props: { text?: string }): ReactNode {
  return (
    <AdminCard>
      <p className="py-10 text-center text-sm text-[#7a828c]">
        {props.text ?? "Loading…"}
      </p>
    </AdminCard>
  );
}

export function EmptyState(props: { text?: string; action?: ReactNode }): ReactNode {
  return (
    <AdminCard>
      <p className="py-10 text-center text-sm text-[#7a828c]">
        {props.text ?? "No data yet"}
      </p>
      {props.action !== undefined && (
        <div className="mt-4 flex justify-center">{props.action}</div>
      )}
    </AdminCard>
  );
}

export function ErrorState(props: {
  message: string;
  onRetry: () => void;
}): ReactNode {
  return (
    <AdminCard>
      <p className="py-2 text-center text-sm text-red-400">{props.message}</p>
      <div className="mt-4 text-center">
        <button type="button" className={ghostBtnClass} onClick={props.onRetry}>
          Try again
        </button>
      </div>
    </AdminCard>
  );
}

type BadgeTone = "green" | "gray" | "yellow" | "red" | "blue";

const toneClass: Record<BadgeTone, string> = {
  green: "border-green-900 bg-green-950 text-green-300",
  gray: "border-[#2d3238] bg-[#20242a] text-[#b6bcc5]",
  yellow: "border-yellow-900 bg-yellow-950 text-yellow-300",
  red: "border-red-900 bg-red-950 text-red-300",
  blue: "border-blue-900 bg-blue-950 text-blue-300",
};

export function StatusBadge(props: { text: string; tone: BadgeTone }): ReactNode {
  return (
    <span
      className={`inline-block shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${toneClass[props.tone]}`}
    >
      {props.text}
    </span>
  );
}

// সতর্কতা ডায়ালগ — ওভারলে-ক্লিক ও Escape-এ বন্ধ হয়, ভেতরে ক্লিকে নয়।
export function Modal(props: {
  open: boolean;
  title: string;
  message: string;
  actionLabel: string;
  onClose: () => void;
}): ReactNode {
  useEffect(() => {
    if (!props.open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.open, props.onClose]);
  const trapRef = useFocusTrap<HTMLDivElement>(props.open);

  return (
    <AnimatePresence>
      {props.open && (
        <motion.div
          style={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={props.onClose}
          role="presentation"
        >
          <motion.div
            style={{ opacity: 0, scale: 0.94, y: 12 }}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className="w-full max-w-sm rounded-2xl border border-[#2d3238] bg-[#181b20] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            ref={trapRef}
            role="alertdialog"
            aria-modal="true"
            aria-label={props.title}
          >
            <h2 className="text-lg font-semibold text-[#f5f5f2]">{props.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#b6bcc5]">{props.message}</p>
            <div className="mt-5 flex justify-end">
              <button type="button" className={primaryBtnClass} onClick={props.onClose}>
                {props.actionLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
