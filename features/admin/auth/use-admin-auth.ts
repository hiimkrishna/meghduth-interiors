// অ্যাডমিন প্রমাণীকরণ — টোকেন httpOnly কুকিতে (সার্ভার বসায়), ক্লায়েন্টে শুধু email-চিহ্ন।
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { LoginInput } from "@/packages/contracts/src/auth.schema";
import {
  clearAdminEmail,
  getStoredAdminEmail,
  setStoredAdminEmail,
} from "@/lib/auth-store";

// পুরনো কলার-সামঞ্জস্য — টোকেন নয়, email-চিহ্ন ফেরে (null = লগড-আউট)।
export function getAdminToken(): string | null {
  return getStoredAdminEmail();
}

export function isAdminLoggedIn(): boolean {
  return getStoredAdminEmail() !== null;
}

export function getAdminEmail(): string | null {
  return getStoredAdminEmail();
}

// টোকেনের বৈধতা — সার্ভারে /auth/me ডেকে নিশ্চিত হও (অস্তিত্ব দেখে নয়)।
export async function validateAdminSession(): Promise<boolean> {
  if (getStoredAdminEmail() === null) return false;
  try {
    await api.get<unknown>("/auth/me");
    return true;
  } catch {
    clearAdminEmail();
    return false;
  }
}

// সার্ভার এখন { user } ফেরে (টোকেন httpOnly কুকিতে)।
export interface AdminAuthResult {
  user: { id: string; email: string; name: string; role: string };
}

interface UseAdminAuthResult {
  loading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthResult {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (input: LoginInput): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post<AdminAuthResult>("/auth/login", input);
        setStoredAdminEmail(res.user.email);
        router.replace("/admin");
        return true;
      } catch {
        setError("Incorrect email or password.");
        setLoading(false);
        return false;
      }
    },
    [router],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post<unknown>("/auth/logout");
    } catch {
      // কুকি সার্ভারে মুছবে — নীরবে এগোও।
    }
    clearAdminEmail();
    router.replace("/admin/login");
  }, [router]);

  return { loading, error, login, logout };
}
