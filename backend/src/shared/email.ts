/**
 * DEZORYN TECHNOLOGY — Administrative Email Dispatcher
 * Dispatches password reset emails and system alerts via Nodemailer (SMTP/Gmail/SendGrid/AWS SES).
 */

import nodemailer from "nodemailer";

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailDispatchResult {
  sent: boolean;
  providerConfigured: boolean;
  message?: string;
  messageId?: string;
}

/**
 * Creates a Nodemailer transport instance if SMTP environment variables are present.
 */
function createTransporter() {
  const service = process.env.SMTP_SERVICE; // e.g. 'gmail'
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (service && user && pass) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return null;
}

/**
 * Sends a password reset email to the specified administrative email address.
 */
export async function sendAdminPasswordResetEmail(
  toEmail: string,
  rawToken: string
): Promise<EmailDispatchResult> {
  const adminBaseUrl =
    process.env.ADMIN_URL ||
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    "http://localhost:3001";

  const resetUrl = `${adminBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    '"DEZORYN Admin Console" <no-reply@dezoryn.com>';

  const transporter = createTransporter();

  // If SMTP provider is NOT configured in backend/.env:
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

  // HTML email body
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your DEZORYN Administrator Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { font-size: 24px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px; margin-bottom: 24px; text-align: center; }
        h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); }
        .link-alt { font-size: 12px; color: #64748b; word-break: break-all; margin-top: 24px; padding-top: 20px; border-top: 1px solid #1f2937; }
        .footer { font-size: 11px; color: #475569; text-align: center; margin-top: 28px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">DEZORYN CONTROL PLANE</div>
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset the administrator password for your account associated with <strong>${toEmail}</strong>.</p>
        <div class="btn-container">
          <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
        <div class="link-alt">
          If the button above does not work, copy and paste this URL into your browser:<br>
          <a href="${resetUrl}" style="color: #60a5fa;">${resetUrl}</a>
        </div>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} DEZORYN TECHNOLOGY Corp. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const textBody = `Reset Your DEZORYN Administrator Password\n\nWe received a request to reset your password for ${toEmail}.\n\nVisit the link below to set a new password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    console.log(`[EMAIL DISPATCH] Sending password reset email to ${toEmail}...`);

    const info = await transporter.sendMail({
      from: fromAddress,
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
