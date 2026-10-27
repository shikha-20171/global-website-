import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { PublishStatus, AuditResult } from "@prisma/client";
import {
  ProductQueryInput,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./products.schema.js";

export class ProductsService {
  async listPublicProducts(query: ProductQueryInput) {
    const where: any = {
      status: PublishStatus.PUBLISHED,
    };

    if (query.category) {
      where.category = {
        slug: query.category.toLowerCase().trim(),
      };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { tagline: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.size) where.size = query.size;
    if (query.deployment) where.deployment = query.deployment;
    if (query.featured !== undefined) where.isFeatured = query.featured;

    const skip = (query.page - 1) * query.limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          plans: {
            where: { status: PublishStatus.PUBLISHED },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: { displayOrder: "asc" },
        skip,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: products,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async getPublicProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        status: PublishStatus.PUBLISHED,
      },
      include: {
        category: true,
        features: {
          orderBy: { displayOrder: "asc" },
        },
        plans: {
          where: { status: PublishStatus.PUBLISHED },
          orderBy: { displayOrder: "asc" },
        },
        comparisonValues: {
          include: {
            attribute: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError(`Product "${slug}" not found or not published`);
    }

    return product;
  }

  async listCategories() {
    return prisma.productCategory.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { status: PublishStatus.PUBLISHED },
            },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  // Admin Methods

  async listAdminProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
        _count: {
          select: { features: true, plans: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  async getAdminProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        features: { orderBy: { displayOrder: "asc" } },
        plans: { orderBy: { displayOrder: "asc" } },
        comparisonValues: { include: { attribute: true } },
      },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async createProduct(input: CreateProductInput, actorName: string) {
    const existing = await prisma.product.findUnique({
      where: { slug: input.slug.toLowerCase().trim() },
    });

    if (existing) {
      throw new BadRequestError(`Product with slug "${input.slug}" already exists`);
    }

    const created = await prisma.product.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
        featuresList: input.featuresList ?? [],
      },
      include: { category: true },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Product",
      module: "Products & Catalog",
      entityType: "Product",
      entityId: created.id,
      details: `Created SaaS product "${created.name}" (${created.slug})`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateProduct(id: string, input: UpdateProductInput, actorName: string) {
    const data: any = { ...input };
    if (input.slug) data.slug = input.slug.toLowerCase().trim();

    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!existing) {
      throw new NotFoundError(`Product "${id}" not found`);
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data,
      include: { category: true },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Product",
      module: "Products & Catalog",
      entityType: "Product",
      entityId: existing.id,
      details: `Updated SaaS product "${updated.name}" (${updated.status})`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async publishProduct(id: string, status: PublishStatus, actorName: string) {
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!existing) {
      throw new NotFoundError(`Product "${id}" not found`);
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: { status },
      include: { category: true },
    });

    await logAuditEvent({
      adminName: actorName,
      action: `Changed Product Status to ${status}`,
      module: "Products & Catalog",
      entityType: "Product",
      entityId: existing.id,
      details: `Product "${updated.name}" publication status set to ${status}`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteProduct(id: string, actorName: string) {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!product) throw new NotFoundError("Product not found");

    await prisma.product.delete({ where: { id: product.id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Product",
      module: "Products & Catalog",
      entityType: "Product",
      entityId: id,
      details: `Deleted product "${product.name}" (${product.slug})`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }

  // Categories CRUD

  async createCategory(input: CreateCategoryInput, actorName: string) {
    const created = await prisma.productCategory.create({
      data: {
        ...input,
        slug: input.slug.toLowerCase().trim(),
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Created Product Category",
      module: "Products & Catalog",
      entityType: "ProductCategory",
      entityId: created.id,
      details: `Created product category "${created.name}"`,
      result: AuditResult.SUCCESS,
    });

    return created;
  }

  async updateCategory(id: string, input: UpdateCategoryInput, actorName: string) {
    const updated = await prisma.productCategory.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Product Category",
      module: "Products & Catalog",
      entityType: "ProductCategory",
      entityId: id,
      details: `Updated product category "${updated.name}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteCategory(id: string, actorName: string) {
    const cat = await prisma.productCategory.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!cat) throw new NotFoundError("Category not found");
    if (cat._count.products > 0) {
      throw new BadRequestError(`Cannot delete category "${cat.name}" with ${cat._count.products} associated product(s)`);
    }

    await prisma.productCategory.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Product Category",
      module: "Products & Catalog",
      entityType: "ProductCategory",
      entityId: id,
      details: `Deleted product category "${cat.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const productsService = new ProductsService();
