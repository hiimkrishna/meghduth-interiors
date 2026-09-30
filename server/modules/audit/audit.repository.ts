import { desc, eq, and, gte, lte, sql, count } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { adminAuditLogs, type AdminAuditLogRow, type NewAdminAuditLogRow } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";
import type { CreateAuditLogInput, AuditLogFilters, AuditLogListResult } from "./audit.types";

const requireDb = (): NonNullable<ReturnType<typeof getDb>> => {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
};

export async function createAuditLog(input: CreateAuditLogInput): Promise<AdminAuditLogRow> {
  const db = requireDb();
  const row: NewAdminAuditLogRow = {
    adminId: input.adminId,
    adminEmail: input.adminEmail,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId ?? null,
    oldData: input.oldData ?? null,
    newData: input.newData ?? null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  };
  const inserted = await db.insert(adminAuditLogs).values(row).returning();
  if (inserted.length === 0) throw new AppError("INTERNAL", 500, "Failed to create audit log");
  return inserted[0] as AdminAuditLogRow;
}

export async function listAuditLogs(filters: AuditLogFilters): Promise<AuditLogListResult> {
  const db = requireDb();
  const page = filters.page ?? 1;
  const limit = Math.min(filters.limit ?? 50, 100);
  const offset = (page - 1) * limit;

  const conditions = [];
  if (filters.adminId) conditions.push(eq(adminAuditLogs.adminId, filters.adminId));
  if (filters.action) conditions.push(eq(adminAuditLogs.action, filters.action));
  if (filters.resourceType) conditions.push(eq(adminAuditLogs.resourceType, filters.resourceType));
  if (filters.resourceId) conditions.push(eq(adminAuditLogs.resourceId, filters.resourceId));
  if (filters.fromDate) conditions.push(gte(adminAuditLogs.createdAt, filters.fromDate));
  if (filters.toDate) conditions.push(lte(adminAuditLogs.createdAt, filters.toDate));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(adminAuditLogs)
      .where(whereClause)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(adminAuditLogs)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}