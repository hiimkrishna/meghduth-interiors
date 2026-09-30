import { api } from "@/lib/api";
import type {
  CreateLead,
  Lead,
} from "@/packages/contracts/src/lead.schema";

// লিড জমা — POST /leads, Envelope lib/api খোলে।
export async function createLead(payload: CreateLead): Promise<Lead> {
  return api.post<Lead>("/leads", payload);
}
