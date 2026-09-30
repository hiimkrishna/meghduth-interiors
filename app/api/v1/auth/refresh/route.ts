import { refreshController } from "@/server/modules/auth/auth.controller";

export const dynamic = "force-dynamic";

// নবায়ন — httpOnly কুকি (meghdut_rt) থেকে ঘূর্ণন।
export async function POST(req: Request): Promise<Response> {
  const body: unknown = await req.json().catch(() => null);
  const res = new Response();
  return refreshController(body, req, res);
}
