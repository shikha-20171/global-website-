import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";
import { AuditQueryInput } from "./audit.schema.js";

export class AuditService {
  async listAuditLogs(query: AuditQueryInput) {
    const where: any = {};

    if (query.module) where.module = { contains: query.module, mode: "insensitive" };
    if (query.action) where.action = { contains: query.action, mode: "insensitive" };
    if (query.entityType) where.entityType = query.entityType;
    if (query.result) where.result = query.result;

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async getAuditLogById(id: string) {
    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        adminUser: { select: { id: true, name: true, email: true } },
      },
    });

    if (!log) throw new NotFoundError("Audit log entry not found");
    return log;
  }
}

export const auditService = new AuditService();
