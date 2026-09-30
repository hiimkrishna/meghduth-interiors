import { ok } from "@/server/lib/response";

export async function GET(): Promise<Response> {
  return ok({ alive: true, time: new Date().toISOString() }, "Server is running");
}
