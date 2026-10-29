import { prisma } from "../../config/database.js";
import { RateLimitError, NotFoundError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import {
  LeadSource,
  LeadPriority,
  LeadStatus,
  DemoStatus,
  NewsletterStatus,
  AuditResult,
} from "@prisma/client";
import {
  ContactInquiryInput,
  DemoBookingInput,
  UpdateLeadStatusInput,
  UpdateDemoStatusInput,
} from "./leads.schema.js";
import {
  sendLeadInquiryEmails,
  sendDemoBookingEmails,
  sendNewsletterWelcomeEmail,
} from "../../shared/email.js";

export class LeadsService {
  // --- 1. Public Contact / Sales Inquiries ---
  async submitInquiry(input: ContactInquiryInput) {
    const email = input.email.toLowerCase().trim();

    // Spam defense: check identical submission in last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existingRecent = await prisma.leadEnquiry.findFirst({
      where: {
        email,
        submittedAt: { gte: twoMinutesAgo },
      },
    });

    if (existingRecent) {
      const updated = await prisma.leadEnquiry.update({
        where: { id: existingRecent.id },
        data: {
          name: input.name,
          company: input.company,
          phone: input.phone || existingRecent.phone,
          country: input.country,
          companySize: input.companySize || existingRecent.companySize,
          interestedSolution: input.solution || existingRecent.interestedSolution,
          budgetRange: input.budget || existingRecent.budgetRange,
          requirement: input.req,
        },
      });
      return { id: updated.id, status: updated.status };
    }

    let source: LeadSource = LeadSource.GENERAL_CONTACT;
    if (input.source === "contact-sales" || input.source === "sales") {
      source = LeadSource.CONTACT_SALES;
    } else if (input.source === "start-trial" || input.source === "trial") {
      source = LeadSource.START_TRIAL;
    } else if (input.source === "partnership") {
      source = LeadSource.PARTNERSHIP;
    } else if (input.source === "demo" || input.source === "demo-request" || input.source === "demo_request") {
      source = LeadSource.DEMO_REQUEST;
    }

    const lead = await prisma.leadEnquiry.create({
      data: {
        name: input.name,
        company: input.company,
        email,
        phone: input.phone || null,
        country: input.country,
        companySize: input.companySize || null,
        interestedSolution: input.solution || null,
        budgetRange: input.budget || null,
        requirement: input.req,
        source,
        priority: LeadPriority.HIGH,
        status: LeadStatus.NEW,
        timeline: [
          {
            date: new Date().toISOString(),
            text: `Inquiry submitted via public website (${input.source || "contact"})`,
          },
        ],
      },
    });

    // Dispatch confirmation to user and notification to admin
    sendLeadInquiryEmails({
      name: input.name,
      email,
      company: input.company,
      phone: input.phone || undefined,
      country: input.country,
      companySize: input.companySize || undefined,
      solution: input.solution || undefined,
      budget: input.budget || undefined,
      requirement: input.req,
      source: input.source || "contact",
    }).catch((err) => {
      console.warn("[LEAD EMAIL DISPATCH ERROR]:", err?.message || err);
    });

    return { id: lead.id, status: lead.status };
  }

  // --- 2. Public Demo Requests ---
  async submitDemoRequest(input: DemoBookingInput) {
    const email = input.businessEmail.toLowerCase().trim();

    // Helper to create DemoRequest with column fallback
    const executeInsert = async (withPhone = true) => {
      const data: any = {
        contactName: input.contactName,
        company: input.company,
        businessEmail: email,
        country: input.country,
        productSlug: input.productSlug,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        timeZone: input.timeZone || "UTC",
        notes: input.notes || null,
        status: DemoStatus.PENDING,
      };
      if (withPhone) {
        data.phone = input.phone || null;
      } else if (input.phone) {
        data.notes = [input.notes, `Phone: ${input.phone}`].filter(Boolean).join(" | ");
      }
      return prisma.demoRequest.create({ data });
    };

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    let existingRecent: any = null;
    try {
      existingRecent = await prisma.demoRequest.findFirst({
        where: {
          businessEmail: email,
          productSlug: input.productSlug,
          createdAt: { gte: twoMinutesAgo },
        },
      });
    } catch (findErr: any) {
      console.warn("[DEMO FIND WARNING]:", findErr?.message);
    }

    if (existingRecent) {
      try {
        const updated = await prisma.demoRequest.update({
          where: { id: existingRecent.id },
          data: {
            contactName: input.contactName,
            company: input.company,
            phone: input.phone || existingRecent.phone,
            country: input.country,
            preferredDate: input.preferredDate,
            preferredTime: input.preferredTime,
            timeZone: input.timeZone || existingRecent.timeZone,
            notes: input.notes || existingRecent.notes,
          },
        });
        return { id: updated.id, status: updated.status };
      } catch (updateErr: any) {
        console.warn("[DEMO UPDATE RETRY]:", updateErr?.message);
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "DemoRequest" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
        } catch (_) {}
      }
    }

    let demo: any;
    try {
      demo = await executeInsert(true);
    } catch (insertErr: any) {
      console.warn("[DEMO INSERT RETRY with self-heal]:", insertErr?.message);
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "DemoRequest" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
        demo = await executeInsert(true);
      } catch (retryErr: any) {
        console.warn("[DEMO INSERT FALLBACK without phone column]:", retryErr?.message);
        demo = await executeInsert(false);
      }
    }

    // Dispatch confirmation to user and notification to sales admin
    sendDemoBookingEmails({
      contactName: input.contactName,
      businessEmail: email,
      phone: input.phone || undefined,
      company: input.company,
      country: input.country,
      productSlug: input.productSlug,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      timeZone: input.timeZone || "UTC",
      notes: input.notes || undefined,
    }).catch((err) => {
      console.warn("[DEMO EMAIL DISPATCH ERROR]:", err?.message || err);
    });

    return { id: demo.id, status: demo.status };
  }

  // --- 3. Newsletter Subscriptions ---
  async subscribeNewsletter(email: string, source: string = "website_footer") {
    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: cleanEmail },
    });

    if (existing && existing.status === NewsletterStatus.SUBSCRIBED) {
      return {
        id: existing.id,
        email: existing.email,
        status: "ALREADY_SUBSCRIBED",
        message: "This email is already registered to receive DEZORYN engineering updates.",
      };
    }

    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: cleanEmail },
      update: {
        status: NewsletterStatus.SUBSCRIBED,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      },
      create: {
        email: cleanEmail,
        source,
        status: NewsletterStatus.SUBSCRIBED,
      },
    });

    // Dispatch welcome email to subscriber
    sendNewsletterWelcomeEmail(cleanEmail).catch((err) => {
      console.warn("[NEWSLETTER EMAIL DISPATCH ERROR]:", err?.message || err);
    });

    return {
      id: subscription.id,
      email: subscription.email,
      status: subscription.status,
      message: "Subscription confirmed.",
    };
  }

  async unsubscribeNewsletter(email: string) {
    const cleanEmail = email.toLowerCase().trim();

    await prisma.newsletterSubscription.updateMany({
      where: { email: cleanEmail },
      data: {
        status: NewsletterStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    });

    return { unsubscribed: true };
  }

  // --- 4. Admin Lead Management ---
  async listAdminInquiries(params: {
    search?: string;
    status?: LeadStatus;
    source?: LeadSource;
    priority?: LeadPriority;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (params.status) where.status = params.status;
    if (params.source) where.source = params.source;
    if (params.priority) where.priority = params.priority;

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { company: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { requirement: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.leadEnquiry.findMany({
        where,
        include: {
          assignedOwner: { select: { id: true, name: true, email: true } },
        },
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.leadEnquiry.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminInquiryById(id: string) {
    const lead = await prisma.leadEnquiry.findUnique({
      where: { id },
      include: {
        assignedOwner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!lead) throw new NotFoundError("Lead inquiry not found");
    return lead;
  }

  async updateAdminInquiry(id: string, input: UpdateLeadStatusInput, actorName: string) {
    const existing = await prisma.leadEnquiry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Lead inquiry not found");

    const timeline = (existing.timeline as any[]) || [];
    if (input.notes) {
      timeline.push({
        date: new Date().toISOString(),
        text: `[${actorName}] Note: ${input.notes}`,
      });
    }
    if (input.status && input.status !== existing.status) {
      timeline.push({
        date: new Date().toISOString(),
        text: `[${actorName}] Pipeline status updated: ${existing.status} → ${input.status}`,
      });
    }

    const updated = await prisma.leadEnquiry.update({
      where: { id },
      data: {
        status: input.status,
        priority: input.priority || existing.priority,
        estimatedValueUsd: input.estimatedValueUsd !== undefined ? input.estimatedValueUsd : existing.estimatedValueUsd,
        assignedOwnerId: input.assignedOwnerId !== undefined ? input.assignedOwnerId : existing.assignedOwnerId,
        administrativeNotes: input.notes
          ? `${existing.administrativeNotes ? existing.administrativeNotes + "\n\n" : ""}[${new Date().toLocaleDateString()}] ${input.notes}`
          : existing.administrativeNotes,
        timeline,
      },
      include: {
        assignedOwner: { select: { id: true, name: true, email: true } },
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Lead Pipeline Status",
      module: "Inbound CRM",
      entityType: "LeadEnquiry",
      entityId: id,
      details: `Updated inquiry for "${updated.company}" to status ${updated.status}`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteAdminInquiry(id: string, actorName: string) {
    const lead = await prisma.leadEnquiry.findUnique({ where: { id } });
    if (!lead) throw new NotFoundError("Lead inquiry not found");

    await prisma.leadEnquiry.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Lead Inquiry",
      module: "Inbound CRM",
      entityType: "LeadEnquiry",
      entityId: id,
      details: `Deleted lead inquiry for "${lead.company}" (${lead.email})`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- 5. Admin Demo Requests ---
  async listAdminDemos() {
    let demos: any[] = [];
    try {
      demos = await prisma.demoRequest.findMany({
        include: {
          assignedOwner: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (err: any) {
      console.warn("[DEMO LIST RETRY with self-heal]:", err?.message);
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "DemoRequest" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
        demos = await prisma.demoRequest.findMany({
          include: {
            assignedOwner: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        });
      } catch (retryErr: any) {
        console.error("[DEMO LIST ERROR]:", retryErr?.message);
        demos = [];
      }
    }

    let trialLeads: any[] = [];
    try {
      trialLeads = await prisma.leadEnquiry.findMany({
        where: {
          source: { in: [LeadSource.START_TRIAL, LeadSource.DEMO_REQUEST] },
        },
        include: {
          assignedOwner: { select: { id: true, name: true, email: true } },
        },
        orderBy: { submittedAt: "desc" },
      });
    } catch (trialErr: any) {
      console.warn("[TRIAL LEADS FETCH WARNING]:", trialErr?.message);
    }

    const mappedTrialLeads = trialLeads.map((tl: any) => ({
      id: tl.id,
      contactName: tl.name,
      company: tl.company,
      businessEmail: tl.email,
      phone: tl.phone || null,
      country: tl.country,
      productSlug: tl.interestedSolution || "enterprise-platform",
      preferredDate: "14-Day Free Trial",
      preferredTime: "Instant Provisioning",
      timeZone: "UTC",
      meetingLink: null,
      attendeesCount: 1,
      notes: tl.requirement,
      assignedOwnerId: tl.assignedOwnerId,
      assignedOwner: tl.assignedOwner,
      status: tl.status === LeadStatus.NEW ? DemoStatus.PENDING : DemoStatus.CONFIRMED,
      createdAt: tl.submittedAt,
      updatedAt: tl.updatedAt,
    }));

    // Merge and de-duplicate by businessEmail if both exist
    const demoEmails = new Set(demos.map((d: any) => (d.businessEmail || "").toLowerCase()));
    const uniqueTrialDemos = mappedTrialLeads.filter(
      (tl: any) => !demoEmails.has((tl.businessEmail || "").toLowerCase())
    );

    return [...demos, ...uniqueTrialDemos].sort(
      (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async updateAdminDemo(id: string, input: UpdateDemoStatusInput, actorName: string) {
    const updated = await prisma.demoRequest.update({
      where: { id },
      data: {
        status: input.status,
        meetingLink: input.meetingLink,
        notes: input.notes,
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Demo Status",
      module: "Inbound CRM",
      entityType: "DemoRequest",
      entityId: id,
      details: `Demo status updated to ${updated.status} for ${updated.company}`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteAdminDemo(id: string, actorName: string) {
    const demo = await prisma.demoRequest.findUnique({ where: { id } });
    if (!demo) throw new NotFoundError("Demo request not found");

    await prisma.demoRequest.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Demo Request",
      module: "Inbound CRM",
      entityType: "DemoRequest",
      entityId: id,
      details: `Deleted demo request for "${demo.company}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // --- 6. Admin Subscribers ---
  async listAdminSubscribers() {
    return prisma.newsletterSubscription.findMany({
      orderBy: { subscribedAt: "desc" },
    });
  }

  async deleteAdminSubscriber(id: string, actorName: string) {
    const sub = await prisma.newsletterSubscription.findUnique({ where: { id } });
    if (!sub) throw new NotFoundError("Subscriber not found");

    await prisma.newsletterSubscription.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Newsletter Subscriber",
      module: "Inbound CRM",
      entityType: "NewsletterSubscription",
      entityId: id,
      details: `Deleted subscriber "${sub.email}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const leadsService = new LeadsService();
