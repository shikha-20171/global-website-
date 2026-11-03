/**
 * DEZORYN TECHNOLOGY — Administrative & Transactional Email Dispatcher
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

/**
 * Dispatches password reset email with secure 1-hour single-use token link
 */
export async function sendAdminPasswordResetEmail(toEmail, rawToken) {
  const adminBaseUrl =
    process.env.ADMIN_URL ||
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    "http://localhost:3001";

  const resetUrl = `${adminBaseUrl.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;
  const transporter = getEmailTransporter();

  if (!transporter) {
    console.warn(`[EMAIL WARNING] SMTP not configured. Local password reset URL for ${toEmail}: ${resetUrl}`);
    return {
      sent: false,
      providerConfigured: false,
      resetUrl,
      message: "SMTP not configured; reset link logged to console.",
    };
  }

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your DEZORYN Administrator Password</title>
      <style>
        body { margin: 0; padding: 24px; background-color: #050811; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
        .wrapper { max-width: 580px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        .header { background: linear-gradient(135deg, #09132c, #0d1b3e); padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1e293b; }
        .logo-text { font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #38bdf8; text-transform: uppercase; }
        .sub-badge { display: inline-block; margin-top: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 9999px; padding: 4px 12px; }
        .content { padding: 32px; }
        h1 { margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #ffffff; }
        p { margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #94a3b8; }
        .btn-box { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #0284c7); color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; box-shadow: 0 0 25px rgba(37,99,235,0.4); }
        .notice-box { background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 14px 16px; margin: 24px 0; }
        .notice-title { font-size: 12px; font-weight: 700; color: #f59e0b; margin-bottom: 4px; }
        .notice-text { font-size: 12px; color: #cbd5e1; line-height: 1.5; margin: 0; }
        .alt-box { border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 24px; }
        .alt-title { font-size: 12px; color: #64748b; margin-bottom: 6px; }
        .alt-url { font-size: 11px; color: #38bdf8; word-break: break-all; text-decoration: none; font-family: monospace; }
        .footer { background: #070b16; padding: 20px 32px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo-text">DEZORYN TECHNOLOGY</div>
          <div class="sub-badge">Administrative Security Portal</div>
        </div>
        <div class="content">
          <h1>Password Reset Request</h1>
          <p>Hello Administrator,</p>
          <p>We received an official request to reset the administrator account password associated with <strong>${toEmail}</strong>.</p>
          <div class="btn-box">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Administrator Password</a>
          </div>
          <div class="notice-box">
            <div class="notice-title">⏱️ Security &amp; Expiration Notice</div>
            <p class="notice-text">
              This recovery link is cryptographically protected and valid for <strong>1 hour</strong>. Once used, previous active administrator sessions will be revoked automatically.
            </p>
          </div>
          <p>If you did not initiate this request, no action is necessary. Your current administrative credentials remain completely secure.</p>
          <div class="alt-box">
            <div class="alt-title">Button not working? Copy and paste this link into your browser:</div>
            <a href="${resetUrl}" class="alt-url">${resetUrl}</a>
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} DEZORYN TECHNOLOGY CORP. • Secure Cloud &amp; AI Enterprise Infrastructure.<br>
          Official Administrative Notification Desk: dezoryntech@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;

  const textBody = `Reset Your DEZORYN Administrator Password\n\nWe received a request to reset the password for ${toEmail}.\n\nClick the link below to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nDEZORYN TECHNOLOGY Desk: dezoryntech@gmail.com`;

  try {
    const info = await transporter.sendMail({
      from: getSenderAddress(),
      to: toEmail,
      subject: "Reset Your DEZORYN Administrator Password",
      text: textBody,
      html: htmlBody,
    });

    console.log(`[EMAIL DISPATCH] ✓ Password reset email sent to ${toEmail} (Message ID: ${info.messageId})`);
    return {
      sent: true,
      providerConfigured: true,
      messageId: info.messageId,
      resetUrl,
    };
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send password reset email to ${toEmail}:`, err.message || err);
    throw err;
  }
}

