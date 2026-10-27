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
import { PublishStatus } from "@prisma/client";
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

    body.categoryId = await resolveCategoryId(body);
    if (!body.tagline && body.description) {
      body.tagline = body.description.slice(0, 100);
    } else if (!body.tagline) {
      body.tagline = body.name || "Enterprise SaaS Platform";
    }
    if (!body.description && body.tagline) {
      body.description = body.tagline;
    }
    if (body.featured !== undefined && body.isFeatured === undefined) {
      body.isFeatured = Boolean(body.featured);
    }
    if (body.unlisted !== undefined && body.status === undefined) {
      body.status = body.unlisted ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
    }

    const input = createProductSchema.parse(body);
    const actorName = authReq.adminUser?.name || "Super Admin";

    const created = await productsService.createProduct(input, actorName);
    return reply.status(201).send(successResponse(created, "Product created successfully"));
  }

  async updateProduct(request: FastifyRequest, reply: FastifyReply) {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};

    if (body.category && !body.categoryId) {
      body.categoryId = await resolveCategoryId(body);
    }
    if (body.featured !== undefined && body.isFeatured === undefined) {
      body.isFeatured = Boolean(body.featured);
    }
    if (body.unlisted !== undefined && body.status === undefined) {
      body.status = body.unlisted ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
    }

    const input = updateProductSchema.parse(body);
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
