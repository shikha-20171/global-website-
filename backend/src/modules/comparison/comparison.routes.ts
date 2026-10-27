import { FastifyInstance } from "fastify";
import { comparisonController } from "./comparison.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function comparisonRoutes(app: FastifyInstance) {
  // Public
  app.get(
    "/products/compare",
    {
      schema: {
        tags: ["Products & Catalog"],
        summary: "Retrieve full product comparison matrix across architecture, compliance, and features",
      },
    },
    comparisonController.getMatrix.bind(comparisonController)
  );

  // Admin
  app.get(
    "/admin/comparison/attributes",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "List all comparison criteria attributes",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    comparisonController.listAttributes.bind(comparisonController)
  );

  app.post(
    "/admin/comparison/attributes",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Create comparison criteria attribute",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    comparisonController.createAttribute.bind(comparisonController)
  );

  app.put(
    "/admin/comparison/attributes/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Update comparison criteria attribute",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    comparisonController.updateAttribute.bind(comparisonController)
  );

  app.delete(
    "/admin/comparison/attributes/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Delete comparison attribute",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    comparisonController.deleteAttribute.bind(comparisonController)
  );

  app.post(
    "/admin/comparison/values",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Set comparison value for product and attribute",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    comparisonController.setComparisonValue.bind(comparisonController)
  );
}
