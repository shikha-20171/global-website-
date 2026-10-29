/**
 * DEZORYN TECHNOLOGY — Enterprise Email Dispatcher Service
 * Powered by Nodemailer for:
 * 1. Admin Password Recovery & Account Reset Flows
 * 2. Website Inbound Contact & Sales Inquiries (Client confirmation + Admin notification)
 * 3. Website Demo Booking Requests (Client schedule confirmation + Admin notification)
 * 4. Website Newsletter Subscriptions (Welcome email)
 * 5. Admin User Provisioning Alerts
 *
 * Supports:
 * - Gmail (via App Passwords or SMTP_SERVICE=gmail)
 * - Custom SMTP (Host, Port, User, Pass, TLS/SSL)
 * - SendGrid, Mailgun, Amazon SES, Brevo, Outlook, etc.
 * - Graceful fallback: If SMTP credentials are not configured in backend/.env,
 *   email events and preview links are logged cleanly to the backend console.
 */

import nodemailer, { Transporter } from "nodemailer";

export interface EmailDispatchResult {
  sent: boolean;
  providerConfigured: boolean;
  message?: string;
  messageId?: string;
}

export interface LeadEmailData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  country: string;
  companySize?: string;
  solution?: string;
  budget?: string;
  requirement: string;
  source: string;
}

export interface DemoEmailData {
  contactName: string;
  businessEmail: string;
  phone?: string;
  company: string;
  country: string;
  productSlug: string;
  preferredDate: string;
  preferredTime: string;
  timeZone: string;
  notes?: string;
}

/**
 * Creates and returns a cached or fresh Nodemailer transport instance
 * based on environment variables configured in backend/.env.
 */
let cachedTransporter: Transporter | null = null;
let lastEnvHash = "";

export function createTransporter(): Transporter | null {
  const service = process.env.SMTP_SERVICE?.trim(); // e.g. 'gmail'
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const portStr = process.env.SMTP_PORT?.trim();
  const port = portStr ? parseInt(portStr, 10) : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const currentEnvHash = `${service}|${host}|${user}|${pass}|${port}|${secure}`;

  if (cachedTransporter && lastEnvHash === currentEnvHash) {
    return cachedTransporter;
  }

  // Gmail shorthand support: SMTP_SERVICE="gmail" or SMTP_HOST="smtp.gmail.com"
  if (service && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
    lastEnvHash = currentEnvHash;
    return cachedTransporter;
  }

  // Standard generic SMTP host/port
  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });
    lastEnvHash = currentEnvHash;
    return cachedTransporter;
  }

  return null;
}

function getSenderAddress(): string {
  return (
    process.env.SMTP_FROM ||
    (process.env.SMTP_USER ? `"DEZORYN TECHNOLOGY" <${process.env.SMTP_USER}>` : '"DEZORYN TECHNOLOGY" <no-reply@dezoryn.com>')
  );
}

function getAdminRecipient(): string {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.SMTP_USER ||
    process.env.ADMIN_BOOTSTRAP_EMAIL ||
    "admin@dezoryn.com"
  );
}

// -----------------------------------------------------------------------------
// 1. ADMIN FORGOT PASSWORD DISPATCH
// -----------------------------------------------------------------------------

