import { FastifyInstance } from "fastify";
import { productsController } from "./products.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function productsRoutes(app: FastifyInstance) {
  // Public Products Endpoints
  app.get(
    "/products",
    {
      schema: {
        tags: ["Products & Catalog"],
        summary: "List all published SaaS products with category filtering, search, and pagination",
      },
    },
    productsController.listPublicProducts.bind(productsController)
  );

  app.get(
    "/products/categories",
    {
      schema: {
        tags: ["Products & Catalog"],
        summary: "List all SaaS product categories with published product counts",
      },
    },
    productsController.listCategories.bind(productsController)
  );

  app.get(
    "/products/:slug",
    {
      schema: {
        tags: ["Products & Catalog"],
        summary: "Retrieve full SaaS engine details, capabilities, plans, and architectural comparisons by slug",
      },
    },
    productsController.getPublicProductBySlug.bind(productsController)
  );

  // Protected Admin Products Endpoints
  app.get(
    "/admin/products",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "List all SaaS products for administrative management",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.listAdminProducts.bind(productsController)
  );

  app.get(
    "/admin/products/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Get SaaS product details by ID for administrative editing",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.getAdminProductById.bind(productsController)
  );

  app.post(
    "/admin/products",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Create a new SaaS product in the marketplace",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.createProduct.bind(productsController)
  );

  app.put(
    "/admin/products/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Update SaaS product details, capabilities, and configurations",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.updateProduct.bind(productsController)
  );

  app.patch(
    "/admin/products/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Patch SaaS product fields",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.updateProduct.bind(productsController)
  );

  app.post(
    "/admin/products/:id/publish",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Publish, unpublish, or archive a SaaS product",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.publishProduct.bind(productsController)
  );

  app.delete(
    "/admin/products/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Delete SaaS product from catalog",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.deleteProduct.bind(productsController)
  );

  // Admin Categories Endpoints
  app.post(
    "/admin/categories",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Create a new product category",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.createCategory.bind(productsController)
  );

  app.put(
    "/admin/categories/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Update product category details",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.updateCategory.bind(productsController)
  );

  app.delete(
    "/admin/categories/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Products & Catalog"],
        summary: "Delete product category",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    productsController.deleteCategory.bind(productsController)
  );
}
