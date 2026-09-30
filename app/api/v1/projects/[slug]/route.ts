import { getProjectController } from "@/server/modules/projects/projects.controller";

// পাবলিক বিস্তারিত — /api/v1/projects/:slug, শুধু প্রকাশিত।
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await ctx.params;
  return getProjectController(slug);
}
