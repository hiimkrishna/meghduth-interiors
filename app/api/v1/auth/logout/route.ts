import { logoutController } from "@/server/modules/auth/auth.controller";

export const dynamic = "force-dynamic";

// প্রস্থান — httpOnly কুকি মুছে দাও।
export async function POST(req: Request): Promise<Response> {
  const res = new Response();
  return logoutController(req.headers.get("authorization"), req, res);
}