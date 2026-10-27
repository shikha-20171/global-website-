import { FastifyReply, FastifyRequest } from "fastify";
import { navigationService } from "./navigation.service.js";
import { createNavItemSchema, updateNavItemSchema } from "./navigation.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class NavigationController {
  async getPublicNavigation(_request: FastifyRequest, reply: FastifyReply) {
    const nav = await navigationService.getPublicNavigation();
    return reply.status(200).send(successResponse(nav));
  }

  async listAdminNavigation(_request: FastifyRequest, reply: FastifyReply) {
    const items = await navigationService.listAdminNavigation();
    return reply.status(200).send(successResponse(items));
  }

  async createNavItem(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createNavItemSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const item = await navigationService.createNavItem(input, actorName);
    return reply.status(201).send(successResponse(item, "Navigation item created"));
  }

  async updateNavItem(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateNavItemSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Admin";

    const item = await navigationService.updateNavItem(id, input, actorName);
    return reply.status(200).send(successResponse(item, "Navigation item updated"));
  }

  async deleteNavItem(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Admin";

    const result = await navigationService.deleteNavItem(id, actorName);
    return reply.status(200).send(successResponse(result, "Navigation item deleted"));
  }
}

export const navigationController = new NavigationController();
