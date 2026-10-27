import { FastifyReply, FastifyRequest } from "fastify";
import { leadsService } from "./leads.service.js";
import {
  contactInquirySchema,
  demoBookingSchema,
  newsletterSchema,
  updateLeadStatusSchema,
  updateDemoStatusSchema,
} from "./leads.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";
import { LeadPriority, LeadStatus, LeadSource } from "@prisma/client";

export class LeadsController {
  // Public
  async submitInquiry(request: FastifyRequest, reply: FastifyReply) {
    const input = contactInquirySchema.parse(request.body);
    const result = await leadsService.submitInquiry(input);
    return reply.status(201).send(
      successResponse(
        result,
        "Thank you! Your enterprise inquiry has been registered. Our architects will contact you shortly."
      )
    );
  }

  async submitDemo(request: FastifyRequest, reply: FastifyReply) {
    const input = demoBookingSchema.parse(request.body);
    const result = await leadsService.submitDemoRequest(input);
    return reply.status(201).send(
      successResponse(
        result,
        "Your demo request has been reserved. A confirmation calendar invite will be delivered."
      )
    );
  }

  async subscribeNewsletter(request: FastifyRequest, reply: FastifyReply) {
    const { email, source } = newsletterSchema.parse(request.body);
    const result = await leadsService.subscribeNewsletter(email, source);
    return reply.status(result.status === "ALREADY_SUBSCRIBED" ? 200 : 201).send(
      successResponse(result, result.message)
    );
  }

  async unsubscribeNewsletter(request: FastifyRequest, reply: FastifyReply) {
    const { email } = newsletterSchema.parse(request.body);
    const result = await leadsService.unsubscribeNewsletter(email);
    return reply.status(200).send(successResponse(result, "You have been unsubscribed from updates."));
  }

  // Admin Inquiries
  async listAdminInquiries(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const result = await leadsService.listAdminInquiries({
      search: query.search,
      status: query.status as LeadStatus,
      source: query.source as LeadSource,
      priority: query.priority as LeadPriority,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 50,
    });
    return reply.status(200).send(
      successResponse(result.items, "Inquiries loaded", {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    );
  }

  async getAdminInquiryById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const lead = await leadsService.getAdminInquiryById(id);
    return reply.status(200).send(successResponse(lead));
  }

  async updateAdminInquiry(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateLeadStatusSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await leadsService.updateAdminInquiry(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Inquiry updated successfully"));
  }

  async deleteAdminInquiry(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await leadsService.deleteAdminInquiry(id, actorName);
    return reply.status(200).send(successResponse(result, "Inquiry deleted successfully"));
  }

  // Admin Demos
  async listAdminDemos(_request: FastifyRequest, reply: FastifyReply) {
    const demos = await leadsService.listAdminDemos();
    return reply.status(200).send(successResponse(demos));
  }

  async updateAdminDemo(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateDemoStatusSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await leadsService.updateAdminDemo(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Demo updated successfully"));
  }

  async deleteAdminDemo(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await leadsService.deleteAdminDemo(id, actorName);
    return reply.status(200).send(successResponse(result, "Demo deleted successfully"));
  }

  // Admin Subscribers
  async listAdminSubscribers(_request: FastifyRequest, reply: FastifyReply) {
    const subs = await leadsService.listAdminSubscribers();
    return reply.status(200).send(successResponse(subs));
  }

  async deleteAdminSubscriber(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await leadsService.deleteAdminSubscriber(id, actorName);
    return reply.status(200).send(successResponse(result, "Subscriber removed successfully"));
  }
}

export const leadsController = new LeadsController();
