"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { getProject } from "../services/projects.service";
import type { ProjectDetail } from "@/packages/contracts/src/project.schema";

// একক প্রজেক্ট — data + loading + error + retry।
export function useProject(slug: string | null): {
  project: ProjectDetail | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [project, setProject] = useState<ProjectDetail | null>(null);
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
      setError("Project not found");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    getProject(current)
      .then((data) => {
        if (!active) return;
        setProject(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : "Failed to load project");
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

  return { project, loading, error, retry };
}
