// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
// media_assets — কলাম: id (uuid, pk) | key (unique) | url | mime | size | width | height | created_at
export const MEDIA_ASSETS_TABLE = "media_assets" as const;

// মিডিয়া সারি — চুক্তিতে নেই, সরাসরি সংজ্ঞা।
export interface MediaAssetRow {
  id: string;
  key: string;
  url: string;
  mime: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}
