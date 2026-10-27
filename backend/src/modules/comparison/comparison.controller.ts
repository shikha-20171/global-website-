import { FastifyReply, FastifyRequest } from "fastify";
import { comparisonService } from "./comparison.service.js";
import {
  createAttributeSchema,
  updateAttributeSchema,
  setComparisonValueSchema,
} from "./comparison.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class ComparisonController {
  // Public
  async getMatrix(_request: FastifyRequest, reply: FastifyReply) {
    const matrix = await comparisonService.getComparisonMatrix();
    return reply.status(200).send(successResponse(matrix));
  }

  // Admin
  async listAttributes(_request: FastifyRequest, reply: FastifyReply) {
    const attrs = await comparisonService.listAttributes();
    return reply.status(200).send(successResponse(attrs));
  }

  async createAttribute(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createAttributeSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await comparisonService.createAttribute(input, actorName);
    return reply.status(201).send(successResponse(created, "Comparison attribute created"));
  }

  async updateAttribute(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateAttributeSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await comparisonService.updateAttribute(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Comparison attribute updated"));
  }

  async deleteAttribute(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await comparisonService.deleteAttribute(id, actorName);
    return reply.status(200).send(successResponse(result, "Comparison attribute deleted"));
  }

  async setComparisonValue(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = setComparisonValueSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await comparisonService.setComparisonValue(input, actorName);
    return reply.status(200).send(successResponse(updated, "Comparison value configured"));
  }
}

export const comparisonController = new ComparisonController();
