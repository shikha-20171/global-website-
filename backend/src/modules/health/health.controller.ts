import { FastifyReply, FastifyRequest } from "fastify";
import { healthService } from "./health.service.js";
import { successResponse } from "../../shared/response.js";

export class HealthController {
  async checkHealth(_request: FastifyRequest, reply: FastifyReply) {
    const health = await healthService.getHealthStatus();
    return reply.status(200).send(successResponse(health, "Service operational"));
  }
}

export const healthController = new HealthController();
