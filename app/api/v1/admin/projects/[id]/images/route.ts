import { createProjectImageSchema } from "@/packages/contracts/src/project.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { addProjectImage } from "@/server/modules/projects/projects.service";

export const dynamic = "force-dynamic";

// প্রজেক্টে ছবি যোগ — {imageKey, alt?, order?}।
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body: unknown = await req.json().catch(() => null);
    const parsed = createProjectImageSchema.safeParse(
      typeof body === "object" && body !== null ? { ...(body as object), projectId: id } : { projectId: id },
    );
    if (!parsed.success) throw BadRequest("Invalid image data");
    const image = await addProjectImage(id, {
      imageKey: parsed.data.imageKey,
      ...(parsed.data.alt !== undefined ? { alt: parsed.data.alt } : {}),
      ...(parsed.data.order !== undefined ? { order: parsed.data.order } : {}),
    });
    return ok(image, "Image added", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
