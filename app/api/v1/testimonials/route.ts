import { listTestimonialsController } from "@/server/modules/testimonials/testimonials.controller";

// পাবলিক পড়া রুট — শুধু অনুমোদিত মতামত।
export async function GET(req: Request): Promise<Response> {
  const res = await listTestimonialsController(req);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