export async function sendAdminPasswordResetEmail(
  toEmail: string,
  rawToken: string
): Promise<EmailDispatchResult> {
  const adminBaseUrl =
    process.env.ADMIN_URL ||
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    "http://localhost:3001";

  const resetUrl = `${adminBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
  const transporter = createTransporter();

  // Fallback when SMTP credentials are not yet configured in .env
  if (!transporter) {
    console.log("\n========================================================================");
    console.log(`[EMAIL DISPATCH] Password Reset Requested for: ${toEmail}`);
    console.log("------------------------------------------------------------------------");
    console.log("ℹ️  SMTP is not configured in backend/.env.");
    console.log("   To send real emails to this address, add your SMTP credentials to backend/.env:");
    console.log("   SMTP_HOST=smtp.gmail.com");
    console.log("   SMTP_PORT=587");
    console.log("   SMTP_USER=your-email@gmail.com");
    console.log("   SMTP_PASS=your-gmail-app-password");
    console.log("------------------------------------------------------------------------");
    console.log(`🔗 Local Reset URL: ${resetUrl}`);
    console.log("========================================================================\n");

    return {
      sent: false,
      providerConfigured: false,
      message: "Email provider not configured in environment; reset URL logged to console.",
    };
  }

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your DEZORYN Administrator Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { font-size: 22px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px; margin-bottom: 24px; text-align: center; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); }
        .expiry-note { font-size: 12px; color: #f59e0b; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); padding: 10px 14px; border-radius: 8px; margin: 20px 0; }
        .link-alt { font-size: 12px; color: #64748b; word-break: break-all; margin-top: 24px; padding-top: 20px; border-top: 1px solid #1f2937; }
        .footer { font-size: 11px; color: #475569; text-align: center; margin-top: 28px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">DEZORYN TECHNOLOGY • CONTROL PLANE</div>
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received an administrative request to reset the password for your account associated with <strong>${toEmail}</strong>.</p>
        <div class="btn-container">
          <a href="${resetUrl}" class="btn" target="_blank">Reset Administrator Password</a>
        </div>
        <div class="expiry-note">
          ⏱️ This single-use password recovery link expires in <strong>1 hour</strong>. Once consumed, all existing active sessions will be terminated for security.
        </div>
        <p>If you did not initiate this recovery request, please disregard this email. Your credentials remain safe.</p>
        <div class="link-alt">
          Direct Reset URL:<br>
          <a href="${resetUrl}" style="color: #60a5fa;">${resetUrl}</a>
        </div>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY Corp. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const textBody = `Reset Your DEZORYN Administrator Password\n\nWe received a request to reset your password for ${toEmail}.\n\nVisit the link below to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    console.log(`[EMAIL DISPATCH] Sending password reset email to ${toEmail}...`);

    const info = await transporter.sendMail({
      from: getSenderAddress(),
      to: toEmail,
      subject: "Reset Your DEZORYN Administrator Password",
      text: textBody,
      html: htmlBody,
    });

    console.log(`[EMAIL DISPATCH] ✓ Email successfully sent to ${toEmail} (Message ID: ${info.messageId})`);

    return {
      sent: true,
      providerConfigured: true,
      message: `Password reset email dispatched to ${toEmail}`,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error("[EMAIL DISPATCH] ✗ Failed to dispatch email:", err.message || err);
    return {
      sent: false,
      providerConfigured: true,
      message: err.message || "Failed to dispatch email",
    };
  }
}

// -----------------------------------------------------------------------------
// 2. WEBSITE CONTACT & SALES INQUIRIES
// -----------------------------------------------------------------------------

