import { z } from "zod";
import { LeadPriority, LeadStatus, DemoStatus, LeadSource } from "@prisma/client";

export const contactInquirySchema = z.object({
  name: z.string().min(1, "Full name is required"),
  company: z.string().min(1, "Company name is required"),
  email: z.string().email("Valid business email is required"),
  phone: z.string().nullable().optional(),
  country: z.string().min(1, "Country is required"),
  companySize: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  budget: z.string().nullable().optional(),
  req: z.string().min(1, "Requirement description is required"),
  source: z.string().nullable().optional(),
});

export const demoBookingSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  company: z.string().min(1, "Company name is required"),
  businessEmail: z.string().email("Valid corporate email is required"),
  phone: z.string().nullable().optional(),
  country: z.string().min(1, "Country is required"),
  productSlug: z.string().min(1, "Product slug is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  timeZone: z.string().nullable().optional().default("UTC"),
  notes: z.string().nullable().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Valid email address required"),
  source: z.string().default("website_footer"),
});

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
  priority: z.nativeEnum(LeadPriority).optional(),
  estimatedValueUsd: z.number().optional(),
  assignedOwnerId: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export const updateDemoStatusSchema = z.object({
  status: z.nativeEnum(DemoStatus),
  meetingLink: z.string().url().optional(),
  notes: z.string().optional(),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type DemoBookingInput = z.infer<typeof demoBookingSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type UpdateDemoStatusInput = z.infer<typeof updateDemoStatusSchema>;
