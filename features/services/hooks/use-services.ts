"use client";

import { useCallback, useEffect, useState } from "react";
import type { ServiceItem } from "@/packages/contracts/src/service.schema";
import { getServices } from "../services/services.service";

export interface UseServicesResult {
  services: ServiceItem[];
  data: ServiceItem[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useServices(): UseServicesResult {
  const [services, setServices] = useState<ServiceItem[]>([]);
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
    getServices()
      .then((data) => {
        if (active) {
          setServices(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "সেবা লোড করা যায়নি");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return { services, data: services, loading, error, retry };
}
