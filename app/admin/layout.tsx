// অ্যাডমিন খোলস — গার্ড (টোকেন ছাড়া /admin/login) + সাইডবার/উপর-বার।
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as AuthStore from "@/lib/auth-store";
import { api } from "@/lib/api";
import {
  getAdminEmail,
  getAdminToken,
  validateAdminSession,
} from "@/features/admin/auth/use-admin-auth";
import { AdminErrorBoundary } from "@/components/ui/ErrorBoundary";

// বাম মেনু — ৬ পেজ ট্যাব (ওয়েবসাইটের ৬ পেজ) + ব্যবস্থাপনা গ্রুপ।
// প্রতি ট্যাবে ওই পেজের সব কনটেন্ট এক পেজে; শেয়ার্ড সেকশন মালিক ট্যাবে একবারই এডিট হয়।
const MENU_GROUPS: Array<{
  heading: string;
  items: Array<{ href: string; label: string }>;
}> = [
  {
    heading: "Pages",
    items: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/about", label: "About" },
      { href: "/admin/services", label: "Services" },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/team", label: "Team" },
      { href: "/admin/contact", label: "Contact" },
    ],
  },
  {
    heading: "Manage",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/testimonials", label: "Testimonials" },
      // Navigation hidden for now (soft-removed) — a menu item is useless until
      // creating it also creates its page. Route + page stay intact for later.
      // { href: "/admin/navigations", label: "Navigation" },
      { href: "/admin/site-settings", label: "Settings" },
      { href: "/admin/inbox", label: "Inbox" },
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/audit", label: "Audit Log" },
    ],
  },
];

const isActive = (href: string, pathname: string): boolean =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const isLogin = pathname === "/admin/login";

  // গার্ড — টোকেনের বৈধতা সার্ভারে যাচাই করো (শুধু অস্তিত্বে নয়)।
  // অবৈধ হলে টোকেন মুছে লগইনে — লগইন পেজও যাচাই করে, তাই লুপ অসম্ভব।
  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (getAdminToken() === null) {
      router.replace("/admin/login");
      return;
    }
    let active = true;
    void validateAdminSession().then((valid) => {
      if (!active) return;
      if (!valid) {
        router.replace("/admin/login");
        return;
      }
      setEmail(getAdminEmail());
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111315]">
        <p className="text-sm text-[#7a828c]">Loading…</p>
      </div>
    );
  }

  const onLogout = (): void => {
    void api.post<unknown>("/auth/logout").catch(() => undefined).finally(() => {
      AuthStore.clearAdminEmail();
      router.replace("/admin/login");
    });
  };

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-[#111315] text-[#f5f5f2]">
      {/* মোবাইল: উপরে কমপ্যাক্ট বার + হরিজন্টাল মেনু */}
      <header className="border-b border-[#2d3238] bg-[#181b20] lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="text-base font-semibold tracking-tight text-[#b79a6a]">
            Meghduth Admin
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-lg border border-[#2d3238] px-3 py-1.5 text-xs font-medium text-[#b6bcc5] hover:border-[#b79a6a] hover:text-[#f5f5f2]"
          >
            Log out
          </button>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-4 pb-3">
          {MENU_GROUPS.map((g) => (
            <div key={g.heading} className="flex items-center gap-1.5">
              <span className="mr-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#7a828c]">
                {g.heading}
              </span>
              {g.items.map((m) => {
                const active = isActive(m.href, pathname);
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                      active
                        ? "bg-[#20242a] font-medium text-[#b79a6a]"
                        : "text-[#b6bcc5] hover:bg-[#20242a] hover:text-[#f5f5f2]"
                    }`}
                  >
                    {m.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </header>

      <div className="lg:flex lg:min-h-screen">
        {/* ডেস্কটপ: বামে স্থির সাইডবার */}
        <aside className="hidden w-64 shrink-0 border-r border-[#2d3238] bg-[#181b20] lg:flex lg:min-h-screen lg:flex-col lg:sticky lg:top-0 lg:h-screen">
          <div className="px-5 pb-5 pt-6">
            <Link href="/admin" className="text-lg font-semibold tracking-tight text-[#b79a6a]">
              Meghduth Admin
            </Link>
            <p className="mt-1 text-xs text-[#7a828c]">Content management</p>
          </div>
          <nav className="flex-1 space-y-4 overflow-y-auto px-3">
            {MENU_GROUPS.map((g) => (
              <div key={g.heading}>
                <p className="mb-1 px-3.5 text-[10px] font-semibold uppercase tracking-wider text-[#7a828c]">
                  {g.heading}
                </p>
                <div className="space-y-1">
                  {g.items.map((m) => {
                    const active = isActive(m.href, pathname);
                    return (
                      <Link
                        key={m.href}
                        href={m.href}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                          active
                            ? "bg-[#20242a] font-medium text-[#b79a6a]"
                            : "text-[#b6bcc5] hover:bg-[#20242a] hover:text-[#f5f5f2]"
                        }`}
                      >
                        {m.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t border-[#2d3238] p-4">
            {email !== null && email !== "" && (
              <p className="mb-2 truncate px-1 text-xs text-[#7a828c]" title={email}>
                {email}
              </p>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-lg border border-[#2d3238] px-3 py-2 text-xs font-medium text-[#b6bcc5] hover:border-[#b79a6a] hover:text-[#f5f5f2]"
            >
              Log out
            </button>
          </div>
        </aside>

        {/* ডানে: টপবার + কনটেন্ট */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 hidden border-b border-[#2d3238] bg-[#111315]/95 backdrop-blur lg:block">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-8 py-4">
              <p className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                Admin Panel
              </p>
              <div className="flex min-w-0 items-center gap-3">
                {email !== null && email !== "" && (
                  <span className="truncate text-xs text-[#7a828c]" title={email}>
                    {email}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="shrink-0 rounded-lg border border-[#2d3238] px-3 py-1.5 text-xs font-medium text-[#b6bcc5] hover:border-[#b79a6a] hover:text-[#f5f5f2]"
                >
                  Log out
                </button>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  </AdminErrorBoundary>
);
}
