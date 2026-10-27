import { FastifyInstance } from "fastify";
import { leadsController } from "./leads.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireSuperAdmin } from "../../middleware/authorize.js";

export async function leadsRoutes(app: FastifyInstance) {
  // --- 1. Public Ingestion Endpoints ---
  app.post(
    "/contact",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Public contact form submission with spam defense",
      },
    },
    leadsController.submitInquiry.bind(leadsController)
  );

  app.post(
    "/sales-inquiries",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Public enterprise sales inquiry submission",
      },
    },
    leadsController.submitInquiry.bind(leadsController)
  );

  app.post(
    "/sales-leads",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Public sales lead submission",
      },
    },
    leadsController.submitInquiry.bind(leadsController)
  );

  app.post(
    "/leads/inquiry",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Public contact inquiry submission (compatibility endpoint)",
      },
    },
    leadsController.submitInquiry.bind(leadsController)
  );

  app.post(
    "/demo",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Schedule product walkthrough and architecture demo",
      },
    },
    leadsController.submitDemo.bind(leadsController)
  );

  app.post(
    "/leads/demo",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Schedule product walkthrough (compatibility endpoint)",
      },
    },
    leadsController.submitDemo.bind(leadsController)
  );

  app.post(
    "/newsletter/subscribe",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Subscribe email to DEZORYN engineering newsletter",
      },
    },
    leadsController.subscribeNewsletter.bind(leadsController)
  );

  app.post(
    "/newsletter/unsubscribe",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Unsubscribe email from updates",
      },
    },
    leadsController.unsubscribeNewsletter.bind(leadsController)
  );

  app.post(
    "/leads/newsletter",
    {
      schema: {
        tags: ["Leads & CRM"],
        summary: "Newsletter subscription (compatibility endpoint)",
      },
    },
    leadsController.subscribeNewsletter.bind(leadsController)
  );

  // --- 2. Admin Protected Endpoints ---
  // Inquiries / Leads
  app.get(
    "/admin/inquiries",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "List and filter inbound sales inquiries and leads",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.listAdminInquiries.bind(leadsController)
  );

  app.get(
    "/admin/leads",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "List inbound leads (compatibility endpoint)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.listAdminInquiries.bind(leadsController)
  );

  app.get(
    "/admin/inquiries/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Get inquiry details by ID",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.getAdminInquiryById.bind(leadsController)
  );

  app.patch(
    "/admin/inquiries/:id/status",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Update inquiry pipeline stage and record timeline note",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.updateAdminInquiry.bind(leadsController)
  );

  app.patch(
    "/admin/leads/:id/status",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Update lead status (compatibility endpoint)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.updateAdminInquiry.bind(leadsController)
  );

  app.delete(
    "/admin/inquiries/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Delete inquiry",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.deleteAdminInquiry.bind(leadsController)
  );

  app.delete(
    "/admin/leads/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Delete lead (compatibility endpoint)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.deleteAdminInquiry.bind(leadsController)
  );

  // Demos
  app.get(
    "/admin/demos",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "List scheduled product demos",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.listAdminDemos.bind(leadsController)
  );

  app.patch(
    "/admin/demos/:id/status",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Update demo status and assign meeting link",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.updateAdminDemo.bind(leadsController)
  );

  app.delete(
    "/admin/demos/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Delete demo request",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.deleteAdminDemo.bind(leadsController)
  );

  // Subscribers & Newsletter
  app.get(
    "/admin/subscribers",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "List newsletter subscribers",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.listAdminSubscribers.bind(leadsController)
  );

  app.get(
    "/admin/newsletter",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "List newsletter subscribers (alias)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.listAdminSubscribers.bind(leadsController)
  );

  app.delete(
    "/admin/subscribers/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Delete newsletter subscriber",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.deleteAdminSubscriber.bind(leadsController)
  );

  app.delete(
    "/admin/newsletter/:id",
    {
      preHandler: [authenticate, requireSuperAdmin],
      schema: {
        tags: ["Leads & CRM"],
        summary: "Delete newsletter subscriber (alias)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    leadsController.deleteAdminSubscriber.bind(leadsController)
  );
}
