import {
  getInboxEmailController,
  markSeenController,
} from "@/server/modules/inbox/inbox.controller";

export const dynamic = "force-dynamic";

// অ্যাডমিন ইনবক্স — একটা মেইল পড়ো।
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return getInboxEmailController(req, id);
}

// অ্যাডমিন ইনবক্স — seen বদলাও { seen }।
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return markSeenController(req, id);
}
