import { FastifyReply, FastifyRequest } from "fastify";
import { productsService } from "./products.service.js";
import {
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./products.schema.js";
import { successResponse } from "../../shared/response.js";
import { AuthenticatedRequest } from "../../shared/types.js";
import { PublishStatus, BusinessSize, DeploymentType } from "@prisma/client";
import { prisma } from "../../config/database.js";

async function resolveCategoryId(body: any) {
  if (body.categoryId) return body.categoryId;
  if (body.category) {
    const catStr =
      typeof body.category === "object" && body.category !== null
        ? body.category.id || body.category.slug || body.category.name
        : String(body.category);
    const found = await prisma.productCategory.findFirst({
      where: {
        OR: [
          { id: catStr },
          { slug: catStr.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
          { name: { equals: catStr, mode: "insensitive" } },
        ],
      },
    });
    if (found) return found.id;
  }
  const fallback = await prisma.productCategory.findFirst();
  return fallback?.id || "cmvahys4m001ptpwicv7mrc95";
}

function sanitizeProductInput(body: any, categoryId?: string) {
  const data: any = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.slug !== undefined) data.slug = String(body.slug).toLowerCase().trim();
  if (body.tagline !== undefined) data.tagline = String(body.tagline).trim();
  if (body.description !== undefined) data.description = String(body.description).trim();
  if (categoryId) data.categoryId = categoryId;
  else if (body.categoryId) data.categoryId = body.categoryId;
  if (body.image !== undefined) data.image = body.image || null;
  if (body.logoUrl !== undefined && !data.image) data.image = body.logoUrl;

  // Size normalization (BusinessSize: SMALL, MEDIUM, LARGE, ENTERPRISE)
  if (body.size !== undefined) {
    const s = String(body.size).toUpperCase().trim();
    if (["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"].includes(s)) {
      data.size = s as BusinessSize;
    } else if (s === "STARTUP") {
      data.size = BusinessSize.SMALL;
    } else if (s === "GROWTH") {
      data.size = BusinessSize.MEDIUM;
    } else {
      data.size = BusinessSize.MEDIUM;
    }
  }

  // Deployment normalization (DeploymentType: CLOUD, HYBRID, ON_PREMISE)
  if (body.deployment !== undefined) {
    const d = String(body.deployment).toUpperCase().trim().replace(/[-\s]+/g, "_");
    if (["CLOUD", "HYBRID", "ON_PREMISE"].includes(d)) {
      data.deployment = d as DeploymentType;
    } else {
      data.deployment = DeploymentType.CLOUD;
    }
  }

  // Booleans
  if (body.isAiPowered !== undefined) data.isAiPowered = Boolean(body.isAiPowered);
  else if (body.ai !== undefined) data.isAiPowered = Boolean(body.ai);

  if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
  else if (body.featured !== undefined) data.isFeatured = Boolean(body.featured);

  if (body.isTrending !== undefined) data.isTrending = Boolean(body.isTrending);

  // Status normalization (PublishStatus: PUBLISHED, DRAFT, ARCHIVED)
  if (body.status !== undefined) {
    const st = String(body.status).toUpperCase().trim();
    data.status = st === "DRAFT" ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
  } else if (body.unlisted !== undefined) {
    data.status = body.unlisted ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
  }

  if (body.displayOrder !== undefined) data.displayOrder = Number(body.displayOrder) || 0;
  if (body.rating !== undefined) data.rating = String(body.rating);

  // JSON Array fields
  if (Array.isArray(body.tags)) data.tags = body.tags;
  if (Array.isArray(body.benefits)) data.benefits = body.benefits;
  if (Array.isArray(body.modules)) data.modules = body.modules;
  if (Array.isArray(body.integrations)) data.integrations = body.integrations;

  // Features list
  if (body.featuresList !== undefined) {
    data.featuresList = body.featuresList;
  } else if (Array.isArray(body.features)) {
    data.featuresList = body.features;
  }

  // Pricing & Plans
  if (body.startingPrice !== undefined) {
    data.startingPrice = Number(body.startingPrice);
  }
  if (Array.isArray(body.plans)) {
    data.plans = body.plans;
  }

  return data;
}

export class ProductsController {
  // Public
  async listPublicProducts(request: FastifyRequest, reply: FastifyReply) {
    const query = productQuerySchema.parse(request.query);
    const result = await productsService.listPublicProducts(query);
    return reply.status(200).send(successResponse(result.items, "Products retrieved", {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }));
  }

  async getPublicProductBySlug(request: FastifyRequest, reply: FastifyReply) {
    const { slug } = request.params as { slug: string };
    const product = await productsService.getPublicProductBySlug(slug);
    return reply.status(200).send(successResponse(product));
  }

  async listCategories(_request: FastifyRequest, reply: FastifyReply) {
    const categories = await productsService.listCategories();
    return reply.status(200).send(successResponse(categories));
  }

  // Admin Products
  async listAdminProducts(_request: FastifyRequest, reply: FastifyReply) {
    const products = await productsService.listAdminProducts();
    return reply.status(200).send(successResponse(products));
  }

  async getAdminProductById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const product = await productsService.getAdminProductById(id);
    return reply.status(200).send(successResponse(product));
  }

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const body = (request.body as any) || {};

    const categoryId = await resolveCategoryId(body);
    const sanitized = sanitizeProductInput(body, categoryId);

    if (!sanitized.slug && sanitized.name) {
      sanitized.slug = sanitized.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (!sanitized.tagline && sanitized.description) {
      sanitized.tagline = sanitized.description.slice(0, 100);
    } else if (!sanitized.tagline) {
      sanitized.tagline = sanitized.name || "Enterprise SaaS Platform";
    }
    if (!sanitized.description && sanitized.tagline) {
      sanitized.description = sanitized.tagline;
    }

    const input = createProductSchema.parse(sanitized);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await productsService.createProduct(input, actorName);
    return reply.status(201).send(successResponse(created, "Product created successfully"));
  }

  async updateProduct(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};

    let categoryId: string | undefined = undefined;
    if (body.categoryId) {
      categoryId = body.categoryId;
    } else if (body.category) {
      categoryId = await resolveCategoryId(body);
    }

    const sanitized = sanitizeProductInput(body, categoryId);
    const input = updateProductSchema.parse(sanitized);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await productsService.updateProduct(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Product updated successfully"));
  }

  async publishProduct(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const body = (request.body as { status?: PublishStatus }) || {};
    const status = body.status || PublishStatus.PUBLISHED;
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await productsService.publishProduct(id, status, actorName);
    return reply.status(200).send(successResponse(updated, `Product status changed to ${status}`));
  }

  async deleteProduct(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await productsService.deleteProduct(id, actorName);
    return reply.status(200).send(successResponse(result, "Product deleted successfully"));
  }

  // Admin Categories
  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const input = createCategorySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await productsService.createCategory(input, actorName);
    return reply.status(201).send(successResponse(created, "Product category created"));
  }

  async updateCategory(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const input = updateCategorySchema.parse(request.body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const updated = await productsService.updateCategory(id, input, actorName);
    return reply.status(200).send(successResponse(updated, "Product category updated"));
  }

  async deleteCategory(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const actorName = authReq.adminUser?.name || "Super Admin";

    const result = await productsService.deleteCategory(id, actorName);
    return reply.status(200).send(successResponse(result, "Product category deleted"));
  }
}

export const productsController = new ProductsController();
