import { FastifyInstance } from "fastify";
import { usersController } from "./users.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { PERMISSIONS } from "../../config/constants.js";

export async function usersRoutes(app: FastifyInstance) {
  // All user governance routes require authentication and users:manage permission
  app.addHook("preHandler", authenticate);

  app.get(
    "/admin/users",
    {
      preHandler: [requirePermission(PERMISSIONS.USERS_MANAGE)],
      schema: {
        tags: ["User Governance"],
        summary: "List all administrator users",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    usersController.listUsers.bind(usersController)
  );

  app.get(
    "/admin/users/:id",
    {
      preHandler: [requirePermission(PERMISSIONS.USERS_MANAGE)],
      schema: {
        tags: ["User Governance"],
        summary: "Get administrator user details by ID",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    usersController.getUserById.bind(usersController)
  );

  app.post(
    "/admin/users",
    {
      preHandler: [requirePermission(PERMISSIONS.USERS_MANAGE)],
      schema: {
        tags: ["User Governance"],
        summary: "Create new administrator account",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        body: {
          type: "object",
          required: ["email", "name", "roleId"],
          properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
            password: { type: "string", minLength: 8 },
            roleId: { type: "string" },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"] },
            twoFactorEnforced: { type: "boolean" },
          },
        },
      },
    },
    usersController.createUser.bind(usersController)
  );

  app.put(
    "/admin/users/:id",
    {
      preHandler: [requirePermission(PERMISSIONS.USERS_MANAGE)],
      schema: {
        tags: ["User Governance"],
        summary: "Update administrator account details or reset password",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    usersController.updateUser.bind(usersController)
  );

  app.delete(
    "/admin/users/:id",
    {
      preHandler: [requirePermission(PERMISSIONS.USERS_MANAGE)],
      schema: {
        tags: ["User Governance"],
        summary: "Delete administrator user account",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    usersController.deleteUser.bind(usersController)
  );
}
