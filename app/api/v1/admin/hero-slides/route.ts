import { createHeroSlideSchema } from "@/packages/contracts/src/hero.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { createHeroSlide, listAllHeroSlides } from "@/server/modules/hero-slides/hero-slides.service";

export const dynamic = "force-dynamic";

// অ্যাডমিন তালিকা — সব স্লাইড (প্রকাশিত/অপ্রকাশিত)।
export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const items = await listAllHeroSlides();
    return ok(items, undefined, { total: items.length, page: 1, limit: items.length, totalPages: 1 });
  } catch (err) {
    return fail(err, reqId);
  }
}

// অ্যাডমিন তৈরি — contracts স্কিমায় যাচাই, ২০১।
export async function POST(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const body: unknown = await req.json().catch(() => null);
    const parsed = createHeroSlideSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid hero slide data");
    const item = await createHeroSlide(parsed.data);
    return ok(item, "Created", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
