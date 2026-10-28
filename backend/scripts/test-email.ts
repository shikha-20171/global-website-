

import dotenv from "dotenv";
dotenv.config();

import {
  sendAdminPasswordResetEmail,
  sendLeadInquiryEmails,
  sendDemoBookingEmails,
  sendNewsletterWelcomeEmail,
  createTransporter,
} from "../src/shared/email.js";

async function main() {
  const targetEmail = process.argv[2] || process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@dezoryn.com";
  const testType = (process.argv[3] || "all").toLowerCase();

  console.log(`\n========================================================================`);
  console.log(` TESTING NODEMAILER EMAIL DISPATCH FOR: ${targetEmail}`);
  console.log(`   Mode / Type: ${testType}`);
  console.log(`========================================================================`);

  const transporter = createTransporter();
  if (transporter) {
    console.log("✓ Live SMTP configuration detected in backend/.env.");
  } else {
    console.log("ℹ  SMTP is NOT configured in backend/.env.");
    console.log("   Nodemailer dispatcher will operate in Local/Preview mode and log events below.");
  }

  // 1. Admin Forgot Password Reset Test
  if (testType === "all" || testType === "reset" || testType === "auth") {
    console.log("\n--- [1/4] Testing Admin Password Reset Email ---");
    const dummyToken = "verify_token_" + Math.random().toString(36).substring(2, 12);
    const resetRes = await sendAdminPasswordResetEmail(targetEmail, dummyToken);
    console.log("Result:", resetRes);
  }

  // 2. Website Contact / Lead Inquiry Test
  if (testType === "all" || testType === "lead" || testType === "contact") {
    console.log("\n--- [2/4] Testing Website Lead Inquiry (Client + Admin) ---");
    const leadRes = await sendLeadInquiryEmails({
      name: "Alex Vance",
      email: targetEmail,
      company: "Acme Enterprises Inc.",
      country: "United States",
      solution: "Enterprise Cloud ERP & AI Workflows",
      requirement: "Need to modernize legacy systems and scale to 500+ daily concurrent users.",
      source: "website_contact_form",
    });
    console.log("Result:", leadRes);
  }

  // 3. Website Demo Request Booking Test
  if (testType === "all" || testType === "demo") {
    console.log("\n--- [3/4] Testing Website Demo Booking (Client + Admin) ---");
    const demoRes = await sendDemoBookingEmails({
      contactName: "Alex Vance",
      businessEmail: targetEmail,
      company: "Acme Enterprises Inc.",
      country: "United States",
      productSlug: "schooly-core",
      preferredDate: "2026-11-05",
      preferredTime: "14:00",
      timeZone: "UTC+05:30",
      notes: "Interested in the multi-branch attendance and automated billing modules.",
    });
    console.log("Result:", demoRes);
  }

  // 4. Website Newsletter Welcome Test
  if (testType === "all" || testType === "newsletter") {
    console.log("\n--- [4/4] Testing Website Newsletter Welcome Email ---");
    const newsletterRes = await sendNewsletterWelcomeEmail(targetEmail);
    console.log("Result:", newsletterRes);
  }

  console.log(`\n========================================================================`);
  console.log(`✅ NODEMAILER VERIFICATION COMPLETE`);
  console.log(`========================================================================\n`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
