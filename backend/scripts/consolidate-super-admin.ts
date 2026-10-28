import { prisma } from "../src/config/database.js";
import { logAuditEvent } from "../src/middleware/audit.js";
import { AuditResult } from "@prisma/client";

async function consolidateSuperAdminRole() {
  console.log("========================================================================");
  console.log(" DEZORYN TECHNOLOGY — SAFE SUPER ADMIN ROLE CONSOLIDATION");
  console.log("========================================================================");

  // 1. Verify super_admin role exists and has all permissions
  let superAdminRole = await prisma.role.findUnique({ where: { id: "super_admin" } });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        id: "super_admin",
        name: "Super Administrator",
        description: "Sole administrative authority with root access across all DEZORYN platform modules.",
        isSystem: true,
      },
    });
  }

  // Ensure all permissions are mapped to super_admin
  const allPermissions = await prisma.permission.findMany();
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: "super_admin",
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: "super_admin",
        permissionId: p.id,
      },
    });
  }

  // 2. Consolidate all admin users into super_admin role safely without deleting user records
  const updateResult = await prisma.adminUser.updateMany({
    data: {
      roleId: "super_admin",
    },
  });

  console.log(`✓ Successfully consolidated ${updateResult.count} admin user(s) to single 'super_admin' role.`);

  // 3. Record Audit Log for the security migration
  await logAuditEvent({
    adminName: "Security Migration Engine",
    action: "Consolidated Roles to Super Admin",
    module: "Security & Governance",
    entityType: "Role",
    entityId: "super_admin",
    details: `Consolidated all administrative authorization into single 'super_admin' role across ${updateResult.count} accounts. Preserved legacy audit history and foreign keys.`,
    result: AuditResult.SUCCESS,
  });

  console.log("✓ Audit log recorded.");
  console.log("========================================================================");
}

consolidateSuperAdminRole()
  .catch((err) => {
    console.error("Consolidation failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
