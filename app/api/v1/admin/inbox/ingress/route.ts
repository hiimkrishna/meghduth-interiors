import { ingressEmailController } from "@/server/modules/inbox/inbox.controller";

export const dynamic = "force-dynamic";

// ইনবাউন্ড webhook — বাইরের provider (Postmark/SendGrid/Mailgun) থেকে আসে।
// প্রমাণ: x-ingress-secret হেডার (INGRESS_SECRET-এর সাথে মিলতে হবে)।
export async function POST(req: Request): Promise<Response> {
  return ingressEmailController(req);
}
