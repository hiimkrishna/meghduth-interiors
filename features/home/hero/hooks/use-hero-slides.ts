"use client";

import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/packages/contracts/src/hero.schema";
import { getHeroSlides } from "../services/hero.service";

export interface UseHeroSlidesResult {
  slides: HeroSlide[];
  data: HeroSlide[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useHeroSlides(): UseHeroSlidesResult {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
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
    getHeroSlides()
      .then((data) => {
        if (active) {
          setSlides(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "স্লাইড লোড করা যায়নি",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return { slides, data: slides, loading, error, retry };
}
