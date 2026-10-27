import { z } from "zod";

export const updateCompanyProfileSchema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.any().optional(),
  leadershipRoster: z.any().optional(),
  officeLocations: z.any().optional(),
  stats: z.any().optional(),
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
