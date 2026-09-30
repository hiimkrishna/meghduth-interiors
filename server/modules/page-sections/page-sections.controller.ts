import { pageSectionsQuerySchema } from "@/packages/contracts/src/page-section.schema";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  getSectionData,
  listPageSections,
} from "@/server/modules/page-sections/page-sections.service";

// চিকন নিয়ন্ত্রক — সার্ভিস → জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function getPageSectionsController(query: {
  page: string;
  section?: string;
}): Promise<Response> {
  const reqId = withReqId();
  try {
    const parsed = pageSectionsQuerySchema.safeParse(query);
    if (!parsed.success) throw BadRequest("Invalid page or section");
    const { page, section } = parsed.data;
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
