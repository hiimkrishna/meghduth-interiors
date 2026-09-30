"use client";

import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusable(container: HTMLElement): HTMLElement[] {
  const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter((el) => {
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    const rect = el.getBoundingClientRect();
    // অদৃশ্য (display:none) বাদ — আকার শূন্য হলেও fixed/absolute হতে পারে, তাই offsetParent-ও দেখো।
    if (rect.width === 0 && rect.height === 0) return false;
    return true;
  });
}

// ফোকাস-ট্র্যাপ — খোলা ডায়ালগে Tab-চক্র, খোলায় প্রথম-ফোকাস, বন্ধে ফেরত-ফোকাস।
// Escape-লজিক আগে থেকে থাকলে সেটাই থাকে; onClose দিলে Escape-এও ডাকা হয়।
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  onClose?: () => void,
): (node: T | null) => void {
  const containerRef = useRef<T | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef<(() => void) | undefined>(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (container === null) return;

    prevFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = getFocusable(container);
    const first = focusables[0];
    if (first !== undefined) {
      first.focus();
    } else if (!container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
      container.focus();
    } else {
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const current = containerRef.current;
      if (current === null) return;
      const items = getFocusable(current);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (firstItem === undefined || lastItem === undefined) return;
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      prevFocusRef.current?.focus();
      prevFocusRef.current = null;
    };
  }, [active]);

  const setRef = useCallback((node: T | null): void => {
    containerRef.current = node;
  }, []);

  return setRef;
}

export default useFocusTrap;
