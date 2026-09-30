"use client";

import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/packages/contracts/src/testimonial.schema";
import { getTestimonials } from "../services/testimonials.service";

export interface UseTestimonialsResult {
  testimonials: Testimonial[];
  data: Testimonial[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useTestimonials(): UseTestimonialsResult {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);

  // পুনঃচেষ্টা — nonce বদলালে useEffect আবার চলে।
  // NOTE: loading/error রিসেট retry হ্যান্ডলারে (ইভেন্টে setState বৈধ),
  // effect বডিতে সরাসরি setState এড়াতে (react-hooks/set-state-in-effect)।
  const retry = useCallback((): void => {
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    getTestimonials()
      .then((data) => {
        if (active) {
          setTestimonials(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "মতামত লোড করা যায়নি",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return { testimonials, data: testimonials, loading, error, retry };
}
