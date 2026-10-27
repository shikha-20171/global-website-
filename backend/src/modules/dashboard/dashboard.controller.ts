import { FastifyReply, FastifyRequest } from "fastify";
import { dashboardService } from "./dashboard.service.js";
import { successResponse } from "../../shared/response.js";

export class DashboardController {
  async getSummary(_request: FastifyRequest, reply: FastifyReply) {
    const summary = await dashboardService.getDashboardSummary();
    return reply.status(200).send(successResponse(summary, "Dashboard metrics loaded"));
  }
}

export const dashboardController = new DashboardController();
