"use client";

import { useCallback, useEffect, useState } from "react";
import type { TeamMember } from "@/packages/contracts/src/team.schema";
import { getTeamMembers } from "../services/team.service";

export interface UseTeamResult {
  members: TeamMember[];
  data: TeamMember[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useTeam(): UseTeamResult {
  const [members, setMembers] = useState<TeamMember[]>([]);
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
    getTeamMembers()
      .then((data) => {
        if (active) {
          setMembers(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "টিম লোড করা যায়নি");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  return { members, data: members, loading, error, retry };
}
