import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export function registerSwagger(app: FastifyInstance) {
  app.register(swagger, {
    openapi: {
      info: {
        title: "DEZORYN TECHNOLOGY Enterprise REST API",
        description:
          "Unified production backend API serving DEZORYN Global Website (frontend) and Super Admin Console (admin). Includes full SaaS catalog, modular website CMS builder, CRM lead pipeline, RBAC permissions, and administrative audit logging.",
        version: "1.0.0",
        contact: {
          name: "DEZORYN Architecture Team",
          email: "api@dezoryn.com",
          url: "https://dezoryn.com",
        },
      },
      servers: [
        {
          url: "http://localhost:5001",
          description: "Local Development Server",
        },
        {
          url: "https://api.dezoryn.com",
          description: "Production Cloud Cluster",
        },
      ],
      tags: [
        { name: "Health", description: "Health checks & readiness probes" },
        { name: "Auth", description: "Admin authentication, session management, and RBAC" },
        { name: "Dashboard", description: "Executive statistics and platform overview" },
        { name: "Website CMS", description: "Pages, page sections builder, navigation, and legal policies" },
        { name: "Products & Catalog", description: "SaaS engines, categories, tier pricing, and comparison matrix" },
        { name: "Solutions & Verticals", description: "Enterprise architecture blueprints and industry frameworks" },
        { name: "Projects & Portfolio", description: "Customer showcases and engineering case studies" },
        { name: "Content & Resources", description: "Technical blog, insight whitepapers, runbooks, APIs, and FAQs" },
        { name: "Leads & CRM", description: "Public inquiries, demo calendar bookings, and newsletter subscriptions" },
        { name: "Media Assets", description: "Secure media asset storage, metadata, and CDN management" },
        { name: "User Governance", description: "Admin user administration, role assignment, and security audit trail" },
        { name: "System Settings", description: "Global site configuration, branding, and localization" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Bearer session token or JWT",
          },
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "dezoryn_admin_session",
            description: "HttpOnly secure session cookie",
          },
        },
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });
}
