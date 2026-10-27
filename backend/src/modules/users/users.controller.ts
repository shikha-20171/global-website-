import { FastifyReply, FastifyRequest } from "fastify";
import { usersService } from "./users.service.js";
import { createUserSchema, updateUserSchema } from "./users.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class UsersController {
  async listUsers(_request: FastifyRequest, reply: FastifyReply) {
    const users = await usersService.listUsers();
    return reply.status(200).send(successResponse(users));
  }

  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = await usersService.getUserById(id);
    return reply.status(200).send(successResponse(user));
  }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createUserSchema.parse(request.body);
    const actorId = authReq.adminUser?.id || "system";
    const actorName = authReq.adminUser?.name || "Admin";

    const created = await usersService.createUser(input, actorId, actorName);
    return reply.status(201).send(successResponse(created, "Administrator created successfully"));
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateUserSchema.parse(request.body);
    const actorId = authReq.adminUser?.id || "system";
    const actorName = authReq.adminUser?.name || "Admin";
    const actorRoleId = authReq.adminUser?.roleId || "";

    const updated = await usersService.updateUser(id, input, actorId, actorName, actorRoleId);
    return reply.status(200).send(successResponse(updated, "Administrator updated successfully"));
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorId = authReq.adminUser?.id || "system";
    const actorName = authReq.adminUser?.name || "Admin";

    const result = await usersService.deleteUser(id, actorId, actorName);
    return reply.status(200).send(successResponse(result, "Administrator deleted successfully"));
  }
}

export const usersController = new UsersController();
