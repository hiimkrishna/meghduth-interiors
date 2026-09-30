import { api } from "@/lib/api";

// মিডিয়া আপলোড — multipart `file` পাঠায়, {key, url} ফেরত।
export interface MediaUploadResult {
  key: string;
  url: string;
}

export async function uploadMedia(file: File): Promise<MediaUploadResult> {
  const form = new FormData();
  form.append("file", file);
  return api.post<MediaUploadResult>("/admin/media", form);
}
