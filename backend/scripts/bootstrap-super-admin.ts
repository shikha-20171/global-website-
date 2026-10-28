import { prisma } from "../src/config/database.js";
import { hashPassword } from "../src/shared/hash.js";
import { logAuditEvent } from "../src/middleware/audit.js";
import { AdminStatus, AuditResult } from "@prisma/client";
import { z } from "zod";

const bootstrapSchema = z.object({
  email: z.string().email("A valid administrative email address is required"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .refine(
      (p) => !["admin", "password", "12345678", "1234567890", "superadmin"].includes(p.toLowerCase()),
      "Insecure or trivial passwords are prohibited"
    ),
  name: z.string().min(2, "Administrator full name is required"),
});

async function bootstrapSuperAdmin() {
  console.log("========================================================================");
  console.log(" DEZORYN TECHNOLOGY — IDEMPOTENT SUPER ADMIN BOOTSTRAP SCRIPT");
  console.log("========================================================================");

  const rawEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || process.env.ADMIN_BOOTSTRAP_EMAIL || process.argv[2];
  const rawPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || process.env.ADMIN_BOOTSTRAP_PASSWORD || process.argv[3];
  const rawName = process.env.BOOTSTRAP_ADMIN_NAME || process.env.ADMIN_BOOTSTRAP_NAME || process.argv[4] || "Super Administrator";

  if (!rawEmail || !rawPassword) {
    console.error(" Error: Missing bootstrap credentials.");
    console.error("Usage via environment variables:");
    console.error("  BOOTSTRAP_ADMIN_EMAIL='admin@dezoryn.com' BOOTSTRAP_ADMIN_PASSWORD='YourStrongPassword123!' BOOTSTRAP_ADMIN_NAME='Shikha Gour' npx tsx scripts/bootstrap-super-admin.ts");
    console.error("Or via arguments:");
    console.error("  npx tsx scripts/bootstrap-super-admin.ts <email> <password> <name>");
    process.exit(1);
  }

  const validated = bootstrapSchema.parse({
    email: rawEmail.trim(),
    password: rawPassword,
    name: rawName.trim(),
  });

  // Verify super_admin role exists
  let role = await prisma.role.findUnique({ where: { id: "super_admin" } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        id: "super_admin",
        name: "Super Administrator",
        description: "Sole administrative authority with root access across all platform modules.",
        isSystem: true,
      },
    });
  }

  const passwordHash = await hashPassword(validated.password);

  const admin = await prisma.adminUser.upsert({
    where: { email: validated.email.toLowerCase() },
    update: {
      name: validated.name,
      passwordHash,
      roleId: "super_admin",
      status: AdminStatus.ACTIVE,
      twoFactorEnforced: true,
    },
    create: {
      email: validated.email.toLowerCase(),
      name: validated.name,
      passwordHash,
      roleId: "super_admin",
      status: AdminStatus.ACTIVE,
      twoFactorEnforced: true,
    },
  });

  await logAuditEvent({
    adminUserId: admin.id,
    adminName: admin.name,
    action: "Bootstrap Super Admin",
    module: "Security Governance",
    entityType: "AdminUser",
    entityId: admin.id,
    details: `Idempotent bootstrap executed for Super Admin: "${admin.name}" (${admin.email})`,
    result: AuditResult.SUCCESS,
  });

  console.log(`✓ Super Admin account verified / initialized: ${admin.email}`);
  console.log(`✓ Role assigned: super_admin (Super Administrator)`);
  console.log(`✓ Status: ACTIVE`);
  console.log("========================================================================");
}

bootstrapSuperAdmin()
  .catch((err) => {
    console.error("Bootstrap failed:", err.message || err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
