import { FastifyInstance } from "fastify";
import { dashboardController } from "./dashboard.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    "/admin/dashboard",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Dashboard"],
        summary: "Executive administrative dashboard metrics",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    dashboardController.getSummary.bind(dashboardController)
  );
}
