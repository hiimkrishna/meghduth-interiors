// দল — তালিকা + নতুন + সম্পাদনা।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { TeamMember } from "@/packages/contracts/src/team.schema";
import {
  deleteAdminTeamMember,
  listAdminTeam,
} from "@/features/admin/team/admin-team.service";
import type { AdminId } from "@/features/admin/hero-slides/hero-slides.service";
import { TeamForm } from "@/features/admin/team/TeamForm";
import {
  useAdminList,
  useAdminMutationGuard,
} from "@/features/admin/shared/use-admin-list";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
  dangerBtnClass,
  primaryBtnClass,
  smallBtnClass,
} from "@/features/admin/shared/admin-ui";

type Mode = { name: "list" } | { name: "new" } | { name: "edit"; item: TeamMember };

export default function AdminTeamPage(): ReactNode {
  const { items, loading, error, reload } = useAdminList(listAdminTeam);
  const guard = useAdminMutationGuard();
  const [mode, setMode] = useState<Mode>({ name: "list" });
  const [deletingId, setDeletingId] = useState<AdminId | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onDelete = async (id: AdminId): Promise<void> => {
    if (!window.confirm("Delete this team member?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteAdminTeamMember(id);
      reload();
    } catch (err: unknown) {
      const msg = guard(err);
      if (msg !== null) setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const done = (): void => {
    setMode({ name: "list" });
    reload();
  };

  if (mode.name !== "list") {
    return (
      <>
        <AdminPageHeader title={mode.name === "new" ? "New Team Member" : "Edit Team Member"} />
        <TeamForm
          initial={mode.name === "edit" ? mode.item : undefined}
          onDone={done}
          onCancel={() => setMode({ name: "list" })}
        />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Team"
        subtitle={`${items.length} members`}
        action={
          <button type="button" className={primaryBtnClass} onClick={() => setMode({ name: "new" })}>
            New
          </button>
        }
      />
      {deleteError !== null && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
      {loading && <LoadingState />}
      {!loading && error !== null && <ErrorState message={error} onRetry={reload} />}
      {!loading && error === null && items.length === 0 && <EmptyState text="No team members yet" />}
      {!loading && error === null && items.length > 0 && (
        <AdminCard>
          <ul className="divide-y divide-[#2d3238]">
            {items.map((m) => (
              <li key={String(m.id)} className="flex flex-wrap items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-[#f5f5f2]">{m.name}</p>
                  <p className="mt-0.5 text-xs text-[#7a828c]">
                    {m.designation} · Order {m.order ?? 0}
                  </p>
                </div>
                <StatusBadge
                  text={m.published === true ? "Published" : "Draft"}
                  tone={m.published === true ? "green" : "gray"}
                />
                <button type="button" className={smallBtnClass} onClick={() => setMode({ name: "edit", item: m })}>
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerBtnClass}
                  disabled={deletingId === m.id}
                  onClick={() => void onDelete(m.id)}
                >
                  {deletingId === m.id ? "Deleting…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </>
  );
}
