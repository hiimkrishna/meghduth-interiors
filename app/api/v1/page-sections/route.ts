import { getPageSectionsController } from "@/server/modules/page-sections/page-sections.controller";

// পাবলিক পড়া রুট — কেন্দ্রীয় পেজ-সেকশন।
// ?page=about → সব সেকশন; ?page=about&section=hero → এক সেকশন।
// বৈধতা নিয়ন্ত্রকে (অবৈধ page/section → 400)।
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const res = await getPageSectionsController({
    page: url.searchParams.get("page") ?? "",
    section: url.searchParams.get("section") ?? undefined,
  });
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
