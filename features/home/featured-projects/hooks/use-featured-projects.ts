"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectCardItem } from "../components/ProjectCard";
import { getFeaturedProjects } from "../services/featured-projects.service";

export interface UseFeaturedProjectsResult {
  projects: ProjectCardItem[];
  data: ProjectCardItem[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useFeaturedProjects(): UseFeaturedProjectsResult {
  const [projects, setProjects] = useState<ProjectCardItem[]>([]);
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
    getFeaturedProjects()
      .then((data) => {
        if (active) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "প্রজেক্ট লোড করা যায়নি",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return { projects, data: projects, loading, error, retry };
}
