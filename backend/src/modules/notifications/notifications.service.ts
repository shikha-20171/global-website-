import { prisma } from "../../config/database.js";
import { LeadStatus } from "@prisma/client";

export class NotificationsService {
  async getNotifications() {
    // 1. Unread/New inquiries
    const newInquiries = await prisma.leadEnquiry.findMany({
      where: { status: LeadStatus.NEW },
      take: 5,
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        company: true,
        name: true,
        email: true,
        source: true,
        submittedAt: true,
      },
    });

    // 2. Pending Demos
    const pendingDemos = await prisma.demoRequest.findMany({
      where: { status: "PENDING" },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        contactName: true,
        company: true,
        productSlug: true,
        preferredDate: true,
        preferredTime: true,
        createdAt: true,
      },
    });

    // 3. System Alerts / Failed Logins
    const failedLogins = await prisma.auditLog.findMany({
      where: {
        module: "Authentication",
        result: "FAILURE",
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        adminName: true,
        action: true,
        ipAddress: true,
        details: true,
        createdAt: true,
      },
    });

    return {
      unreadCount: newInquiries.length + pendingDemos.length + failedLogins.length,
      inquiries: newInquiries.map((i: any) => ({
        id: i.id,
        type: "lead_inquiry",
        title: `New enterprise lead from ${i.company}`,
        message: `${i.name} (${i.email}) submitted an inquiry via ${i.source}`,
        timestamp: i.submittedAt,
      })),
      demos: pendingDemos.map((d: any) => ({
        id: d.id,
        type: "demo_request",
        title: `Walkthrough requested for ${d.productSlug}`,
        message: `${d.contactName} (${d.company}) scheduled for ${d.preferredDate} at ${d.preferredTime}`,
        timestamp: d.createdAt,
      })),
      securityAlerts: failedLogins.map((s: any) => ({
        id: s.id,
        type: "security_alert",
        title: "Administrative Login Failed",
        message: `${s.adminName} from ${s.ipAddress || "Unknown IP"}: ${s.details}`,
        timestamp: s.createdAt,
      })),
    };
  }
}

export const notificationsService = new NotificationsService();
