import { loginController } from "@/server/modules/auth/auth.controller";

export const dynamic = "force-dynamic";

// প্রবেশ — ইমেইল + পাসওয়ার্ডে টোকেন জোড়া।
export async function POST(req: Request): Promise<Response> {
  const body: unknown = await req.json().catch(() => null);
  const res = new Response();
  return loginController(body, res);
}
