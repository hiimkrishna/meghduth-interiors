import {
  pageKeySchema,
  upsertPageSectionSchema,
} from "@/packages/contracts/src/page-section.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  getSectionData,
  listPageSections,
  upsertSectionData,
} from "@/server/modules/page-sections/page-sections.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const parsedPage = pageKeySchema.safeParse(url.searchParams.get("page") ?? "");
    if (!parsedPage.success) throw BadRequest("Invalid page");
    const page = parsedPage.data;
    const section = url.searchParams.get("section") ?? undefined;
    if (section !== undefined) {
      const data = await getSectionData(page, section);
      return ok({ page, section, data });
    }
    const sections = await listPageSections(page);
    return ok({ page, sections });
  } catch (err) {
    return fail(err, reqId);
  }
}

export async function PUT(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const body: unknown = await req.json().catch(() => null);
    const parsed = upsertPageSectionSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid page section data");
    const saved = await upsertSectionData(parsed.data);
    return ok(saved, "Saved");
  } catch (err) {
    return fail(err, reqId);
  }
}
