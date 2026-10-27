import { prisma } from "../config/database.js";
import { AuditResult } from "@prisma/client";

export interface CreateAuditLogParams {
  adminUserId?: string;
  adminName: string;
  action: string;
  module: string;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  metadata?: any;
  result?: AuditResult;
}

export async function logAuditEvent(params: CreateAuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminUserId: params.adminUserId,
        adminName: params.adminName,
        action: params.action,
        module: params.module,
        entityType: params.entityType,
        entityId: params.entityId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        details: params.details,
        metadata: params.metadata,
        result: params.result || AuditResult.SUCCESS,
      },
    });
  } catch (error) {
    console.error("[AuditLog] Failed to record audit event:", error);
  }
}
