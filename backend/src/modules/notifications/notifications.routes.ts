import { FastifyInstance } from "fastify";
import { notificationsController } from "./notifications.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function notificationsRoutes(app: FastifyInstance) {
  app.get(
    "/admin/notifications",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["User Governance"],
        summary: "Retrieve recent administrative notifications and security alerts",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    notificationsController.getNotifications.bind(notificationsController)
  );
}
