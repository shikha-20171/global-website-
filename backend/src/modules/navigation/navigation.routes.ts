import { FastifyInstance } from "fastify";
import { navigationController } from "./navigation.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { PERMISSIONS } from "../../config/constants.js";

export async function navigationRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/navigation",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve published navigation menus (header, footer, and mobile)",
      },
    },
    navigationController.getPublicNavigation.bind(navigationController)
  );

  app.get(
    "/website/navigation",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Retrieve published navigation menus (compatibility endpoint)",
      },
    },
    navigationController.getPublicNavigation.bind(navigationController)
  );

  // Admin
  app.get(
    "/admin/navigation",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_READ)],
      schema: {
        tags: ["Website CMS"],
        summary: "List all navigation links for admin configuration",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    navigationController.listAdminNavigation.bind(navigationController)
  );

  app.post(
    "/admin/navigation",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Create a new navigation menu link",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    navigationController.createNavItem.bind(navigationController)
  );

  app.put(
    "/admin/navigation/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Update navigation link details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    navigationController.updateNavItem.bind(navigationController)
  );

  app.delete(
    "/admin/navigation/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Delete navigation menu link",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    navigationController.deleteNavItem.bind(navigationController)
  );
}
