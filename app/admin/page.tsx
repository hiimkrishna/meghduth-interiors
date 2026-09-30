// অ্যাডমিন ড্যাশবোর্ড — চার্ট বিশ্লেষণ: মনোযোগ/লিড-প্রবাহ/ফানেল/কনটেন্ট/মতামত/সাম্প্রতিক।
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiError } from "@/lib/api";
import type { Overview } from "@/packages/contracts/src/overview.schema";
import { getAdminOverview } from "@/features/admin/overview/overview.service";
import {
  AdminCard,
  AdminPageHeader,
  ErrorState,
  LoadingState,
} from "@/features/admin/shared/admin-ui";
import { adminErrorMessage } from "@/features/admin/shared/use-admin-list";

const GOLD = "#b79a6a";
const GREEN = "#34d399";
const GRAY = "#7a828c";
const TRACK = "#2d3238";

const tooltipStyle = {
  backgroundColor: "#181b20",
  border: `1px solid ${TRACK}`,
  borderRadius: 8,
  color: "#f5f5f2",
  fontSize: 12,
};

const axisTick = { fill: GRAY, fontSize: 11 };

function fmtDate(iso: string): string {
  if (iso === "") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const FUNNEL_STAGES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;

const FUNNEL_COLORS: Record<(typeof FUNNEL_STAGES)[number], string> = {
  NEW: GOLD,
  CONTACTED: "#d4b98c",
  QUOTED: "#9db4c8",
  WON: GREEN,
  LOST: "#4a5058",
};

export default function AdminDashboardPage(): ReactNode {
  const router = useRouter();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);

  useEffect(() => {
    let active = true;
    getAdminOverview()
      .then((data) => {
        if (!active) return;
        setOverview(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setError(adminErrorMessage(err));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce, router]);

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Dashboard" subtitle="Studio analytics" />
        <LoadingState />
      </>
    );
  }

  if (error !== null || overview === null) {
    return (
      <>
        <AdminPageHeader title="Dashboard" subtitle="Studio analytics" />
        <ErrorState
          message={error ?? "Could not load the dashboard"}
          onRetry={() => {
            setLoading(true);
            setError(null);
            setNonce((n) => n + 1);
          }}
        />
      </>
    );
  }

  const attention = [
    { label: "Unread inbox", value: overview.attention.unreadInbox, href: "/admin/inbox" },
    { label: "New leads", value: overview.attention.newLeads, href: "/admin/leads" },
    {
      label: "Pending testimonials",
      value: overview.attention.pendingTestimonials,
      href: "/admin/testimonials",
    },
  ];

  const funnelData = FUNNEL_STAGES.map((stage) => ({
    stage,
    count: overview.funnel[stage],
  }));

  const contentData = [
    {
      name: "Services",
      live: overview.content.services.published,
      draft: overview.content.services.total - overview.content.services.published,
    },
    {
      name: "Projects",
      live: overview.content.projects.published,
      draft: overview.content.projects.total - overview.content.projects.published,
    },
    {
      name: "Hero slides",
      live: overview.content.heroSlides.published,
      draft: overview.content.heroSlides.total - overview.content.heroSlides.published,
    },
    {
      name: "Testimonials",
      live: overview.content.testimonials.approved,
      draft:
        overview.content.testimonials.pending + overview.content.testimonials.hidden,
    },
  ];

  const testimonialPie = [
    { name: "Approved", value: overview.content.testimonials.approved },
    { name: "Pending", value: overview.content.testimonials.pending },
    { name: "Hidden", value: overview.content.testimonials.hidden },
  ].filter((s) => s.value > 0);
  const PIE_COLORS = [GREEN, GOLD, GRAY];

  // পুরনো সার্ভার leadsByDay না-ও পাঠাতে পারে — তখন খালি চার্ট, ক্র্যাশ নয়।
  const leadsByDay = overview.leadsByDay ?? [];
  const totalLeads14 = leadsByDay.reduce((sum, d) => sum + d.count, 0);

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="Studio analytics" />

      {/* মনোযোগ — কার্ড সারি। */}
      <section aria-label="Needs attention" className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {attention.map((a) => (
            <Link key={a.label} href={a.href}>
              <AdminCard>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#7a828c]">{a.label}</p>
                    <p
                      className={`mt-1 text-3xl font-semibold ${
                        a.value > 0 ? "text-[#b79a6a]" : "text-[#f5f5f2]"
                      }`}
                    >
                      {a.value}
                    </p>
                  </div>
                  {a.value > 0 && (
                    <span className="shrink-0 rounded-full border border-[#b79a6a]/50 px-3 py-1 text-xs font-medium text-[#b79a6a]">
                      Review →
                    </span>
                  )}
                </div>
              </AdminCard>
            </Link>
          ))}
        </div>
      </section>

      {/* লিড-প্রবাহ — শেষ ১৪ দিনের এরিয়া চার্ট। */}
      <section aria-label="Lead flow" className="mb-6">
        <AdminCard>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
              Leads — last 14 days
            </h2>
            <p className="text-xs text-[#7a828c]">
              <span className="font-semibold text-[#b79a6a]">{totalLeads14}</span> total
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsByDay} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={TRACK} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Leads"
                  stroke={GOLD}
                  strokeWidth={2}
                  fill="url(#leadsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </section>

      {/* ফানেল + মতামত ডোনাট — পাশাপাশি। */}
      <section className="mb-6 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AdminCard>
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
                Lead funnel
              </h2>
              <p className="text-xs text-[#7a828c]">
                Win rate{" "}
                <span className="font-semibold text-[#b79a6a]">{overview.funnel.winRate}%</span>
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={TRACK} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="stage" tick={axisTick} axisLine={false} tickLine={false} width={88} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Leads" radius={[0, 6, 6, 0]} barSize={26}>
                    {funnelData.map((entry) => (
                      <Cell key={entry.stage} fill={FUNNEL_COLORS[entry.stage]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Link
              href="/admin/leads"
              className="mt-3 inline-block text-xs font-medium text-[#b79a6a] hover:underline"
            >
              Manage leads →
            </Link>
          </AdminCard>
        </div>
        <div className="lg:col-span-2">
          <AdminCard>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
              Testimonials
            </h2>
            {testimonialPie.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#7a828c]">No testimonials yet.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={testimonialPie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="85%"
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {testimonialPie.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <ul className="mt-2 space-y-1.5">
              {[
                { name: "Approved", value: overview.content.testimonials.approved, color: GREEN },
                { name: "Pending", value: overview.content.testimonials.pending, color: GOLD },
                { name: "Hidden", value: overview.content.testimonials.hidden, color: GRAY },
              ].map((s) => (
                <li key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#b6bcc5]">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </span>
                  <span className="font-semibold text-[#f5f5f2]">{s.value}</span>
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>
      </section>

      {/* কনটেন্ট — লাইভ বনাম খসড়া, স্ট্যাকড বার। */}
      <section aria-label="Content health" className="mb-6">
        <AdminCard>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
            Content — live vs draft
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentData} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 8 }}>
                <CartesianGrid stroke={TRACK} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={92} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="live" name="Live" stackId="content" fill={GOLD} barSize={24} />
                <Bar dataKey="draft" name="Draft" stackId="content" fill="#3a4048" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-[#7a828c]">
            {overview.content.projects.featured} projects featured · Team {overview.content.team.total} members
          </p>
        </AdminCard>
      </section>

      {/* সাম্প্রতিক — নতুন লিড + নতুন মেইল পাশাপাশি। */}
      <section aria-label="Recent activity" className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
              Latest leads
            </h2>
            <Link href="/admin/leads" className="text-xs font-medium text-[#b79a6a] hover:underline">
              All →
            </Link>
          </div>
          {overview.recentLeads.length === 0 && (
            <p className="text-sm text-[#7a828c]">No leads yet.</p>
          )}
          <ul className="divide-y divide-[#2d3238]">
            {overview.recentLeads.map((l) => (
              <li key={String(l.id)} className="py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-[#f5f5f2]">{l.name}</p>
                  <span className="shrink-0 text-[11px] text-[#7a828c]">{l.status}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[#7a828c]">
                  {l.subject !== "" ? l.subject : "—"} · {fmtDate(l.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#b6bcc5]">
              Latest inbox
            </h2>
            <Link href="/admin/inbox" className="text-xs font-medium text-[#b79a6a] hover:underline">
              All →
            </Link>
          </div>
          {overview.recentInbox.length === 0 && (
            <p className="text-sm text-[#7a828c]">Inbox empty.</p>
          )}
          <ul className="divide-y divide-[#2d3238]">
            {overview.recentInbox.map((m) => (
              <li key={m.id} className="py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      m.seen ? "text-[#b6bcc5]" : "font-medium text-[#f5f5f2]"
                    }`}
                  >
                    {!m.seen && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#b79a6a]" />}
                    {m.subject}
                  </p>
                  <span className="shrink-0 text-[11px] text-[#7a828c]">
                    {fmtDate(m.receivedAt)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[#7a828c]">{m.from}</p>
              </li>
            ))}
          </ul>
        </AdminCard>
      </section>
    </>
  );
}
