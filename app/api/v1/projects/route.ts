import { listProjectsController } from "@/server/modules/projects/projects.controller";

// পাবলিক পড়া রুট — শুধু প্রকাশিত প্রজেক্ট।
export async function GET(req: Request): Promise<Response> {
  const res = await listProjectsController(req);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
