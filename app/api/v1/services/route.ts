import { listServicesController } from "@/server/modules/services/services.controller";

// পাবলিক পড়া রুট — শুধু প্রকাশিত সেবা।
export async function GET(req: Request): Promise<Response> {
  const res = await listServicesController(req);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
