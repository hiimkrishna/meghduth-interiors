// মতামত — তালিকা + নতুন + অনুমোদন (সম্পাদনা)।
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Testimonial } from "@/packages/contracts/src/testimonial.schema";
import {
  deleteAdminTestimonial,
  listAdminTestimonials,
} from "@/features/admin/testimonials/admin-testimonials.service";
import type { AdminId } from "@/features/admin/hero-slides/hero-slides.service";
import { TestimonialForm } from "@/features/admin/testimonials/TestimonialForm";
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

type Mode = { name: "list" } | { name: "new" } | { name: "edit"; item: Testimonial };

export default function AdminTestimonialsPage(): ReactNode {
  const { items, loading, error, reload } = useAdminList(listAdminTestimonials);
  const guard = useAdminMutationGuard();
  const [mode, setMode] = useState<Mode>({ name: "list" });
  const [deletingId, setDeletingId] = useState<AdminId | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onDelete = async (id: AdminId): Promise<void> => {
    if (!window.confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteAdminTestimonial(id);
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
        <AdminPageHeader title={mode.name === "new" ? "New Testimonial" : "Edit Testimonial"} />
        <TestimonialForm
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
        title="Testimonials"
        subtitle={`${items.length} testimonials`}
        action={
          <button type="button" className={primaryBtnClass} onClick={() => setMode({ name: "new" })}>
            New
          </button>
        }
      />
      {deleteError !== null && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
      {loading && <LoadingState />}
      {!loading && error !== null && <ErrorState message={error} onRetry={reload} />}
      {!loading && error === null && items.length === 0 && <EmptyState text="No testimonials yet" />}
      {!loading && error === null && items.length > 0 && (
        <AdminCard>
          <ul className="divide-y divide-[#2d3238]">
            {items.map((t) => (
              <li key={String(t.id)} className="flex flex-wrap items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-[#f5f5f2]">
                    {t.name} · ★{t.rating}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#7a828c]">{t.text}</p>
                </div>
                <StatusBadge
                  text={t.status}
                  tone={t.status === "approved" ? "green" : t.status === "hidden" ? "red" : "yellow"}
                />
                {t.published === true && <StatusBadge text="Published" tone="blue" />}
                <button type="button" className={smallBtnClass} onClick={() => setMode({ name: "edit", item: t })}>
                  Edit
                </button>
                <button
                  type="button"
                  className={dangerBtnClass}
                  disabled={deletingId === t.id}
                  onClick={() => void onDelete(t.id)}
                >
                  {deletingId === t.id ? "Deleting…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </>
  );
}
