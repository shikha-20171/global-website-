import { FastifyReply, FastifyRequest } from "fastify";
import { legalService } from "./legal.service.js";
import { updateLegalPolicySchema } from "./legal.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class LegalController {
  async getPublicPolicy(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const policy = await legalService.getPublicPolicyBySlug(slug);
    return reply.status(200).send(successResponse(policy));
  }

  async listPublicPolicies(_request: FastifyRequest, reply: FastifyReply) {
    const policies = await legalService.listPublicPolicies();
    return reply.status(200).send(successResponse(policies));
  }

  async listAdminPolicies(_request: FastifyRequest, reply: FastifyReply) {
    const policies = await legalService.listAdminPolicies();
    return reply.status(200).send(successResponse(policies));
  }

  async updatePolicy(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateLegalPolicySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const updated = await legalService.updatePolicy(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Legal policy updated"));
  }
}

export const legalController = new LegalController();
