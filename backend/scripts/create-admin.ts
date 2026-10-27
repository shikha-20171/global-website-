#!/usr/bin/env node
/**
 * DEZORYN TECHNOLOGY — Secure Admin Account Creation CLI
 * Creates an initial or new administrative account directly in PostgreSQL.
 * Securely masks password input and prevents duplicate accounts.
 */

import readline from "readline";
import { Writable } from "stream";
import { prisma } from "../src/config/database.js";
import { hashPassword } from "../src/shared/hash.js";
import { logAuditEvent } from "../src/middleware/audit.js";
import { AdminStatus, AuditResult } from "@prisma/client";
import { z } from "zod";

const adminInputSchema = z.object({
  email: z.string().email("A valid email address is required (e.g. admin@dezoryn.com)"),
  name: z.string().min(2, "Full name must be at least 2 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (p) => !["admin", "password", "12345678", "admin123"].includes(p.toLowerCase()),
      "Insecure or trivial passwords are not permitted"
    ),
});

/**
 * Reads user input from terminal.
 * If silent is true, input characters are masked to prevent exposing passwords.
 */
function promptInput(query: string, silent = false): Promise<string> {
  return new Promise((resolve) => {
    let muted = false;
    const mutableStdout = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) {
          process.stdout.write(chunk, encoding);
        } else {
          // Print asterisk for masked password feedback if non-control character
          const str = chunk.toString();
          if (str !== "\r" && str !== "\n" && str !== "\r\n") {
            process.stdout.write("*");
          }
        }
        callback();
      },
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true,
    });

    process.stdout.write(query);
    muted = silent;

    rl.question("", (answer) => {
      rl.close();
      if (silent) {
        process.stdout.write("\n");
      }
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("========================================================================");
  console.log("🔒 DEZORYN TECHNOLOGY — Secure Administrator Account Setup");
  console.log("========================================================================");

  let email = process.env.ADMIN_EMAIL || "";
  let name = process.env.ADMIN_NAME || "";
  let password = process.env.ADMIN_PASSWORD || "";

  const isInteractive = Boolean(process.stdin.isTTY && !process.env.ADMIN_EMAIL);

  if (isInteractive) {
    console.log("Please enter the administrator details below:\n");
    email = await promptInput("Admin Email: ");
    name = await promptInput("Admin Full Name (Default: Administrator): ");
    if (!name) name = "Administrator";

    password = await promptInput("Admin Password (min 8 chars, hidden): ", true);
    const confirmPassword = await promptInput("Confirm Password (hidden): ", true);

    if (password !== confirmPassword) {
      console.error("\n❌ Error: Passwords do not match. Aborting setup.");
      process.exit(1);
    }
  }

  if (!email || !password) {
    console.error("\n❌ Error: Missing required credentials.");
    console.error("Usage interactively:  npm run admin:create");
    console.error("Usage via environment: ADMIN_EMAIL='admin@dezoryn.com' ADMIN_PASSWORD='StrongPassword123' ADMIN_NAME='Admin' npm run admin:create\n");
    process.exit(1);
  }

  // 1. Validate inputs with Zod
  const validationResult = adminInputSchema.safeParse({
    email: email.trim().toLowerCase(),
    name: name.trim() || "Administrator",
    password,
  });

  if (!validationResult.success) {
    console.error("\n❌ Validation Error:");
    validationResult.error.errors.forEach((err) => {
      console.error(` • ${err.message}`);
    });
    process.exit(1);
  }

  const validated = validationResult.data;

  // 2. Prevent accidental duplicate accounts
  const existing = await prisma.adminUser.findUnique({
    where: { email: validated.email },
  });

  if (existing) {
    console.error(`\n❌ Error: An administrator account with email "${validated.email}" already exists.`);
    console.error("Duplicate account creation prevented. If you forgot your password, please use the password reset flow.");
    process.exit(1);
  }

  // 3. Ensure baseline system role exists in database for relational integrity
  let role = await prisma.role.findFirst({
    where: { id: "super_admin" },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        id: "super_admin",
        name: "Administrator",
        description: "Primary system administrator",
        isSystem: true,
      },
    });
  }

  // 4. Hash password securely
  const passwordHash = await hashPassword(validated.password);

  // 5. Create new admin account in PostgreSQL
  const admin = await prisma.adminUser.create({
    data: {
      email: validated.email,
      name: validated.name,
      passwordHash,
      roleId: role.id,
      status: AdminStatus.ACTIVE,
      twoFactorEnforced: false,
    },
  });

  // 6. Record audit log without exposing passwords
  await logAuditEvent({
    adminUserId: admin.id,
    adminName: admin.name,
    action: "Create Admin Account",
    module: "Security Governance",
    entityType: "AdminUser",
    entityId: admin.id,
    details: `Admin account successfully created via CLI: "${admin.name}" (${admin.email})`,
    result: AuditResult.SUCCESS,
  });

  console.log("\n------------------------------------------------------------------------");
  console.log("✅ Administrator account successfully created in PostgreSQL!");
  console.log(` • Email:      ${admin.email}`);
  console.log(` • Name:       ${admin.name}`);
  console.log(` • Status:     ${admin.status}`);
  console.log(` • Dashboard:  http://localhost:3001/login`);
  console.log("------------------------------------------------------------------------");
}

main()
  .catch((err) => {
    console.error("\n❌ Setup failed:", err.message || err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
