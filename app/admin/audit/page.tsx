"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AdminPageHeader, AdminCard, LoadingState, EmptyState, smallBtnClass, StatusBadge } from "@/features/admin/shared/admin-ui";

interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface AuditPageData {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PAGE_LIMIT = 20;

export default function AdminAuditPage() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [actionFilter, setActionFilter] = useState<string>("");
  const [resourceFilter, setResourceFilter] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });
      if (actionFilter) params.set("action", actionFilter);
      if (resourceFilter) params.set("resourceType", resourceFilter);
      
      const data = await api.get<AuditPageData>(`/api/v1/admin/audit?${params.toString()}`);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, resourceFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const refetch = () => load();

  const hasMore = page < Math.ceil(total / PAGE_LIMIT) && total > 0;

  const formatAction = (action: string) => {
    const colors: Record<string, "green" | "yellow" | "red" | "blue" | "gray"> = {
      create: "green",
      update: "blue",
      delete: "red",
      login: "green",
      logout: "gray",
    };
    return <StatusBadge text={action} tone={colors[action] || "gray"} />;
  };

  return (
    <div>
      <AdminPageHeader
        title="Audit Log"
        subtitle="Track all admin actions"
      />
      {loading && <LoadingState />}
      {!loading && error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {!loading && items.length === 0 && <EmptyState text="No audit logs found" />}

      {!loading && !error && items.length > 0 && (
        <AdminCard>
          <div className="mb-4 flex flex-wrap gap-3">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg border border-[#2d3238] bg-[#111315] px-3 py-2 text-sm text-[#f5f5f2] focus:border-[#b79a6a] focus:outline-none"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="rounded-lg border border-[#2d3238] bg-[#111315] px-3 py-2 text-sm text-[#f5f5f2] focus:border-[#b79a6a] focus:outline-none"
            >
              <option value="">All Resources</option>
              <option value="hero_slide">Hero Slides</option>
              <option value="service">Services</option>
              <option value="project">Projects</option>
              <option value="team_member">Team</option>
              <option value="testimonial">Testimonials</option>
              <option value="navigation">Navigation</option>
              <option value="site_settings">Settings</option>
              <option value="lead">Leads</option>
              <option value="inbox">Inbox</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3238]">
                  <th className="text-left py-2 px-3 font-semibold text-[#b6bcc5]">Time</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#b6bcc5]">Admin</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#b6bcc5]">Action</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#b6bcc5]">Resource</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#b6bcc5]">ID</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#b6bcc5]">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3238]">
                {items.map((log) => (
                  <tr key={log.id} className="hover:bg-[#20242a]/50">
                    <td className="py-2 px-3 text-[#7a828c]">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 px-3 text-[#f5f5f2] truncate max-w-[150px]">{log.adminEmail}</td>
                    <td className="py-2 px-3">{formatAction(log.action)}</td>
                    <td className="py-2 px-3 text-[#b6bcc5]">{log.resourceType}</td>
                    <td className="py-2 px-3 text-[#7a828c] font-mono text-xs">
                      {log.resourceId || "—"}
                    </td>
                    <td className="py-2 px-3 text-[#7a828c] font-mono text-xs">
                      {log.ipAddress || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className={smallBtnClass}
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-xs text-[#7a828c]">
              Page {page} of {Math.ceil(total / PAGE_LIMIT)} ({total} total)
            </span>
            <button
              type="button"
              className={smallBtnClass}
              disabled={!hasMore || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </AdminCard>
      )}
    </div>
  );
}