import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../config/database.js";
import { COOKIE_NAME } from "../config/constants.js";
import { hashToken } from "../shared/hash.js";
import { UnauthorizedError } from "../shared/errors.js";
import { AuthenticatedRequest } from "../shared/types.js";
import { AdminStatus } from "@prisma/client";

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  let token: string | undefined;

  // 1. Check Authorization Bearer header
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // 2. Fallback to HttpOnly session cookie
  if (!token && request.cookies) {
    token = request.cookies[COOKIE_NAME];
  }

  if (!token) {
    throw new UnauthorizedError("Authentication required: missing session token or cookie");
  }

  const tokenHash = hashToken(token);

  const session = await prisma.adminSession.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      adminUser: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session || !session.adminUser) {
    throw new UnauthorizedError("Invalid or expired administrative session");
  }

  const user = session.adminUser;
  if (user.status !== AdminStatus.ACTIVE) {
    throw new UnauthorizedError("Administrative account is inactive or suspended");
  }

  const permissions = user.role.permissions.map((rp: any) => rp.permission.code);

  (request as AuthenticatedRequest).adminUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    roleName: user.role.name,
    permissions,
    sessionId: session.id,
  };
}
