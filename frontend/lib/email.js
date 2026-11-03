/**
 * DEZORYN TECHNOLOGY — Enterprise Email Dispatcher Service
 * Powered by Nodemailer with Gmail SMTP / Custom SMTP.
 */

import nodemailer from "nodemailer";

let cachedTransporter = null;

export function getEmailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const service = process.env.SMTP_SERVICE?.trim() || "gmail";
  const user = process.env.SMTP_USER?.trim() || "dezoryntech@gmail.com";
  const pass = process.env.SMTP_PASS?.trim() || "pylr nuoq vzxc oosv";
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const portStr = process.env.SMTP_PORT?.trim();
  const port = portStr ? parseInt(portStr, 10) : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (service.toLowerCase() === "gmail" && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    return cachedTransporter;
  }

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
    return cachedTransporter;
  }

  return null;
}

export function getSenderAddress() {
  return (
    process.env.SMTP_FROM ||
    `"DEZORYN TECHNOLOGY" <${process.env.SMTP_USER || "dezoryntech@gmail.com"}>`
  );
}

export function getAdminNotificationEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || "dezoryntech@gmail.com";
}

/**
 * Dispatches notification when a customer submits a contact inquiry, demo request, or data deletion request.
 * Sends:
 * 1. Admin Alert to dezoryntech@gmail.com with complete client requirements.
 * 2. Client Confirmation auto-reply to the customer's email.
 */
