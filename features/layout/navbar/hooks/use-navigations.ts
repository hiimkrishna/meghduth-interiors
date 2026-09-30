"use client";

import { useCallback, useEffect, useState } from "react";
import type { NavigationItem } from "@/packages/contracts/src/site.schema";
import { getNavigations } from "../services/navigations.service";

export interface UseNavigationsResult {
  data: NavigationItem[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useNavigations(): UseNavigationsResult {
  const [data, setData] = useState<NavigationItem[]>([]);
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
    getNavigations()
      .then((res) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "মেনু লোড করা যায়নি",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return { data, loading, error, retry };
}
