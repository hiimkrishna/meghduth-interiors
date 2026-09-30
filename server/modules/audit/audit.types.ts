import type { AdminAuditLogRow, NewAdminAuditLogRow } from "@/server/db/drizzle-schema";

export interface AdminAuditLog extends AdminAuditLogRow {}

export interface CreateAuditLogInput {
  adminId: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilters {
  adminId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface AuditLogListResult {
  items: AdminAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}