import { FastifyInstance } from "fastify";
import { auditController } from "./audit.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function auditRoutes(app: FastifyInstance) {
  app.get(
    "/admin/audit-logs",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["User Governance"],
        summary: "Retrieve immutable administrative audit trail logs",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    auditController.listLogs.bind(auditController)
  );

  app.get(
    "/admin/audit-logs/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["User Governance"],
        summary: "Get specific audit log entry by ID",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    auditController.getLogById.bind(auditController)
  );
}
