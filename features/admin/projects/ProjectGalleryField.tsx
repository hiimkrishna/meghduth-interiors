// প্রজেক্ট গ্যালারি — একবারে সর্বোচ্চ ৫ ছবি আপলোড + ভুল ছবি মোছা।
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ProjectImage } from "@/packages/contracts/src/project.schema";
import { ApiError } from "@/lib/api";
import { resolveImageSrc } from "@/lib/image-url";
import { uploadMedia } from "../media/media.service";
import {
  addAdminProjectImage,
  getAdminProject,
  removeAdminProjectImage,
} from "./admin-projects.service";
import type { AdminId } from "../hero-slides/hero-slides.service";
import { adminErrorMessage, useAdminMutationGuard } from "../shared/use-admin-list";
import {
  AdminCard,
  dangerBtnClass,
  primaryBtnClass,
  smallBtnClass,
} from "../shared/admin-ui";

// একবারে সর্বোচ্চ ৫ — সার্ভার-UI একই সীমা মানে।
export const MAX_BATCH_IMAGES = 5;

interface ProjectGalleryFieldProps {
  projectId: AdminId;
}

interface PendingFile {
  id: number;
  file: File;
  preview: string;
}

export function ProjectGalleryField(props: ProjectGalleryFieldProps): ReactNode {
  const router = useRouter();
  const guard = useAdminMutationGuard();
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const seq = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const projectId = String(props.projectId);

  const reload = useCallback(async (): Promise<void> => {
    setLoading(true);
    setLoadError(null);
    try {
      const detail = await getAdminProject(projectId);
      setImages(detail.images ?? []);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setLoadError(adminErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // পুরনো প্রিভিউ URL পরিষ্কার।
  useEffect(() => {
    const urls = pending.map((p) => p.preview);
    return () => {
      for (const u of urls) URL.revokeObjectURL(u);
    };
  }, [pending]);

  const fail = (err: unknown): void => {
    const msg = guard(err);
    if (msg !== null) setActionError(msg);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBatchError(null);
    const slots = MAX_BATCH_IMAGES - pending.length;
    // কঠোর সীমা — একবারে ৫-এর বেশি নয়।
    if (files.length > slots) {
      setBatchError(
        `You can select up to ${MAX_BATCH_IMAGES} images at a time.${slots > 0 ? ` Only ${slots} slot${slots === 1 ? "" : "s"} left.` : " Remove uploaded files from the queue first."}`,
      );
      return;
    }
    const next: PendingFile[] = files.map((file) => {
      seq.current += 1;
      return { id: seq.current, file, preview: URL.createObjectURL(file) };
    });
    setPending((prev) => [...prev, ...next]);
  };

  const dropPending = (id: number): void => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const onUpload = async (): Promise<void> => {
    if (pending.length === 0 || uploading !== null) return;
    setActionError(null);
    const queue = [...pending];
    // একটা ফাইল ফেল করলে বাকিগুলো থামে না — শেষে হিসাব দেখায়।
    const failed: string[] = [];
    try {
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (item === undefined) continue;
        setUploading(`Uploading ${i + 1} of ${queue.length}…`);
        try {
          const media = await uploadMedia(item.file);
          await addAdminProjectImage(projectId, { imageKey: media.key });
          setPending((prev) => prev.filter((p) => p.id !== item.id));
        } catch (err: unknown) {
          if (err instanceof ApiError && err.status === 401) throw err;
          failed.push(`${item.file.name}: ${adminErrorMessage(err)}`);
          setPending((prev) => prev.filter((p) => p.id !== item.id));
        }
      }
      await reload();
    } catch (err: unknown) {
      fail(err);
      return;
    } finally {
      setUploading(null);
    }
    if (failed.length > 0) {
      setActionError(
        `${queue.length - failed.length} of ${queue.length} uploaded. Failed: ${failed.join("; ")}`,
      );
    }
  };

  const onRemove = async (imageId: string | number): Promise<void> => {
    if (!window.confirm("Remove this image from the gallery?")) return;
    setRemovingId(String(imageId));
    setActionError(null);
    try {
      await removeAdminProjectImage(imageId);
      await reload();
    } catch (err: unknown) {
      fail(err);
    } finally {
      setRemovingId(null);
    }
  };

  const selectionFull = pending.length >= MAX_BATCH_IMAGES;

  return (
    <AdminCard>
      <h3 className="text-base font-semibold text-[#f5f5f2]">Gallery</h3>
      <p className="mt-1 text-xs leading-5 text-[#7a828c]">
        You can select up to {MAX_BATCH_IMAGES} images at a time. Wrong image? Remove it below anytime from Edit.
      </p>

      {/* বর্তমান গ্যালারি */}
      {loading && <p className="mt-4 text-sm text-[#7a828c]">Loading gallery…</p>}
      {!loading && loadError !== null && (
        <p className="mt-4 text-sm text-red-400">{loadError}</p>
      )}
      {!loading && loadError === null && images.length === 0 && (
        <p className="mt-4 text-sm text-[#7a828c]">No gallery images yet.</p>
      )}
      {!loading && loadError === null && images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => {
            const src = resolveImageSrc(img.imageKey);
            return (
              <div
                key={String(img.id)}
                className="relative h-28 overflow-hidden rounded-lg border border-[#2d3238]"
              >
                {src !== undefined ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={img.alt ?? "Gallery image"} className="h-full w-full object-cover" />
                ) : (
                  <div aria-hidden="true" className="h-full w-full bg-gradient-to-br from-[#232628] to-[#0c0d0e]" />
                )}
                <button
                  type="button"
                  onClick={() => void onRemove(img.id)}
                  disabled={removingId === String(img.id)}
                  aria-label={`Remove image ${img.alt ?? img.id}`}
                  className="absolute right-1.5 top-1.5 rounded-md border border-red-900 bg-black/70 px-2.5 py-1.5 text-[11px] font-medium text-red-400 hover:bg-red-950 disabled:opacity-50"
                >
                  {removingId === String(img.id) ? "…" : "Remove"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* নতুন ব্যাচ */}
      <div className="mt-5 border-t border-[#2d3238] pt-4">
        <p className="text-xs font-medium text-[#b6bcc5]">
          Add images ({pending.length} of {MAX_BATCH_IMAGES} selected)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={selectionFull || uploading !== null}
          onChange={onPick}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={smallBtnClass}
            disabled={selectionFull || uploading !== null}
            title={selectionFull ? `Maximum ${MAX_BATCH_IMAGES} at a time` : "Choose images"}
            onClick={() => inputRef.current?.click()}
          >
            Choose images
          </button>
          {pending.length > 0 && (
            <button
              type="button"
              className={primaryBtnClass}
              disabled={uploading !== null}
              onClick={() => void onUpload()}
            >
              {uploading ?? `Upload ${pending.length} image${pending.length === 1 ? "" : "s"}`}
            </button>
          )}
        </div>
        {batchError !== null && (
          <p className="mt-2 text-xs font-medium text-red-400">{batchError}</p>
        )}
        {pending.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {pending.map((p) => (
              <div
                key={p.id}
                className="relative h-20 overflow-hidden rounded-lg border border-[#B79A6A]/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt={p.file.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => dropPending(p.id)}
                  aria-label={`Remove ${p.file.name} from queue`}
                  className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {actionError !== null && (
          <p className="mt-2 text-xs text-red-400">{actionError}</p>
        )}
      </div>
    </AdminCard>
  );
}
