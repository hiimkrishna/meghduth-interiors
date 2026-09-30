// অ্যাডমিন লগইন — react-hook-form + zodResolver(loginSchema), ভুলে বাংলা বার্তা।
"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { LoginInput } from "@/packages/contracts/src/auth.schema";
import { loginSchema } from "@/packages/contracts/src/auth.schema";
import { isAdminLoggedIn, useAdminAuth, validateAdminSession } from "@/features/admin/auth/use-admin-auth";
import {
  inputClass,
  labelClass,
  primaryBtnClass,
} from "@/features/admin/shared/admin-ui";

export default function AdminLoginPage(): ReactNode {
  const router = useRouter();
  const { loading, error, login } = useAdminAuth();

  // টোকেন থাকলে বৈধতা যাচাই করে ড্যাশবোর্ডে — মেয়াদোত্তীর্ণ হলে ফরমেই থাকো (লুপ নয়)।
  useEffect(() => {
    if (!isAdminLoggedIn()) return;
    let active = true;
    void validateAdminSession().then((valid) => {
      if (active && valid) router.replace("/admin");
    });
    return () => {
      active = false;
    };
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    await login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111315] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#2d3238] bg-[#181b20] p-6 sm:p-7">
        <h1 className="text-xl font-semibold tracking-tight text-[#f5f5f2]">Admin Login</h1>
        <p className="mt-1 text-sm text-[#7a828c]">Meghduth Admin Panel</p>
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="mt-5 space-y-4"
        >
          <div>
            <label className={labelClass} htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...register("email")}
            />
            {errors.email !== undefined && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message ?? "Enter a valid email"}</p>
            )}
          </div>
          <div>
            <label className={labelClass} htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              {...register("password")}
            />
            {errors.password !== undefined && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message ?? "Enter your password"}</p>
            )}
          </div>
          {error !== null && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button type="submit" className={`${primaryBtnClass} w-full`} disabled={loading}>
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
