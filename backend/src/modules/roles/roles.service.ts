import { prisma } from "../../config/database.js";
import { NotFoundError } from "../../shared/errors.js";

export class RolesService {
  async listRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: { permission: { module: "asc" } },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getRoleById(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return role;
  }

  async listPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ module: "asc" }, { code: "asc" }],
    });
  }
}

export const rolesService = new RolesService();
