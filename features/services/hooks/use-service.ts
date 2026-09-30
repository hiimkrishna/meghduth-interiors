"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { getService } from "../services/services.service";
import type { ServiceDetail } from "@/packages/contracts/src/service.schema";

// একক সেবা — data + loading + error + retry।
export function useService(slug: string | null): {
  service: ServiceDetail | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const slugRef = useRef(slug);

  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);

  useEffect(() => {
    const current = slugRef.current;
    if (current === null || current === "") {
      setError("Service not found");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    getService(current)
      .then((data) => {
        if (!active) return;
        setService(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : "Failed to load service");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce, slug]);

  const retry = useCallback((): void => {
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  }, []);

  return { service, loading, error, retry };
}
