// লিড — দুই ট্যাব: প্রজেক্ট-আলোচনা (পাইপলাইন) ও নিউজলেটার (সাবস্ক্রাইবার)।
// এক টেবিল, দুই ভিউ — তথ্য আলাদা থাকে, রিপোর্ট একসাথে হয়।
"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LEAD_STATUSES,
  LEAD_TRANSITIONS,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/packages/contracts/src/lead.schema";
import {
  listAdminLeads,
  parseLeadStatus,
  updateAdminLeadStatus,
  type LeadListParams,
} from "@/features/admin/leads/leads.service";
import type { AdminId } from "@/features/admin/hero-slides/hero-slides.service";
import { ApiError } from "@/lib/api";
import { adminErrorMessage } from "@/features/admin/shared/use-admin-list";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
  inputClass,
  smallBtnClass,
} from "@/features/admin/shared/admin-ui";

const PAGE_LIMIT = 20;

type Tab = "enquiries" | "newsletter";
type Filter = LeadStatus | "ALL";

const TAB_SOURCE: Record<Tab, LeadSource> = {
  enquiries: "contact-form",
  newsletter: "newsletter",
};

function statusTone(status: LeadStatus): "green" | "gray" | "yellow" | "red" | "blue" {
  if (status === "NEW") return "blue";
  if (status === "WON") return "green";
  if (status === "LOST") return "red";
  return "yellow";
}

function formatDate(value: Lead["createdAt"]): string {
  if (value === undefined || value === null) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminLeadsPage(): ReactNode {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("enquiries");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [page, setPage] = useState<number>(1);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const [updatingId, setUpdatingId] = useState<AdminId | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    const params: LeadListParams =
      filter === "ALL"
        ? { source: TAB_SOURCE[tab], page, limit: PAGE_LIMIT }
        : { source: TAB_SOURCE[tab], status: filter, page, limit: PAGE_LIMIT };
    const data = await listAdminLeads(params);
    setLeads(data);
  }, [filter, page, tab]);

  useEffect(() => {
    let active = true;
    load()
      .then(() => {
        if (!active) return;
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
  }, [load, nonce, router]);

  const refetch = (): void => {
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  };

  const onTab = (next: Tab): void => {
    setTab(next);
    setFilter("ALL");
    setPage(1);
    setLoading(true);
    setError(null);
    setUpdateError(null);
    setNonce((n) => n + 1);
  };

  const onFilter = (v: string): void => {
    const parsed = v === "ALL" ? "ALL" : parseLeadStatus(v);
    if (parsed === null) return;
    setFilter(parsed);
    setPage(1);
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  };

  const onTransition = async (id: AdminId, next: LeadStatus): Promise<void> => {
    setUpdatingId(id);
    setUpdateError(null);
    try {
      await updateAdminLeadStatus(id, next);
      await load();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setUpdateError(adminErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const onUnsubscribe = async (id: AdminId): Promise<void> => {
    if (!window.confirm("Unsubscribe this email from the newsletter?")) return;
    await onTransition(id, "LOST");
  };

  const hasMore = leads.length === PAGE_LIMIT;
  const tabBtn = (active: boolean): string =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-[#B79A6A] text-[#111315]"
        : "border border-[#2d3238] text-[#b6bcc5] hover:border-[#B79A6A] hover:text-[#f5f5f2]"
    }`;

  return (
    <>
      <AdminPageHeader
        title={tab === "enquiries" ? "Project Enquiries" : "Newsletter"}
        subtitle={
          tab === "enquiries"
            ? "Enquiries from the contact form"
            : "Newsletter subscribers from the footer"
        }
      />
      {/* ট্যাব — দুই ভিউ */}
      <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Lead types">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "enquiries"}
          className={tabBtn(tab === "enquiries")}
          onClick={() => onTab("enquiries")}
        >
          Project Enquiries
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "newsletter"}
          className={tabBtn(tab === "newsletter")}
          onClick={() => onTab("newsletter")}
        >
          Newsletter
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          className={`${inputClass} w-auto`}
          value={filter}
          onChange={(e) => onFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {updateError !== null && (
        <p className="mb-3 text-sm text-red-400">{updateError}</p>
      )}
      {loading && <LoadingState />}
      {!loading && error !== null && <ErrorState message={error} onRetry={refetch} />}
      {!loading && error === null && leads.length === 0 && (
        <EmptyState text={tab === "enquiries" ? "No enquiries yet" : "No subscribers yet"} />
      )}
      {!loading && error === null && leads.length > 0 && (
        <AdminCard>
          <ul className="divide-y divide-[#2d3238]">
            {tab === "enquiries"
              ? leads.map((l) => {
                  const current = parseLeadStatus(l.status) ?? "NEW";
                  const nexts = LEAD_TRANSITIONS[current];
                  return (
                    <li key={String(l.id)} className="py-3.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#f5f5f2]">
                            {l.name} · {l.email}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#7a828c]">
                            {l.subject ?? l.message}
                          </p>
                        </div>
                        <StatusBadge text={current} tone={statusTone(current)} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {LEAD_STATUSES.map((s) => {
                          const allowed = nexts.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              className={smallBtnClass}
                              disabled={!allowed || updatingId === l.id}
                              title={allowed ? `${current} → ${s}` : "Invalid transition"}
                              onClick={() => void onTransition(l.id, s)}
                            >
                              {updatingId === l.id ? "…" : s}
                            </button>
                          );
                        })}
                      </div>
                    </li>
                  );
                })
              : leads.map((l) => {
                  const current = parseLeadStatus(l.status) ?? "NEW";
                  const unsubscribed = current === "LOST";
                  return (
                    <li key={String(l.id)} className="flex flex-wrap items-center gap-3 py-3.5">
                      <div className="min-w-0 flex-1 basis-48">
                        <p className="truncate text-sm font-medium text-[#f5f5f2]">
                          {l.email}
                        </p>
                        <p className="mt-0.5 text-xs text-[#7a828c]">
                          Subscribed {formatDate(l.createdAt)}
                        </p>
                      </div>
                      <StatusBadge
                        text={unsubscribed ? "Unsubscribed" : "Subscribed"}
                        tone={unsubscribed ? "gray" : "green"}
                      />
                      <button
                        type="button"
                        className={smallBtnClass}
                        disabled={unsubscribed || updatingId === l.id}
                        title={unsubscribed ? "Already unsubscribed" : "Unsubscribe this email"}
                        onClick={() => void onUnsubscribe(l.id)}
                      >
                        {updatingId === l.id ? "…" : "Unsubscribe"}
                      </button>
                    </li>
                  );
                })}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className={smallBtnClass}
              disabled={page <= 1 || loading}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setLoading(true);
                setNonce((n) => n + 1);
              }}
            >
              Previous
            </button>
            <span className="text-xs text-[#7a828c]">Page {page}</span>
            <button
              type="button"
              className={smallBtnClass}
              disabled={!hasMore || loading}
              onClick={() => {
                setPage((p) => p + 1);
                setLoading(true);
                setNonce((n) => n + 1);
              }}
            >
              Next
            </button>
          </div>
        </AdminCard>
      )}
    </>
  );
}
