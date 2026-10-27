import { FastifyReply, FastifyRequest } from "fastify";
import { pricingService } from "./pricing.service.js";
import { createProductPlanSchema, updateProductPlanSchema } from "./pricing.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class PricingController {
  // Public
  async getPublicPricing(_request: FastifyRequest, reply: FastifyReply) {
    const pricing = await pricingService.getPublicPricing();
    return reply.status(200).send(successResponse(pricing));
  }

  // Admin
  async listAdminPlans(_request: FastifyRequest, reply: FastifyReply) {
    const plans = await pricingService.listAdminPlans();
    return reply.status(200).send(successResponse(plans));
  }

  async createPlan(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createProductPlanSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await pricingService.createPlan(input, actorName);
    return reply.status(201).send(successResponse(created, "Pricing plan created successfully"));
  }

  async updatePlan(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateProductPlanSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await pricingService.updatePlan(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Pricing plan updated successfully"));
  }

  async deletePlan(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await pricingService.deletePlan(id, actorName);
    return reply.status(200).send(successResponse(result, "Pricing plan deleted successfully"));
  }
}

export const pricingController = new PricingController();
