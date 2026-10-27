import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function authRoutes(app: FastifyInstance) {
  // Public Login
  app.post(
    "/admin/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Administrator authentication",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    authController.login.bind(authController)
  );

  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Administrator authentication (alias)",
      },
    },
    authController.login.bind(authController)
  );

  // Authenticated Logout
  app.post(
    "/admin/auth/logout",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Revoke administrative session",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    authController.logout.bind(authController)
  );

  // Get Current Authenticated Admin
  app.get(
    "/admin/auth/me",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Retrieve current authenticated administrator profile and capabilities",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      },
    },
    authController.getMe.bind(authController)
  );

  // Change Admin Password
  app.post(
    "/admin/auth/change-password",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Change administrator password",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        body: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string" },
            newPassword: { type: "string", minLength: 8 },
          },
        },
      },
    },
    authController.changePassword.bind(authController)
  );

  // Forgot Password (Single-use token generation)
  app.post(
    "/admin/auth/forgot-password",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
      schema: {
        tags: ["Auth"],
        summary: "Generate and send administrative password reset link",
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string" },
          },
        },
      },
    },
    authController.forgotPassword.bind(authController)
  );

  // Reset Password (Token verification and password update)
  app.post(
    "/admin/auth/reset-password",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
      schema: {
        tags: ["Auth"],
        summary: "Verify reset token and update administrator password",
        body: {
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: { type: "string" },
            newPassword: { type: "string", minLength: 8 },
          },
        },
      },
    },
    authController.resetPassword.bind(authController)
  );
}
