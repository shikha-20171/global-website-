import { FastifyReply, FastifyRequest } from "fastify";
import { notificationsService } from "./notifications.service.js";
import { successResponse } from "../../shared/response.js";

export class NotificationsController {
  async getNotifications(_request: FastifyRequest, reply: FastifyReply) {
    const notifications = await notificationsService.getNotifications();
    return reply.status(200).send(successResponse(notifications));
  }
}

export const notificationsController = new NotificationsController();
