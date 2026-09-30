"use client";

import { useCallback, useEffect, useState } from "react";
import type { ServiceItem } from "@/packages/contracts/src/service.schema";
import { getServicesPreview } from "../services/services-preview.service";
import { getHomeSection } from "../../section-headers/section-headers.service";
import { homeServicesPreviewFallback } from "@/lib/page-fallbacks/home";

export interface ServicesPreviewHeader {
  eyebrow: string;
  title: string;
}

export interface UseServicesPreviewResult {
  services: ServiceItem[];
  data: ServiceItem[];
  header: ServicesPreviewHeader;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useServicesPreview(): UseServicesPreviewResult {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [header, setHeader] = useState<ServicesPreviewHeader>(homeServicesPreviewFallback);
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
    Promise.all([
      getServicesPreview(),
      getHomeSection("servicesPreview", homeServicesPreviewFallback),
    ])
      .then(([items, head]) => {
        if (active) {
          setServices(items);
          setHeader(head);
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

  return { services, data: services, header, loading, error, retry };
}
