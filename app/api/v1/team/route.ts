import { listTeamController } from "@/server/modules/team/team.controller";

// পাবলিক পড়া রুট — শুধু প্রকাশিত সদস্য।
export async function GET(req: Request): Promise<Response> {
  const res = await listTeamController(req);
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
