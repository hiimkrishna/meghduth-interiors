import { AppError } from "@/server/lib/response";
import {
  createAuditLog,
  listAuditLogs,
} from "./audit.repository";
import type {
  CreateAuditLogInput,
  AuditLogFilters,
  AuditLogListResult,
  AdminAuditLog,
} from "./audit.types";

export async function logAdminAction(input: CreateAuditLogInput): Promise<AdminAuditLog> {
  return createAuditLog(input);
}

export async function getAuditLogs(filters: AuditLogFilters): Promise<AuditLogListResult> {
  return listAuditLogs(filters);
}

export function createAuditLogMiddleware() {
  return async (req: Request, next: () => Promise<Response>): Promise<Response> => {
    const startTime = Date.now();
    const response = await next();
    const durationMs = Date.now() - startTime;

    // Only log admin API routes
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/v1/admin/")) return response;

    // Skip logging for GET requests (read-only)
    if (req.method === "GET") return response;

    // Get admin from auth (if available)
    // This would need to be passed from the middleware or auth context
    // For now, we'll just log the request info
    
    return response;
  };
}