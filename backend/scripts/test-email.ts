/**
 * DEZORYN TECHNOLOGY — Email Dispatch Verifier
 * Usage: npx tsx scripts/test-email.ts user@example.com
 */

import dotenv from "dotenv";
dotenv.config();

import { sendAdminPasswordResetEmail } from "../src/shared/email.js";

async function main() {
  const targetEmail = process.argv[2] || process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@dezoryn.com";
  const dummyToken = "test_token_" + Math.random().toString(36).substring(2, 15);

  console.log(`\n========================================================================`);
  console.log(`🧪 TESTING EMAIL DISPATCH FOR: ${targetEmail}`);
  console.log(`========================================================================`);

  const result = await sendAdminPasswordResetEmail(targetEmail, dummyToken);

  console.log("\nDispatch Result:", result);

  if (result.sent) {
    console.log(`\n✅ Email successfully sent to ${targetEmail}!`);
    console.log(`   Message ID: ${result.messageId}`);
  } else if (!result.providerConfigured) {
    console.log(`\nℹ️  SMTP is not yet configured in backend/.env.`);
    console.log(`   The reset URL was printed above for testing.`);
    console.log(`   To send live emails, configure SMTP_USER & SMTP_PASS in backend/.env.`);
  } else {
    console.log(`\n❌ Failed to send email: ${result.message}`);
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
