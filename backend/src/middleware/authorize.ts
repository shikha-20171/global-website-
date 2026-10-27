import { FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";
import { AuthenticatedRequest } from "../shared/types.js";
import { ROLES } from "../config/constants.js";

/**
 * Validates that an active authenticated admin user exists.
 * In accordance with single-tier admin access (no role-based restrictions),
 * all active authenticated admin accounts have full access to the control plane.
 */
export async function requireSuperAdmin(request: FastifyRequest, _reply: FastifyReply) {
  const authReq = request as AuthenticatedRequest;
  if (!authReq.adminUser) {
    throw new UnauthorizedError("Authentication required before administrative access");
  }
}

/**
 * Modular compatibility guard. All authenticated active administrators have access.
 */
export function requirePermission(_permissionCode?: string) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const authReq = request as AuthenticatedRequest;
    if (!authReq.adminUser) {
      throw new UnauthorizedError("Authentication required before administrative access");
    }
  };
}