export async function sendLeadInquiryEmails(
  lead: LeadEmailData
): Promise<{ client: EmailDispatchResult; admin: EmailDispatchResult }> {
  const transporter = createTransporter();
  const from = getSenderAddress();
  const adminRecipient = getAdminRecipient();

  // If SMTP is not yet configured, log clean console report
  if (!transporter) {
    console.log("\n========================================================================");
    console.log(`[EMAIL DISPATCH] New Website Lead Received: ${lead.email}`);
    console.log(`  Name: ${lead.name} | Company: ${lead.company} | Country: ${lead.country}`);
    console.log(`  Solution: ${lead.solution || "General"} | Source: ${lead.source}`);
    console.log(`  Requirements: ${lead.requirement}`);
    console.log("------------------------------------------------------------------------");
    console.log("ℹ️  SMTP is not configured in backend/.env. Client and Admin emails were logged.");
    console.log("========================================================================\n");

    const unconfigured: EmailDispatchResult = {
      sent: false,
      providerConfigured: false,
      message: "SMTP not configured; lead logged to console.",
    };
    return { client: unconfigured, admin: unconfigured };
  }

  // 1. Client Confirmation Email
  const clientHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Contacting DEZORYN TECHNOLOGY</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { font-size: 22px; font-weight: 800; color: #3b82f6; text-align: center; margin-bottom: 24px; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 12px; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
        .details-box { background-color: #0d131f; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin: 24px 0; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #172033; font-size: 13px; }
        .row:last-child { border-bottom: none; }
        .label { color: #64748b; font-weight: 500; }
        .value { color: #f1f5f9; font-weight: 600; text-align: right; }
        .footer { font-size: 11px; color: #475569; text-align: center; margin-top: 28px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">DEZORYN TECHNOLOGY</div>
        <h1>We have received your inquiry</h1>
        <p>Hello <strong>${lead.name}</strong>,</p>
        <p>Thank you for reaching out to DEZORYN TECHNOLOGY. Our enterprise solutions architecture team has received your inquiry and is reviewing your specifications.</p>
        
        <div class="details-box">
          <div class="row"><span class="label">Organization:</span><span class="value">${lead.company}</span></div>
          <div class="row"><span class="label">Interested Solution:</span><span class="value">${lead.solution || "Custom Enterprise SaaS"}</span></div>
          <div class="row"><span class="label">Region:</span><span class="value">${lead.country}</span></div>
          <div class="row"><span class="label">Date Received:</span><span class="value">${new Date().toLocaleDateString()}</span></div>
        </div>

        <p>An enterprise consultant specialized in your industry vertical will review your requirements and respond within 24 business hours.</p>
        <p>In the meantime, you can explore our published case studies and product documentation at <a href="https://dezoryn.com" style="color: #60a5fa;">dezoryn.com</a>.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY Corp. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const clientText = `Thank You for Contacting DEZORYN TECHNOLOGY\n\nHello ${lead.name},\n\nWe have received your inquiry for ${lead.company}. Our enterprise solutions team is reviewing your requirements (${lead.solution || "Enterprise SaaS"}) and will contact you within 24 business hours.\n\nBest regards,\nDEZORYN TECHNOLOGY Team`;

  // 2. Admin Team Alert Email
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Website Lead Ingestion</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 620px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; }
        .badge { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table td { padding: 10px 12px; border-bottom: 1px solid #1f2937; font-size: 13px; }
        .table td.lbl { color: #64748b; font-weight: 600; width: 35%; }
        .table td.val { color: #f8fafc; font-weight: 500; }
        .req { background-color: #0d131f; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; font-family: monospace; font-size: 13px; color: #94a3b8; white-space: pre-wrap; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">Inbound Lead Alert</div>
        <h1>New Inquiry from ${lead.company}</h1>
        
        <table class="table">
          <tr><td class="lbl">Contact Name</td><td class="val">${lead.name}</td></tr>
          <tr><td class="lbl">Email</td><td class="val"><a href="mailto:${lead.email}" style="color: #60a5fa;">${lead.email}</a></td></tr>
          <tr><td class="lbl">Phone</td><td class="val">${lead.phone || "N/A"}</td></tr>
          <tr><td class="lbl">Company</td><td class="val">${lead.company} (${lead.companySize || "N/A"})</td></tr>
          <tr><td class="lbl">Country</td><td class="val">${lead.country}</td></tr>
          <tr><td class="lbl">Interested Solution</td><td class="val">${lead.solution || "N/A"}</td></tr>
          <tr><td class="lbl">Budget Range</td><td class="val">${lead.budget || "N/A"}</td></tr>
          <tr><td class="lbl">Lead Source</td><td class="val">${lead.source}</td></tr>
        </table>

        <div style="font-size: 12px; font-weight: 600; color: #94a3b8; margin-top: 12px;">Client Requirements / Note:</div>
        <div class="req">${lead.requirement}</div>
      </div>
    </body>
    </html>
  `;

  let clientResult: EmailDispatchResult = { sent: false, providerConfigured: true };
  let adminResult: EmailDispatchResult = { sent: false, providerConfigured: true };

  try {
    const infoClient = await transporter.sendMail({
      from,
      to: lead.email,
      subject: "Thank You for Contacting DEZORYN TECHNOLOGY",
      text: clientText,
      html: clientHtml,
    });
    clientResult = { sent: true, providerConfigured: true, messageId: infoClient.messageId };
    console.log(`[EMAIL DISPATCH] ✓ Confirmation sent to customer: ${lead.email}`);
  } catch (err: any) {
    console.error(`[EMAIL DISPATCH] ✗ Failed to send client confirmation to ${lead.email}:`, err?.message || err);
    clientResult = { sent: false, providerConfigured: true, message: err?.message };
  }

  try {
    const infoAdmin = await transporter.sendMail({
      from,
      to: adminRecipient,
      subject: `[New Website Lead] ${lead.company} — ${lead.name}`,
      text: `New Lead:\nName: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company}\nPhone: ${lead.phone || "N/A"}\nSolution: ${lead.solution || "N/A"}\nRequirements: ${lead.requirement}`,
      html: adminHtml,
    });
    adminResult = { sent: true, providerConfigured: true, messageId: infoAdmin.messageId };
    console.log(`[EMAIL DISPATCH] ✓ Lead notification alert dispatched to admin: ${adminRecipient}`);
  } catch (err: any) {
    console.error(`[EMAIL DISPATCH] ✗ Failed to send admin alert to ${adminRecipient}:`, err?.message || err);
    adminResult = { sent: false, providerConfigured: true, message: err?.message };
  }

  return { client: clientResult, admin: adminResult };
}

// -----------------------------------------------------------------------------
// 3. WEBSITE PRODUCT DEMO BOOKINGS
// -----------------------------------------------------------------------------

export async function sendDemoBookingEmails(
  demo: DemoEmailData
): Promise<{ client: EmailDispatchResult; admin: EmailDispatchResult }> {
  const transporter = createTransporter();
  const from = getSenderAddress();
  const adminRecipient = getAdminRecipient();

  if (!transporter) {
    console.log("\n========================================================================");
    console.log(`[EMAIL DISPATCH] New Demo Request Booked: ${demo.businessEmail}`);
    console.log(`  Contact: ${demo.contactName} | Phone: ${demo.phone || "N/A"} | Company: ${demo.company}`);
    console.log(`  Product: ${demo.productSlug} | Date: ${demo.preferredDate} at ${demo.preferredTime} (${demo.timeZone})`);
    console.log("------------------------------------------------------------------------");
    console.log("ℹ️  SMTP is not configured in backend/.env. Demo request logged to console.");
    console.log("========================================================================\n");

    const unconfigured: EmailDispatchResult = {
      sent: false,
      providerConfigured: false,
      message: "SMTP not configured; demo booking logged to console.",
    };
    return { client: unconfigured, admin: unconfigured };
  }

  const clientHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your DEZORYN Product Demo Request</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { font-size: 22px; font-weight: 800; color: #3b82f6; text-align: center; margin-bottom: 24px; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
        .box { background-color: #0d131f; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin: 24px 0; }
        .item { padding: 6px 0; border-bottom: 1px solid #172033; font-size: 13px; display: flex; justify-content: space-between; }
        .item:last-child { border-bottom: none; }
        .lbl { color: #64748b; }
        .val { color: #f8fafc; font-weight: 600; text-align: right; }
        .footer { font-size: 11px; color: #475569; text-align: center; margin-top: 28px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">DEZORYN TECHNOLOGY</div>
        <h1>Your Demo Request is Scheduled</h1>
        <p>Hello <strong>${demo.contactName}</strong>,</p>
        <p>Thank you for booking an enterprise demonstration of DEZORYN's <strong>${demo.productSlug}</strong> platform for <strong>${demo.company}</strong>.</p>
        
        <div class="box">
          <div class="item"><span class="lbl">Platform:</span><span class="val">${demo.productSlug}</span></div>
          <div class="item"><span class="lbl">Requested Date:</span><span class="val">${demo.preferredDate}</span></div>
          <div class="item"><span class="lbl">Preferred Time:</span><span class="val">${demo.preferredTime} (${demo.timeZone})</span></div>
          <div class="item"><span class="lbl">Country:</span><span class="val">${demo.country}</span></div>
        </div>

        <p>A senior solutions consultant will review your organization's workflow needs and dispatch a dedicated Google Meet / Zoom calendar invite before the session.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY Corp. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Demo Booking Request</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 620px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; }
        .badge { display: inline-block; background-color: #059669; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table td { padding: 10px 12px; border-bottom: 1px solid #1f2937; font-size: 13px; }
        .table td.lbl { color: #64748b; font-weight: 600; width: 35%; }
        .table td.val { color: #f8fafc; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">Demo Scheduled</div>
        <h1>Demo Request: ${demo.productSlug} for ${demo.company}</h1>
        
        <table class="table">
          <tr><td class="lbl">Contact Name</td><td class="val">${demo.contactName}</td></tr>
          <tr><td class="lbl">Business Email</td><td class="val"><a href="mailto:${demo.businessEmail}" style="color: #60a5fa;">${demo.businessEmail}</a></td></tr>
          ${demo.phone ? `<tr><td class="lbl">Phone / Mobile</td><td class="val"><a href="tel:${demo.phone}" style="color: #10b981; font-weight: bold;">${demo.phone}</a></td></tr>` : ""}
          <tr><td class="lbl">Organization</td><td class="val">${demo.company}</td></tr>
          <tr><td class="lbl">Product</td><td class="val">${demo.productSlug}</td></tr>
          <tr><td class="lbl">Date & Time</td><td class="val">${demo.preferredDate} at ${demo.preferredTime} (${demo.timeZone})</td></tr>
          <tr><td class="lbl">Region</td><td class="val">${demo.country}</td></tr>
          <tr><td class="lbl">Notes</td><td class="val">${demo.notes || "None"}</td></tr>
        </table>
      </div>
    </body>
    </html>
  `;

  let clientResult: EmailDispatchResult = { sent: false, providerConfigured: true };
  let adminResult: EmailDispatchResult = { sent: false, providerConfigured: true };

  try {
    const infoClient = await transporter.sendMail({
      from,
      to: demo.businessEmail,
      subject: `Your DEZORYN Product Demo Request: ${demo.productSlug}`,
      text: `Hello ${demo.contactName},\n\nYour product demo request for ${demo.productSlug} on ${demo.preferredDate} at ${demo.preferredTime} (${demo.timeZone}) has been received. Our solutions team will reach out with calendar invitation details.\n\nDEZORYN TECHNOLOGY`,
      html: clientHtml,
    });
    clientResult = { sent: true, providerConfigured: true, messageId: infoClient.messageId };
    console.log(`[EMAIL DISPATCH] ✓ Demo confirmation sent to customer: ${demo.businessEmail}`);
  } catch (err: any) {
    console.error(`[EMAIL DISPATCH] ✗ Failed to send demo confirmation to ${demo.businessEmail}:`, err?.message || err);
    clientResult = { sent: false, providerConfigured: true, message: err?.message };
  }

  try {
    const infoAdmin = await transporter.sendMail({
      from,
      to: adminRecipient,
      subject: `[Demo Scheduled] ${demo.productSlug} — ${demo.company} (${demo.contactName})`,
      text: `Demo Requested:\nContact: ${demo.contactName} (${demo.businessEmail})\nCompany: ${demo.company}\nProduct: ${demo.productSlug}\nTime: ${demo.preferredDate} at ${demo.preferredTime} (${demo.timeZone})\nNotes: ${demo.notes || "None"}`,
      html: adminHtml,
    });
    adminResult = { sent: true, providerConfigured: true, messageId: infoAdmin.messageId };
    console.log(`[EMAIL DISPATCH] ✓ Demo booking alert sent to admin: ${adminRecipient}`);
  } catch (err: any) {
    console.error(`[EMAIL DISPATCH] ✗ Failed to send demo booking alert to ${adminRecipient}:`, err?.message || err);
    adminResult = { sent: false, providerConfigured: true, message: err?.message };
  }

  return { client: clientResult, admin: adminResult };
}

// -----------------------------------------------------------------------------
// 4. WEBSITE NEWSLETTER SUBSCRIPTIONS
// -----------------------------------------------------------------------------

export async function sendNewsletterWelcomeEmail(toEmail: string): Promise<EmailDispatchResult> {
  const transporter = createTransporter();
  const from = getSenderAddress();

  if (!transporter) {
    console.log(`[EMAIL DISPATCH] Newsletter welcome email queued for ${toEmail} (SMTP not configured in .env).`);
    return {
      sent: false,
      providerConfigured: false,
      message: "SMTP not configured; newsletter welcome logged to console.",
    };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to DEZORYN Engineering Updates</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { font-size: 22px; font-weight: 800; color: #3b82f6; text-align: center; margin-bottom: 24px; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
        .footer { font-size: 11px; color: #475569; text-align: center; margin-top: 28px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">DEZORYN TECHNOLOGY</div>
        <h1>Welcome to Engineering Updates</h1>
        <p>Hello,</p>
        <p>Thank you for subscribing to DEZORYN TECHNOLOGY technology briefings, cloud architecture whitepapers, and enterprise SaaS releases.</p>
        <p>You will receive curated bi-weekly updates on modern software architecture, enterprise automation, and AI workflows.</p>
        <p>You can manage your subscription preferences or read historical whitepapers anytime at <a href="https://dezoryn.com/resources" style="color: #60a5fa;">dezoryn.com/resources</a>.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY Corp. All rights reserved.
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: "Welcome to DEZORYN Engineering Updates",
      text: "Welcome to DEZORYN Engineering Updates!\n\nThank you for subscribing to our architecture whitepapers and product releases.\n\nDEZORYN TECHNOLOGY",
      html,
    });
    console.log(`[EMAIL DISPATCH] ✓ Newsletter welcome sent to ${toEmail} (Message ID: ${info.messageId})`);
    return { sent: true, providerConfigured: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[EMAIL DISPATCH] ✗ Failed to send newsletter welcome to ${toEmail}:`, err?.message || err);
    return { sent: false, providerConfigured: true, message: err?.message };
  }
}
