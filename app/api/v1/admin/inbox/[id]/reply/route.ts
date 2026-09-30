import { replyEmailController } from "@/server/modules/inbox/inbox.controller";

export const dynamic = "force-dynamic";

// মেইলের উত্তর — POST /api/v1/admin/inbox/[id]/reply { body }
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return replyEmailController(req, id);
}
