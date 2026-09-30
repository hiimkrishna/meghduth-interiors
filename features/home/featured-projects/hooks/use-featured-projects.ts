"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectCardItem } from "../components/ProjectCard";
import { getFeaturedProjects } from "../services/featured-projects.service";
import { getHomeSection } from "../../section-headers/section-headers.service";
import { homeFeaturedFallback } from "@/lib/page-fallbacks/home";

export interface FeaturedHeader {
  badge: string;
  title: string;
  description: string;
}

export interface UseFeaturedProjectsResult {
  projects: ProjectCardItem[];
  data: ProjectCardItem[];
  header: FeaturedHeader;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useFeaturedProjects(): UseFeaturedProjectsResult {
  const [projects, setProjects] = useState<ProjectCardItem[]>([]);
  const [header, setHeader] = useState<FeaturedHeader>(homeFeaturedFallback);
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
      getFeaturedProjects(),
      getHomeSection("featured", homeFeaturedFallback),
    ])
      .then(([items, head]) => {
        if (active) {
          setProjects(items);
          setHeader(head);
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

  return { projects, data: projects, header, loading, error, retry };
}
