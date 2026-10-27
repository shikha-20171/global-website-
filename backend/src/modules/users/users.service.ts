import { prisma } from "../../config/database.js";
import { hashPassword } from "../../shared/hash.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { AdminStatus, AuditResult } from "@prisma/client";
import { ROLES } from "../../config/constants.js";
import { CreateUserInput, UpdateUserInput } from "./users.schema.js";

export class UsersService {
  async listUsers() {
    return prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        status: true,
        twoFactorEnforced: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getUserById(id: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        status: true,
        twoFactorEnforced: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("Admin user not found");
    }

    return user;
  }

  async createUser(input: CreateUserInput, actorId: string, actorName: string) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Administrator with email "${input.email}" already exists`);
    }

    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: input.roleId },
    });
    if (!role) {
      throw new BadRequestError(`Role with ID "${input.roleId}" does not exist`);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.adminUser.create({
      data: {
        email: input.email.toLowerCase().trim(),
        name: input.name,
        passwordHash,
        roleId: input.roleId,
        status: input.status,
        twoFactorEnforced: input.twoFactorEnforced,
      },
      include: { role: true },
    });

    await logAuditEvent({
      adminUserId: actorId,
      adminName: actorName,
      action: "Created Admin User",
      module: "User Governance",
      entityType: "AdminUser",
      entityId: user.id,
      details: `Created admin user "${user.name}" (${user.email}) with role "${user.role.name}"`,
      result: AuditResult.SUCCESS,
    });

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, input: UpdateUserInput, actorId: string, actorName: string, actorRoleId: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundError("Admin user not found");
    }

    // Prevent privilege escalation: only super_admin can assign super_admin role
    if (input.roleId && input.roleId === ROLES.SUPER_ADMIN && actorRoleId !== ROLES.SUPER_ADMIN) {
      throw new ForbiddenError("Only a Super Administrator can assign the Super Administrator role");
    }

    // Safety check: Prevent deactivating the last active super_admin
    if (user.roleId === ROLES.SUPER_ADMIN && input.status && input.status !== AdminStatus.ACTIVE) {
      const activeSuperAdmins = await prisma.adminUser.count({
        where: { roleId: ROLES.SUPER_ADMIN, status: AdminStatus.ACTIVE },
      });
      if (activeSuperAdmins <= 1) {
        throw new BadRequestError("Cannot deactivate the last active Super Administrator");
      }
    }

    const data: any = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.roleId !== undefined) data.roleId = input.roleId;
    if (input.status !== undefined) data.status = input.status;
    if (input.twoFactorEnforced !== undefined) data.twoFactorEnforced = input.twoFactorEnforced;

    if (input.password && input.password.length >= 8) {
      data.passwordHash = await hashPassword(input.password);
      // Revoke sessions when password is reset
      await prisma.adminSession.updateMany({
        where: { adminUserId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data,
      include: { role: true },
    });

    await logAuditEvent({
      adminUserId: actorId,
      adminName: actorName,
      action: "Updated Admin User",
      module: "User Governance",
      entityType: "AdminUser",
      entityId: id,
      details: `Updated details for "${updated.name}" (${updated.email})`,
      result: AuditResult.SUCCESS,
    });

    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  async deleteUser(id: string, actorId: string, actorName: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError("Admin user not found");
    }

    // Safety check: Prevent removing the last active super administrator
    if (user.roleId === ROLES.SUPER_ADMIN) {
      const superAdminsCount = await prisma.adminUser.count({
        where: { roleId: ROLES.SUPER_ADMIN, status: AdminStatus.ACTIVE },
      });
      if (superAdminsCount <= 1) {
        throw new BadRequestError("Forbidden: Cannot remove the last active Super Administrator from the system");
      }
    }

    await prisma.adminUser.delete({ where: { id } });

    await logAuditEvent({
      adminUserId: actorId,
      adminName: actorName,
      action: "Deleted Admin User",
      module: "User Governance",
      entityType: "AdminUser",
      entityId: id,
      details: `Deleted admin user account "${user.name}" (${user.email})`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const usersService = new UsersService();
