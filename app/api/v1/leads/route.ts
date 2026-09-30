import { createLeadController } from "@/server/modules/leads/leads.controller";

// পাবলিক লিড তৈরি — শুধু POST, বৈধতা নিয়ন্ত্রকে।
export async function POST(req: Request): Promise<Response> {
  const body: unknown = await req.json();
  return createLeadController(body);
}
