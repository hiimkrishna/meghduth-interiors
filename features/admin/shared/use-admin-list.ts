// অ্যাডমিন তালিকা হুক — loading/error/reload + 401-এ লগইনে পাঠানো।
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";

// লগইন পেজে থাকতে আবার লগইনে পাঠানো নিষেধ — লুপ-নিরাপত্তা।
function redirectToLogin(router: { replace: (href: string) => void }): void {
  if (typeof window !== "undefined" && window.location.pathname === "/admin/login") return;
  router.replace("/admin/login");
}

// সার্ভার অ্যারে বা {items} যাই দিক — নিরাপদে অ্যারে বানাও.
export function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "object" && value !== null) {
    const rec = value as Record<string, unknown>;
    if (Array.isArray(rec.items)) return rec.items as T[];
    if (Array.isArray(rec.data)) return rec.data as T[];
  }
  return [];
}

// Fallback message for admin errors.
export function adminErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message !== "") return err.message;
  return "Something went wrong";
}

export interface AdminListResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAdminList<T>(load: () => Promise<T[]>): AdminListResult<T> {
  const router = useRouter();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    let active = true;
    loadRef
      .current()
      .then((data) => {
        if (!active) return;
        setItems(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          redirectToLogin(router);
          return;
        }
        setError(adminErrorMessage(err));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce, router]);

  const reload = useCallback((): void => {
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  }, []);

  return { items, loading, error, reload };
}

// মিউটেশন (তৈরি/বদল/মোছা) ব্যর্থ হলে বার্তা দাও; 401 হলে লগইনে পাঠাও।
export function useAdminMutationGuard(): (err: unknown) => string | null {
  const router = useRouter();
  return useCallback(
    (err: unknown): string | null => {
      if (err instanceof ApiError && err.status === 401) {
        redirectToLogin(router);
        return null;
      }
      return adminErrorMessage(err);
    },
    [router],
  );
}
