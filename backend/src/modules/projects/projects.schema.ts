import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const createProjectSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  client: z.string().min(1, "Client name is required"),
  category: z.string().default("Enterprise"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  metrics: z.any().default([]),
  techStack: z.array(z.string()).default([]),
  demoUrl: z.string().optional(),
  featuredImage: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  displayOrder: z.number().int().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
