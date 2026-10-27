import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service.js";
import { loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema.js";
import { successResponse } from "../../shared/response.js";
import { COOKIE_NAME, SESSION_EXPIRATION_DAYS } from "../../config/constants.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    const ip = request.ip;
    const ua = request.headers["user-agent"];

    const result = await authService.login(input, ip, ua);

    // Set secure HttpOnly session cookie
    reply.setCookie(COOKIE_NAME, result.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: SESSION_EXPIRATION_DAYS * 24 * 60 * 60,
    });

    return reply.status(200).send(
      successResponse(
        {
          user: result.user,
          token: result.token,
        },
        "Authentication successful"
      )
    );
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const sessionId = authReq.adminUser?.sessionId || "";
    const userId = authReq.adminUser?.id;
    const userName = authReq.adminUser?.name;

    await authService.logout(sessionId, userId, userName, request.ip, request.headers["user-agent"]);

    reply.clearCookie(COOKIE_NAME, { path: "/" });

    return reply.status(200).send(successResponse({ loggedOut: true }, "Logged out successfully"));
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    if (!authReq.adminUser) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const user = await authService.getCurrentUser(authReq.adminUser.id);
    return reply.status(200).send(successResponse(user));
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    if (!authReq.adminUser) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const input = changePasswordSchema.parse(request.body);
    const result = await authService.changePassword(
      authReq.adminUser.id,
      input,
      request.ip,
      request.headers["user-agent"]
    );

    reply.clearCookie(COOKIE_NAME, { path: "/" });

    return reply.status(200).send(successResponse(result, "Password changed. Please sign in again."));
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const input = forgotPasswordSchema.parse(request.body);
    const result = await authService.forgotPassword(
      input,
      request.ip,
      request.headers["user-agent"]
    );
    return reply.status(200).send(successResponse(result, result.message));
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const input = resetPasswordSchema.parse(request.body);
    const result = await authService.resetPassword(
      input,
      request.ip,
      request.headers["user-agent"]
    );
    return reply.status(200).send(successResponse(result, result.message));
  }
}

export const authController = new AuthController();
