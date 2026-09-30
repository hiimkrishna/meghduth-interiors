import { listNavigationsController } from "@/server/modules/navigations/navigations.controller";

// পাবলিক পড়া রুট — শুধু দৃশ্যমান লিংক।
export async function GET(req: Request): Promise<Response> {
  const res = await listNavigationsController(req);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
