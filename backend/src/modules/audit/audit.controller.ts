import { FastifyReply, FastifyRequest } from "fastify";
import { auditService } from "./audit.service.js";
import { auditQuerySchema } from "./audit.schema.js";
import { successResponse } from "../../shared/response.js";

export class AuditController {
  async listLogs(request: FastifyRequest, reply: FastifyReply) {
    const query = auditQuerySchema.parse(request.query);
    const result = await auditService.listAuditLogs(query);
    return reply.status(200).send(
      successResponse(result.items, "Audit trail retrieved", {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    );
  }

  async getLogById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const log = await auditService.getAuditLogById(id);
    return reply.status(200).send(successResponse(log));
  }
}

export const auditController = new AuditController();
