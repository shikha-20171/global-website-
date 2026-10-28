import { z } from "zod";
import { PublishStatus, JobType, PartnerTier } from "@prisma/client";

// Blog Post
export const blogPostQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const createBlogPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().default("DEZORYN Engineering"),
  authorRole: z.string().default("Systems Architect"),
  category: z.string().default("Engineering"),
  readTimeMinutes: z.number().int().default(5),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

// FAQ
export const createFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
  relatedProduct: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial();

// Career / Job Posting
export const createJobPostingSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.nativeEnum(JobType).default(JobType.FULL_TIME),
  experienceLevel: z.string().optional(),
  salaryRange: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  requirements: z.any().default([]),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
});

export const updateJobPostingSchema = createJobPostingSchema.partial();

// Partner
export const createPartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  category: z.string().default("Technology Alliances"),
  tier: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const u = val.toUpperCase();
        if (u.includes("SOLUTION")) return PartnerTier.SOLUTION;
        if (u.includes("CHANNEL") || u.includes("DISTRIBUTOR")) return PartnerTier.CHANNEL;
        return PartnerTier.TECHNOLOGY;
      }
      return val;
    }, z.nativeEnum(PartnerTier))
    .default(PartnerTier.TECHNOLOGY),
  websiteUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  commissionRate: z.string().optional(),
  displayOrder: z.number().int().default(0),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
});

export const updatePartnerSchema = createPartnerSchema.partial();

// Insight Report / Whitepaper
export const createInsightReportSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  sector: z.string().default("Cloud Operations"),
  author: z.string().default("DEZORYN Research Group"),
  pagesCount: z.number().int().default(24),
  downloadCount: z.number().int().default(0),
  pdfAssetUrl: z.string().optional().nullable(),
  summary: z.string().min(1, "Summary is required"),
  tags: z.array(z.string()).default([]),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
});

export const updateInsightReportSchema = createInsightReportSchema.partial();

export type BlogPostQueryInput = z.infer<typeof blogPostQuerySchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
export type CreateJobPostingInput = z.infer<typeof createJobPostingSchema>;
export type UpdateJobPostingInput = z.infer<typeof updateJobPostingSchema>;
export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
export type CreateInsightReportInput = z.infer<typeof createInsightReportSchema>;
export type UpdateInsightReportInput = z.infer<typeof updateInsightReportSchema>;
