import { FastifyInstance } from "fastify";
import { rolesController } from "./roles.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function rolesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  app.get(
    "/admin/roles",
    {
      schema: {
        tags: ["User Governance"],
        summary: "List all RBAC roles with granted permissions and active user counts",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    rolesController.listRoles.bind(rolesController)
  );

  app.get(
    "/admin/roles/:id",
    {
      schema: {
        tags: ["User Governance"],
        summary: "Get role details and permission grants",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    rolesController.getRoleById.bind(rolesController)
  );

  app.get(
    "/admin/permissions",
    {
      schema: {
        tags: ["User Governance"],
        summary: "List all available fine-grained system permissions",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    rolesController.listPermissions.bind(rolesController)
  );
}
