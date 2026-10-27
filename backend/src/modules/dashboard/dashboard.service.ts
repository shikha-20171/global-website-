import { prisma } from "../../config/database.js";
import { PublishStatus, LeadStatus } from "@prisma/client";

export class DashboardService {
  async getDashboardSummary() {
    const [
      totalPages,
      publishedPages,
      totalProducts,
      publishedProducts,
      totalProjects,
      publishedProjects,
      blogCount,
      caseStudiesCount,
      faqsCount,
      newInquiries,
      totalInquiries,
      pendingDemos,
      subscribersCount,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.websitePage.count(),
      prisma.websitePage.count({ where: { status: PublishStatus.PUBLISHED } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: PublishStatus.PUBLISHED } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: PublishStatus.PUBLISHED } }),
      prisma.blogPost.count({ where: { status: PublishStatus.PUBLISHED } }),
      prisma.caseStudy.count({ where: { status: PublishStatus.PUBLISHED } }),
      prisma.faq.count({ where: { isPublished: true } }),
      prisma.leadEnquiry.count({ where: { status: LeadStatus.NEW } }),
      prisma.leadEnquiry.count(),
      prisma.demoRequest.count({ where: { status: "PENDING" } }),
      prisma.newsletterSubscription.count({ where: { status: "SUBSCRIBED" } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          adminName: true,
          action: true,
          module: true,
          entityType: true,
          details: true,
          result: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      cms: {
        totalPages,
        publishedPages,
      },
      products: {
        total: totalProducts,
        published: publishedProducts,
      },
      projects: {
        total: totalProjects,
        published: publishedProjects,
      },
      resources: {
        blogPosts: blogCount,
        caseStudies: caseStudiesCount,
        faqs: faqsCount,
        totalResources: blogCount + caseStudiesCount + faqsCount,
      },
      crm: {
        newInquiries,
        totalInquiries,
        pendingDemos,
        subscribers: subscribersCount,
      },
      recentActivity: recentAuditLogs,
    };
  }
}

export const dashboardService = new DashboardService();
