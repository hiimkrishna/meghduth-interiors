// ছবি ফিল্ড — ফাইল বেছে media API-তে পাঠায়, key উপরে তুলে দেয় + প্রিভিউ।
"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { uploadMedia } from "../media/media.service";
import { resolveImageSrc } from "@/lib/image-url";
import { adminErrorMessage } from "./use-admin-list";
import { FieldErrorText, smallBtnClass } from "./admin-ui";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (key: string) => void;
  error?: string;
}

export function ImageField(props: ImageFieldProps): ReactNode {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // প্রিভিউ URL হতে পারে (আপলোডের পর) বা DB key (আগের মান) — দুটোই সমাধান করো।
  const shown: string | undefined = resolveImageSrc(preview ?? (props.value !== "" ? props.value : undefined));

  const onFile = async (file: File | undefined): Promise<void> => {
    if (file === undefined) return;
    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadMedia(file);
      setPreview(res.url);
      props.onChange(res.key);
    } catch (err: unknown) {
      setUploadError(adminErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>): void => {
    void onFile(e.target.files?.[0]);
    e.target.value = "";
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-[#b6bcc5]">
        {props.label}
      </span>
      {shown !== undefined && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shown}
          alt="Preview"
          className="mb-2 h-28 w-auto rounded-lg border border-[#2d3238] object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />
        <button
          type="button"
          className={smallBtnClass}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose image"}
        </button>
        {props.value !== "" && (
          <span className="max-w-full truncate text-xs text-[#7a828c]">
            {props.value}
          </span>
        )}
      </div>
      {uploadError !== null && (
        <p className="mt-1 text-xs text-red-400">{uploadError}</p>
      )}
      <FieldErrorText message={props.error} />
    </div>
  );
}
