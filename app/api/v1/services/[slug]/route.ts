import { getServiceController } from "@/server/modules/services/services.controller";

// পাবলিক বিস্তারিত — /api/v1/services/:slug, শুধু প্রকাশিত।
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await ctx.params;
  return getServiceController(slug);
}
