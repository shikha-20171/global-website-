import { z } from "zod";
import { PublishStatus } from "@prisma/client";

export const createCaseStudySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client name is required"),
  industry: z.string().min(1, "Industry is required"),
  timeframe: z.string().optional(),
  metricHighlight: z.string().optional(),
  overview: z.string().min(1, "Overview is required"),
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  results: z.string().min(1, "Results is required"),
  architectureDesc: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  testimonialAuthor: z.string().optional(),
  testimonialRole: z.string().optional(),
  testimonialQuote: z.string().optional(),
  status: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const u = val.toUpperCase().trim();
        if (u === "PUBLISHED" || u === "DRAFT" || u === "ARCHIVED") return u;
      }
      return val;
    }, z.nativeEnum(PublishStatus))
    .default(PublishStatus.PUBLISHED),
  displayOrder: z.number().int().default(0),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
