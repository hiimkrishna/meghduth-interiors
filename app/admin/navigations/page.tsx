// নেভিগেশন — তালিকা + নতুন + সম্পাদনা।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { NavigationItem } from "@/packages/contracts/src/site.schema";
import {
  deleteAdminNavigation,
  listAdminNavigations,
} from "@/features/admin/navigations/admin-navigations.service";
import type { AdminId } from "@/features/admin/hero-slides/hero-slides.service";
import { NavigationForm } from "@/features/admin/navigations/NavigationForm";
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

type Mode = { name: "list" } | { name: "new" } | { name: "edit"; item: NavigationItem };

export default function AdminNavigationsPage(): ReactNode {
  const { items, loading, error, reload } = useAdminList(listAdminNavigations);
  const guard = useAdminMutationGuard();
  const [mode, setMode] = useState<Mode>({ name: "list" });
  const [deletingId, setDeletingId] = useState<AdminId | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onDelete = async (id: AdminId): Promise<void> => {
    if (!window.confirm("Delete this menu item?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteAdminNavigation(id);
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
        <AdminPageHeader title={mode.name === "new" ? "New Menu Item" : "Edit Menu Item"} />
        <NavigationForm
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
        title="Navigation"
        subtitle={`${items.length} items`}
        action={
          <button type="button" className={primaryBtnClass} onClick={() => setMode({ name: "new" })}>
            New
          </button>
        }
      />
      {deleteError !== null && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
      {loading && <LoadingState />}
      {!loading && error !== null && <ErrorState message={error} onRetry={reload} />}
      {!loading && error === null && items.length === 0 && (
        <EmptyState
          text="No menu items yet"
          action={
            <button
              type="button"
              className={primaryBtnClass}
              onClick={() => setMode({ name: "new" })}
            >
              Create menu item
            </button>
          }
        />
      )}
      {!loading && error === null && items.length > 0 && (
        <AdminCard>
          <ul className="divide-y divide-[#2d3238]">
            {items.map((n) => (
              <li key={String(n.id)} className="flex flex-wrap items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-[#f5f5f2]">{n.label}</p>
                  <p className="mt-0.5 text-xs text-[#7a828c]">
                    {n.href} · Order {n.order}
                  </p>
                </div>
                <StatusBadge
                  text={n.visible ? "Visible" : "Hidden"}
                  tone={n.visible ? "green" : "gray"}
                />
                <button type="button" className={smallBtnClass} onClick={() => setMode({ name: "edit", item: n })}>
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerBtnClass}
                  disabled={deletingId === n.id}
                  onClick={() => void onDelete(n.id)}
                >
                  {deletingId === n.id ? "Deleting…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </>
  );
}
