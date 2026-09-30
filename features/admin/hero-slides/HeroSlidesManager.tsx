// হিরো স্লাইড ম্যানেজার — তালিকা + নতুন + সম্পাদনা। সর্বোচ্চ MAX_HERO_SLIDES (৬)।
// শেয়ার্ড কম্পোনেন্ট: Homepage ট্যাবের ভেতরে বসে (app/admin/homepage)।
"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MAX_HERO_SLIDES } from "@/packages/contracts/src/hero.schema";
import type { HeroSlide } from "@/packages/contracts/src/hero.schema";
import {
  deleteHeroSlide,
  listHeroSlides,
  type AdminId,
} from "@/features/admin/hero-slides/hero-slides.service";
import { HeroSlideForm } from "@/features/admin/hero-slides/HeroSlideForm";
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
  Modal,
  StatusBadge,
  dangerBtnClass,
  primaryBtnClass,
  smallBtnClass,
} from "@/features/admin/shared/admin-ui";

type Mode = { name: "list" } | { name: "new" } | { name: "edit"; item: HeroSlide };

export default function HeroSlidesManager(): ReactNode {
  const { items, loading, error, reload } = useAdminList(listHeroSlides);
  const guard = useAdminMutationGuard();
  const [mode, setMode] = useState<Mode>({ name: "list" });
  const [deletingId, setDeletingId] = useState<AdminId | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [limitOpen, setLimitOpen] = useState<boolean>(false);
  const prevCount = useRef<number | null>(null);

  const isFull = items.length >= MAX_HERO_SLIDES;

  // ৬-এ পৌঁছানো মাত্র সতর্কতা ডায়ালগ (প্রথম লোডে নয়, শুধু নতুন যোগে)।
  useEffect(() => {
    if (loading) return;
    if (prevCount.current === null) {
      prevCount.current = items.length;
      return;
    }
    if (prevCount.current < MAX_HERO_SLIDES && items.length >= MAX_HERO_SLIDES) {
      setLimitOpen(true);
    }
    prevCount.current = items.length;
  }, [items.length, loading]);

  const onDelete = async (id: AdminId): Promise<void> => {
    if (!window.confirm("Delete this slide?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteHeroSlide(id);
      reload();
    } catch (err: unknown) {
      const msg = guard(err);
      if (msg !== null) setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const onAdd = (): void => {
    // পূর্ণ থাকলে বাটন নিষ্ক্রিয় চেহারায় থাকে, ক্লিকে ডায়ালগ আসে।
    if (isFull) {
      setLimitOpen(true);
      return;
    }
    setMode({ name: "new" });
  };

  const done = (): void => {
    setMode({ name: "list" });
    reload();
  };

  if (mode.name === "new") {
    return (
      <>
        <AdminPageHeader title="New Slide" />
        <HeroSlideForm onDone={done} onCancel={() => setMode({ name: "list" })} />
      </>
    );
  }

  if (mode.name === "edit") {
    return (
      <>
        <AdminPageHeader title="Edit Slide" />
        <HeroSlideForm
          initial={mode.item}
          onDone={done}
          onCancel={() => setMode({ name: "list" })}
        />
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Hero Slides"
        subtitle={`${items.length} of ${MAX_HERO_SLIDES} slides — you can add up to ${MAX_HERO_SLIDES} images for the slideshow.`}
        action={
          <button
            type="button"
            className={`${primaryBtnClass} ${isFull ? "opacity-50" : ""}`}
            aria-disabled={isFull}
            title={isFull ? `Maximum ${MAX_HERO_SLIDES} slides reached` : "Add a new slide"}
            onClick={onAdd}
          >
            New
          </button>
        }
      />
      {deleteError !== null && (
        <p className="mb-3 text-sm text-red-400">{deleteError}</p>
      )}
      {loading && <LoadingState />}
      {!loading && error !== null && (
        <ErrorState message={error} onRetry={reload} />
      )}
      {!loading && error === null && items.length === 0 && (
        <EmptyState text="No slides yet" />
      )}
      {!loading && error === null && items.length > 0 && (
        <AdminCard>
          <motion.ul layout className="divide-y divide-[#2d3238]">
            <AnimatePresence>
              {items.map((s) => (
                <motion.li
                  key={String(s.id)}
                  layout
                  style={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-wrap items-center gap-3 py-3.5"
                >
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="truncate text-sm font-medium text-[#f5f5f2]">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#7a828c]">
                      {s.badge} · Order {s.order ?? 0}
                    </p>
                  </div>
                  <StatusBadge
                    text={s.published === true ? "Published" : "Draft"}
                    tone={s.published === true ? "green" : "gray"}
                  />
                  <button
                    type="button"
                    className={smallBtnClass}
                    onClick={() => setMode({ name: "edit", item: s })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={dangerBtnClass}
                    disabled={deletingId === s.id}
                    onClick={() => void onDelete(s.id)}
                  >
                    {deletingId === s.id ? "Deleting…" : "Delete"}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </AdminCard>
      )}
      <Modal
        open={limitOpen}
        title="Slide limit reached"
        message={`You can add a maximum of ${MAX_HERO_SLIDES} images to the hero slideshow. Delete or replace an existing slide to add a new one.`}
        actionLabel="Got it"
        onClose={() => setLimitOpen(false)}
      />
    </>
  );
}
