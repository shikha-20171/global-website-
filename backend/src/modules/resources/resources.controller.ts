import { FastifyReply, FastifyRequest } from "fastify";
import { resourcesService } from "./resources.service.js";
import {
  blogPostQuerySchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  createFaqSchema,
  updateFaqSchema,
  createJobPostingSchema,
  updateJobPostingSchema,
  createPartnerSchema,
  updatePartnerSchema,
} from "./resources.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";

export class ResourcesController {
  // Blog
  async listPublicBlogPosts(request: FastifyRequest, reply: FastifyReply) {
    const query = blogPostQuerySchema.parse(request.query);
    const result = await resourcesService.listPublicBlogPosts(query);
    return reply.status(200).send(
      successResponse(result.items, "Articles loaded", {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    );
  }

  async getPublicBlogPostBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const post = await resourcesService.getPublicBlogPostBySlug(slug);
    return reply.status(200).send(successResponse(post));
  }

  async listAdminBlogPosts(_request: FastifyRequest, reply: FastifyReply) {
    const posts = await resourcesService.listAdminBlogPosts();
    return reply.status(200).send(successResponse(posts));
  }

  async createBlogPost(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createBlogPostSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await resourcesService.createBlogPost(input, actorName);
    return reply.status(201).send(successResponse(created, "Blog post created"));
  }

  async updateBlogPost(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateBlogPostSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await resourcesService.updateBlogPost(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Blog post updated"));
  }

  async deleteBlogPost(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await resourcesService.deleteBlogPost(id, actorName);
    return reply.status(200).send(successResponse(result, "Blog post deleted"));
  }

  // Insights, Runbooks, APIs
  async listPublicInsights(_request: FastifyRequest, reply: FastifyReply) {
    const insights = await resourcesService.listPublicInsights();
    return reply.status(200).send(successResponse(insights));
  }

  async listPublicRunbooks(_request: FastifyRequest, reply: FastifyReply) {
    const runbooks = await resourcesService.listPublicRunbooks();
    return reply.status(200).send(successResponse(runbooks));
  }

  async listPublicApiResources(_request: FastifyRequest, reply: FastifyReply) {
    const apis = await resourcesService.listPublicApiResources();
    return reply.status(200).send(successResponse(apis));
  }

  // FAQs
  async listPublicFaqs(_request: FastifyRequest, reply: FastifyReply) {
    const faqs = await resourcesService.listPublicFaqs();
    return reply.status(200).send(successResponse(faqs));
  }

  async listAdminFaqs(_request: FastifyRequest, reply: FastifyReply) {
    const faqs = await resourcesService.listAdminFaqs();
    return reply.status(200).send(successResponse(faqs));
  }

  async createFaq(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createFaqSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await resourcesService.createFaq(input, actorName);
    return reply.status(201).send(successResponse(created, "FAQ created"));
  }

  async updateFaq(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateFaqSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await resourcesService.updateFaq(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "FAQ updated"));
  }

  async deleteFaq(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await resourcesService.deleteFaq(id, actorName);
    return reply.status(200).send(successResponse(result, "FAQ deleted"));
  }

  // Careers
  async listPublicJobPostings(_request: FastifyRequest, reply: FastifyReply) {
    const jobs = await resourcesService.listPublicJobPostings();
    return reply.status(200).send(successResponse(jobs));
  }

  async listAdminJobPostings(_request: FastifyRequest, reply: FastifyReply) {
    const jobs = await resourcesService.listAdminJobPostings();
    return reply.status(200).send(successResponse(jobs));
  }

  async createJobPosting(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createJobPostingSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await resourcesService.createJobPosting(input, actorName);
    return reply.status(201).send(successResponse(created, "Job posting created"));
  }

  async updateJobPosting(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateJobPostingSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await resourcesService.updateJobPosting(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Job posting updated"));
  }

  async deleteJobPosting(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await resourcesService.deleteJobPosting(id, actorName);
    return reply.status(200).send(successResponse(result, "Job posting deleted"));
  }

  // Partners
  async listPublicPartners(_request: FastifyRequest, reply: FastifyReply) {
    const partners = await resourcesService.listPublicPartners();
    return reply.status(200).send(successResponse(partners));
  }

  async listAdminPartners(_request: FastifyRequest, reply: FastifyReply) {
    const partners = await resourcesService.listAdminPartners();
    return reply.status(200).send(successResponse(partners));
  }

  async createPartner(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createPartnerSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await resourcesService.createPartner(input, actorName);
    return reply.status(201).send(successResponse(created, "Partner created"));
  }

  async updatePartner(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updatePartnerSchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await resourcesService.updatePartner(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Partner updated"));
  }

  async deletePartner(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await resourcesService.deletePartner(id, actorName);
    return reply.status(200).send(successResponse(result, "Partner deleted"));
  }
}

export const resourcesController = new ResourcesController();
