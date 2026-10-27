import { FastifyInstance } from "fastify";
import { pagesController } from "./pages.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { PERMISSIONS } from "../../config/constants.js";

export async function pagesRoutes(app: FastifyInstance) {
  // 1. Public CMS Routes
  app.get(
    "/pages",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "List all published website pages",
      },
    },
    pagesController.getPublicPages.bind(pagesController)
  );

  app.get(
    "/pages/*",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Get single published page content with enabled builder sections by slug",
      },
    },
    pagesController.getPublicPageBySlug.bind(pagesController)
  );

  // Compatibility route for single-param slugs: /pages/:slug
  app.get(
    "/pages/:slug",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "Get single published page by direct slug",
      },
    },
    pagesController.getPublicPageBySlug.bind(pagesController)
  );

  app.get(
    "/website/pages",
    {
      schema: {
        tags: ["Website CMS"],
        summary: "List all published website pages (compatibility endpoint)",
      },
    },
    pagesController.getPublicPages.bind(pagesController)
  );

  // 2. Protected Admin Pages Routes
  app.get(
    "/admin/pages",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_READ)],
      schema: {
        tags: ["Website CMS"],
        summary: "List all pages for administrative management (including drafts)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.getAdminPages.bind(pagesController)
  );

  app.get(
    "/admin/pages/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_READ)],
      schema: {
        tags: ["Website CMS"],
        summary: "Get page details by ID with sections",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.getAdminPageById.bind(pagesController)
  );

  app.get(
    "/admin/pages/:idOrSlug/preview",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_READ)],
      schema: {
        tags: ["Website CMS"],
        summary: "Preview draft or unlisted page content",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.previewPage.bind(pagesController)
  );

  app.post(
    "/admin/pages",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Create a new website page",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.createPage.bind(pagesController)
  );

  app.put(
    "/admin/pages/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Update website page details and metadata",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.updatePage.bind(pagesController)
  );

  app.patch(
    "/admin/pages/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Patch website page metadata",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.updatePage.bind(pagesController)
  );

  app.post(
    "/admin/pages/:id/publish",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_PUBLISH)],
      schema: {
        tags: ["Website CMS"],
        summary: "Publish, unpublish, or archive website page",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.publishPage.bind(pagesController)
  );

  app.delete(
    "/admin/pages/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Delete website page and associated sections",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.deletePage.bind(pagesController)
  );

  // 3. Admin Builder Sections
  app.get(
    "/admin/sections",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_READ)],
      schema: {
        tags: ["Website CMS"],
        summary: "List all builder sections across pages",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.listSections.bind(pagesController)
  );

  app.get(
    "/admin/pages/sections",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_READ)],
      schema: {
        tags: ["Website CMS"],
        summary: "List all builder sections across pages (alias)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.listSections.bind(pagesController)
  );

  app.put(
    "/admin/sections/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Update builder section content, settings JSON, or display order",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.updateSection.bind(pagesController)
  );

  app.put(
    "/admin/pages/sections/:id",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.WEBSITE_WRITE)],
      schema: {
        tags: ["Website CMS"],
        summary: "Update builder section content (alias)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    pagesController.updateSection.bind(pagesController)
  );
}