export async function sendInquiryNotification({ type, data }) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn(`[EMAIL WARNING] SMTP not configured. Notification for ${type} inquiry logged.`);
    return { sent: false };
  }

  const from = getSenderAddress();
  const adminEmail = getAdminNotificationEmail();
  const clientEmail = (data.email || data.businessEmail || "").trim().toLowerCase();
  const clientName = data.name || data.contactName || "Valued Partner";
  const title = `[DEZORYN INQUIRY] New ${type.toUpperCase()} from ${clientName}`;

  // 1. Admin Alert HTML
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px;">
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px;">New ${type.toUpperCase()} Received</h2>
      <p style="color: #94a3b8; font-size: 14px;">A new inquiry has been securely registered on DEZORYN TECHNOLOGY corporate portal.</p>
      <div style="background-color: #111827; border: 1px solid #374151; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; line-height: 1.6;">
        <p style="margin: 4px 0;"><strong>Inquiry Type:</strong> <span style="color: #38bdf8;">${type.toUpperCase()}</span></p>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${clientName}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${clientEmail}" style="color: #60a5fa;">${clientEmail || "N/A"}</a></p>
        <p style="margin: 4px 0;"><strong>Company:</strong> ${data.company || "N/A"}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${data.phone || "N/A"}</p>
        <p style="margin: 4px 0;"><strong>Country:</strong> ${data.country || "Global"}</p>
        ${data.productSlug || data.product ? `<p style="margin: 4px 0;"><strong>Product:</strong> ${data.productSlug || data.product}</p>` : ""}
        ${data.preferredDate ? `<p style="margin: 4px 0;"><strong>Preferred Schedule:</strong> ${data.preferredDate} at ${data.preferredTime || "TBD"} (${data.timeZone || "UTC"})</p>` : ""}
        <p style="margin: 8px 0 4px 0;"><strong>Requirements / Message:</strong></p>
        <div style="background: #070b16; padding: 12px; border-radius: 6px; color: #cbd5e1; font-family: monospace; font-size: 12px; white-space: pre-wrap;">${data.requirement || data.req || data.notes || data.message || "Talk to an Expert inquiry from website"}</div>
      </div>
      <p style="font-size: 11px; color: #64748b; margin-bottom: 0;">DEZORYN Automated Dispatch Desk • Notification sent to ${adminEmail}</p>
    </div>
  `;

  // 2. Client Auto-Confirmation HTML
  const clientHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 32px 24px; border-radius: 14px; border: 1px solid #1e293b; max-width: 580px; margin: 0 auto;">
      <div style="font-size: 18px; font-weight: 800; color: #38bdf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px;">DEZORYN TECHNOLOGY</div>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">Thank You for Contacting Us</h1>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">Hello <strong>${clientName}</strong>,</p>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">We have successfully received your inquiry regarding <strong>${data.company || "your organization"}</strong>. Our enterprise solutions architecture team is reviewing your requirements and will connect with you within 24 business hours.</p>
      <div style="background-color: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #cbd5e1;">
        <div style="margin-bottom: 6px;"><strong>Reference Request:</strong> ${type.toUpperCase()}</div>
        <div style="margin-bottom: 6px;"><strong>Organization:</strong> ${data.company || "Independent"}</div>
        <div><strong>Status:</strong> <span style="color: #10b981;">Assigned to Solution Architecture Triage</span></div>
      </div>
      <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">If your requirement is urgent, you can reach our executive desk directly at <a href="mailto:dezoryntech@gmail.com" style="color: #38bdf8;">dezoryntech@gmail.com</a>.</p>
      <div style="border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY CORP. • All rights reserved.
      </div>
    </div>
  `;

  // Dispatch Admin Notification
  try {
    const infoAdmin = await transporter.sendMail({
      from,
      to: adminEmail,
      subject: title,
      html: adminHtml,
    });
    console.log(`[EMAIL DISPATCH] ✓ Admin alert sent to ${adminEmail} (Message ID: ${infoAdmin.messageId})`);
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send admin alert:`, err.message || err);
  }

  // Dispatch Client Auto-Confirmation if valid customer email
  if (clientEmail && clientEmail.includes("@") && !clientEmail.includes("dezoryn.com")) {
    try {
      const infoClient = await transporter.sendMail({
        from,
        to: clientEmail,
        subject: `Thank you for contacting DEZORYN TECHNOLOGY`,
        html: clientHtml,
      });
      console.log(`[EMAIL DISPATCH] ✓ Customer confirmation sent to ${clientEmail} (Message ID: ${infoClient.messageId})`);
    } catch (clientErr) {
      console.warn(`[EMAIL NOTICE] Customer confirmation skipped/failed for ${clientEmail}:`, clientErr?.message || clientErr);
    }
  }

  return { sent: true };
}

/**
 * Dispatches welcome email for newsletter subscribers
 */
export async function sendNewsletterWelcomeEmail(toEmail) {
  const transporter = getEmailTransporter();
  if (!transporter) return { sent: false };

  const cleanEmail = String(toEmail || "").trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) return { sent: false };

  const from = getSenderAddress();
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 32px 24px; border-radius: 14px; border: 1px solid #1e293b; max-width: 580px; margin: 0 auto;">
      <div style="font-size: 18px; font-weight: 800; color: #38bdf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px;">DEZORYN TECHNOLOGY</div>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">Welcome to DEZORYN Insights</h1>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">You are now subscribed to DEZORYN TECHNOLOGY technical briefings, engineering whitepapers, and enterprise SaaS product updates.</p>
      <div style="background-color: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #cbd5e1;">
        <p style="margin: 0 0 8px 0;"><strong>What to expect:</strong></p>
        <ul style="margin: 0; padding-left: 20px; color: #94a3b8; line-height: 1.6;">
          <li>Deep dives into multi-tenant cloud architectures</li>
          <li>Enterprise automation &amp; AI integration playbooks</li>
          <li>Quarterly product releases across DEZORYN platforms</li>
        </ul>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">You can unsubscribe or manage preferences at any time by replying to this email.</p>
      <div style="border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY CORP. • Desk: dezoryntech@gmail.com
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: cleanEmail,
      subject: "Welcome to DEZORYN TECHNOLOGY Technical Insights",
      html,
    });
    console.log(`[NEWSLETTER DISPATCH] ✓ Welcome email sent to ${cleanEmail} (Message ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.warn("[NEWSLETTER ERROR]:", err?.message || err);
    return { sent: false };
  }
}
