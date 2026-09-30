import { listHeroSlidesController } from "@/server/modules/hero-slides/hero-slides.controller";

// পাবলিক পড়া রুট — শুধু প্রকাশিত স্লাইড।
export async function GET(req: Request): Promise<Response> {
  const res = await listHeroSlidesController(req);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
