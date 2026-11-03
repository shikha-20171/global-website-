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
  const pass = process.env.SMTP_PASS?.trim();
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
 * Dispatches notification when a customer submits a contact inquiry, demo request, or data deletion request
 */
export async function sendInquiryNotification({ type, data }) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.warn(`[EMAIL WARNING] SMTP not configured. Notification for ${type} inquiry logged.`);
    return { sent: false };
  }

  const adminEmail = getAdminNotificationEmail();
  const title = `[DEZORYN INQUIRY] New ${type.toUpperCase()} from ${data.name || data.contactName || data.email}`;

  const html = `
    <div style="font-family: sans-serif; background-color: #0b1120; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px;">
      <h2 style="color: #38bdf8; margin-top: 0;">New ${type.toUpperCase()} Received</h2>
      <p style="color: #94a3b8;">A new inquiry has been securely registered on DEZORYN TECHNOLOGY portal.</p>
      <div style="background-color: #111827; border: 1px solid #374151; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name || data.contactName || "N/A"}</p>
        <p><strong>Email:</strong> ${data.email || data.businessEmail || "N/A"}</p>
        <p><strong>Company:</strong> ${data.company || "N/A"}</p>
        <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
        <p><strong>Country:</strong> ${data.country || "N/A"}</p>
        <p><strong>Requirement / Notes:</strong> ${data.requirement || data.notes || data.message || "N/A"}</p>
      </div>
      <p style="font-size: 12px; color: #64748b;">DEZORYN Automated Dispatch Desk • dezoryntech@gmail.com</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: getSenderAddress(),
      to: adminEmail,
      subject: title,
      html,
    });
    console.log(`[EMAIL DISPATCH] ✓ Inquiry notification sent to ${adminEmail} (Message ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send notification:`, err.message || err);
    return { sent: false, error: err.message };
  }
}

