// Admin Inbox — Office mail shadow: list + detail + seen + sync + reply.
"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { InboxEmail } from "@/packages/contracts/src/inbox.schema";
import {
  getInboxEmail,
  listInboxEmails,
  markInboxSeen,
  replyToInboxEmail,
  triggerInboxSync,
} from "@/features/admin/inbox/inbox.service";
import { ApiError } from "@/lib/api";
import { adminErrorMessage } from "@/features/admin/shared/use-admin-list";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
  primaryBtnClass,
  smallBtnClass,
} from "@/features/admin/shared/admin-ui";

const PAGE_LIMIT = 20;

function formatDate(value: InboxEmail["receivedAt"]): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminInboxPage(): ReactNode {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<InboxEmail[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<InboxEmail | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number>(0);
  const [marking, setMarking] = useState<boolean>(false);
  const [replyBody, setReplyBody] = useState<string>("");
  const [replying, setReplying] = useState<boolean>(false);
  const [replySent, setReplySent] = useState<boolean>(false);

  const load = useCallback(async (): Promise<void> => {
    const data = await listInboxEmails({ page, limit: PAGE_LIMIT });
    setItems(data.items);
    setUnread(data.unread);
    if (selectedId !== null) {
      const stillThere = data.items.find((m) => m.id === selectedId) ?? null;
      if (stillThere !== null) setDetail(stillThere);
    }
  }, [page, selectedId]);

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

  // Auto-sync on mount (every 2 minutes, fails silently)
  useEffect(() => {
    let last = 0;
    try {
      last = Number(window.localStorage.getItem("meghdut_inbox_last_sync") ?? 0);
    } catch {
      return;
    }
    if (!Number.isFinite(last)) last = 0;
    if (Date.now() - last < 2 * 60 * 1000) return;
    let cancelled = false;

    const doSync = async (): Promise<void> => {
      try {
        await triggerInboxSync();
        if (cancelled) return;
        try {
          window.localStorage.setItem("meghdut_inbox_last_sync", String(Date.now()));
        } catch {
          // Ignore storage errors
        }
      } catch {
        // Silent failure
      } finally {
        if (!cancelled) {
          setLoading(true);
          setNonce((n) => n + 1);
        }
      };
    };

    doSync();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSelect = async (id: number): Promise<void> => {
    setSelectedId(id);
    setActionError(null);
    setReplyBody("");
    setReplySent(false);
    const cached = items.find((m) => m.id === id) ?? null;
    if (cached !== null) setDetail(cached);
    setDetailLoading(true);
    try {
      const full = await getInboxEmail(id);
      setDetail(full);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setActionError(adminErrorMessage(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const onMark = async (id: number, seen: boolean): Promise<void> => {
    setMarking(true);
    setActionError(null);
    try {
      const updated = await markInboxSeen(id, seen);
      setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setDetail((prev) => (prev !== null && prev.id === id ? updated : prev));
      setUnread((u) => Math.max(0, u + (seen ? -1 : 1)));
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setActionError(adminErrorMessage(err));
    } finally {
      setMarking(false);
    }
  };

  const onSync = async (): Promise<void> => {
    setSyncing(true);
    setSyncMsg(null);
    setActionError(null);
    try {
      const res = await triggerInboxSync();
      setSyncMsg("Synced " + res.synced + " of " + res.total);
      setLoading(true);
      setNonce((n) => n + 1);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setActionError(adminErrorMessage(err));
    } finally {
      setSyncing(false);
    }
  };

  const onReply = async (): Promise<void> => {
    if (selected === null || replying) return;
    if (replyBody.trim() === "") {
      setActionError("Write your reply first.");
      return;
    }
    setReplying(true);
    setActionError(null);
    try {
      const updated = await replyToInboxEmail(selected.id, replyBody.trim());
      setDetail(updated);
      setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setReplyBody("");
      setReplySent(true);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setActionError(adminErrorMessage(err));
    } finally {
      setReplying(false);
    }
  };

  const hasMore = items.length === PAGE_LIMIT;
  const selected = detail !== null && detail.id === selectedId ? detail : null;

  return (
    <div>
      <AdminPageHeader
        title="Inbox"
        subtitle="Office mail — read-only copy"
        action={
          <>
            {unread > 0 && <StatusBadge text={unread + " unread"} tone="yellow" />}
            <button
              type="button"
              className={primaryBtnClass}
              disabled={syncing || loading}
              onClick={() => void onSync()}
            >
              {syncing ? "Syncing…" : "Sync now"}
            </button>
          </>
        }
      />
      {syncMsg !== null && <p className="mb-3 text-xs text-[#7a828c]">{syncMsg}</p>}
      {actionError !== null && <p className="mb-3 text-sm text-red-400">{actionError}</p>}
      {loading && <LoadingState />}
      {!loading && error !== null && <ErrorState message={error} onRetry={refetch} />}
      {!loading && error === null && items.length === 0 && (
        <EmptyState text="No emails yet — press Sync now" />
      )}
      {!loading && error === null && items.length > 0 && (
        <>
          <AdminCard>
            <ul className="divide-y divide-[#2d3238]">
              {items.map((m) => {
                const active = m.id === selectedId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => void onSelect(m.id)}
                      className={`block w-full rounded-lg px-3 py-3 text-left transition-colors ${active ? "bg-[#20242a]" : "hover:bg-[#20242a]/60"} ${!m.seen ? "border-l-2 border-l-[#b79a6a]" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${!m.seen ? "font-semibold text-[#f5f5f2]" : "text-[#b6bcc5]"} `}>
                          {m.from === "" ? "(unknown sender)" : m.from}
                        </p>
                        {!m.seen && <StatusBadge text="Unread" tone="yellow" />}
                      </div>
                      <p className={`mt-0.5 truncate text-sm ${!m.seen ? "text-[#f5f5f2]" : "text-[#b6bcc5]"} `}>
                        {m.subject === "" ? "(no subject)" : m.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-[#7a828c]">{formatDate(m.receivedAt)}</p>
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
          <AdminCard>
            {selected === null && !detailLoading && (
              <p className="py-10 text-center text-sm text-[#7a828c]">
                Select an email to read
              </p>
            )}
            {detailLoading && selected === null && (
              <p className="py-10 text-center text-sm text-[#7a828c]">Loading…</p>
            )}
            {selected !== null && (
              <div>
                <p className="text-base font-semibold text-[#f5f5f2]">
                  {selected.subject === "" ? "(no subject)" : selected.subject}
                </p>
                <p className="mt-1 text-xs text-[#7a828c]">From: {selected.from}</p>
                <p className="mt-0.5 text-xs text-[#7a828c]">
                  To: {selected.to === "" ? "—" : selected.to}
                </p>
                <p className="mt-0.5 text-xs text-[#7a828c]">{formatDate(selected.receivedAt)}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className={smallBtnClass}
                    disabled={marking}
                    onClick={() => void onMark(selected.id, !selected.seen)}
                  >
                    {marking ? "…" : selected.seen ? "Mark unread" : "Mark read"}
                  </button>
                  {selected.replied === true && (
                    <StatusBadge text="Replied" tone="green" />
                  )}
                </div>
                <pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[#2d3238] bg-[#111315] p-4 font-sans text-sm leading-6 text-[#f5f5f2]">
                  {selected.body === "" ? "(empty body)" : selected.body}
                </pre>
                <div className="mt-4 border-t border-[#2d3238] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#b6bcc5]">
                    Reply to {selected.from === "" ? "sender" : selected.from}
                  </p>
                  {replySent ? (
                    <p className="mt-2 text-sm text-emerald-400">
                      Reply sent — the sender will receive it by email.
                    </p>
                  ) : (
                    <>
                      <textarea
                        rows={4}
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder="Write your reply…"
                        aria-label="Reply message"
                        className="mt-2 w-full rounded-lg border border-[#2d3238] bg-[#111315] px-3.5 py-2.5 text-sm text-[#f5f5f2] placeholder:text-[#7a828c] focus:border-[#b79a6a] focus:outline-none"
                      />
                      <div className="mt-2">
                        <button
                          type="button"
                          className={primaryBtnClass}
                          disabled={replying || replyBody.trim() === ""}
                          onClick={() => void onReply()}
                        >
                          {replying ? "Sending…" : "Send reply"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </AdminCard>
        </>
      )}
    </div>
  );
}