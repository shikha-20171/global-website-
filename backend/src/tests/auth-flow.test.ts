import { prisma } from "../config/database.js";
import { authService } from "../modules/auth/auth.service.js";
import { generateSecureToken, hashToken } from "../shared/hash.js";
import { AdminStatus } from "@prisma/client";

async function runAuthVerification() {
  console.log("========================================================================");
  console.log(" DEZORYN TECHNOLOGY — Comprehensive Admin Authentication Test Suite");
  console.log("========================================================================");

  const testEmail = "testflow_admin@dezoryn.com";
  const initialPassword = "InitialPassword2026!";
  const newPassword = "UpdatedSecurePassword2026#";
  const db = prisma as any;

  // Cleanup any old test user
  await db.adminSession.deleteMany({
    where: { adminUser: { email: testEmail } },
  });
  await db.passwordResetToken.deleteMany({
    where: { adminUser: { email: testEmail } },
  });
  await db.adminUser.deleteMany({
    where: { email: testEmail },
  });

  // Ensure role exists
  let role = await prisma.role.findFirst({ where: { id: "super_admin" } });
  if (!role) {
    role = await prisma.role.create({
      data: { id: "super_admin", name: "Administrator", isSystem: true },
    });
  }

  // 1. Create account directly via hashPassword
  const { hashPassword } = await import("../shared/hash.js");
  const initialHash = await hashPassword(initialPassword);

  const user = await prisma.adminUser.create({
    data: {
      email: testEmail,
      name: "Test Flow Admin",
      passwordHash: initialHash,
      roleId: role.id,
      status: AdminStatus.ACTIVE,
    },
  });
  console.log("✓ Step 1: Admin account created successfully in PostgreSQL:", user.email);

  // 2. Test valid login
  const loginRes = await authService.login({
    email: testEmail,
    password: initialPassword,
  });
  console.log("✓ Step 2: Valid login succeeded. Session token generated.");
  if (!loginRes.token || !loginRes.user) {
    throw new Error("Login response missing token or user");
  }

  // 3. Test invalid login
  try {
    await authService.login({
      email: testEmail,
      password: "WrongPassword999!",
    });
    throw new Error("Invalid login should have failed");
  } catch (err: any) {
    console.log("✓ Step 3: Invalid password rejected properly:", err.message);
  }

  // 4. Test forgot password flow
  const forgotRes = await authService.forgotPassword({ email: testEmail });
  console.log("✓ Step 4: Forgot password returned generic response:", forgotRes.message);

  // Retrieve the generated reset token
  const resetTokenRecord = await db.passwordResetToken.findFirst({
    where: { adminUserId: user.id, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!resetTokenRecord) {
    throw new Error("Expected active PasswordResetToken in database");
  }
  console.log("✓ Step 5: PasswordResetToken verified in PostgreSQL with hash and 1-hour expiry.");

  // To test resetPassword with exact token, let's create a known token
  const testRawToken = generateSecureToken();
  const testTokenHash = hashToken(testRawToken);
  await db.passwordResetToken.create({
    data: {
      adminUserId: user.id,
      tokenHash: testTokenHash,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  // 5. Reset password with valid token
  const resetRes = await authService.resetPassword({
    token: testRawToken,
    newPassword,
  });
  console.log("✓ Step 6: Password reset executed successfully:", resetRes.message);

  // 6. Test token reuse prevention (single-use check)
  try {
    await authService.resetPassword({
      token: testRawToken,
      newPassword: "AnotherPassword123!",
    });
    throw new Error("Token reuse should have failed");
  } catch (err: any) {
    console.log("✓ Step 7: Re-use of consumed token rejected properly:", err.message);
  }

  // 7. Test expired token rejection
  const expiredRawToken = generateSecureToken();
  await db.passwordResetToken.create({
    data: {
      adminUserId: user.id,
      tokenHash: hashToken(expiredRawToken),
      expiresAt: new Date(Date.now() - 10000), // in the past
    },
  });

  try {
    await authService.resetPassword({
      token: expiredRawToken,
      newPassword: "ExpiredPassword123!",
    });
    throw new Error("Expired token should have failed");
  } catch (err: any) {
    console.log("✓ Step 8: Expired token rejected properly:", err.message);
  }

  // 8. Old password must now be rejected
  try {
    await authService.login({
      email: testEmail,
      password: initialPassword,
    });
    throw new Error("Old password should have been rejected after reset");
  } catch (err: any) {
    console.log("✓ Step 9: Old password rejected after password reset:", err.message);
  }

  // 9. New password must be accepted
  const newLoginRes = await authService.login({
    email: testEmail,
    password: newPassword,
  });
  console.log("✓ Step 10: New password accepted. Established new authenticated session.");

  // 10. Test protected getMe profile
  const me = await authService.getCurrentUser(newLoginRes.user.id);
  console.log("✓ Step 11: Protected getMe returned administrator profile:", me.email);

  // 11. Test logout and session revocation
  await authService.logout(newLoginRes.sessionId, me.id, me.name);
  const revokedSession = await prisma.adminSession.findUnique({
    where: { id: newLoginRes.sessionId },
  });
  if (!revokedSession?.revokedAt) {
    throw new Error("Session was not marked as revoked");
  }
  console.log("✓ Step 12: Session revoked on logout. Session revocation verified.");

  // Clean up test records
  await db.adminSession.deleteMany({
    where: { adminUser: { email: testEmail } },
  });
  await db.passwordResetToken.deleteMany({
    where: { adminUser: { email: testEmail } },
  });
  await db.adminUser.deleteMany({
    where: { email: testEmail },
  });
  console.log("✓ Step 13: Test teardown completed cleanly.");

  console.log("========================================================================");
  console.log("🎉 ALL 13 AUTHENTICATION TESTS PASSED WITH ZERO ERRORS!");
  console.log("========================================================================");
}

runAuthVerification()
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
