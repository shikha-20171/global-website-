import { prisma } from "../../config/database.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { AuditResult } from "@prisma/client";
import { UpdateCompanyProfileInput } from "./company.schema.js";

export class CompanyService {
  async getProfile() {
    let profile = await prisma.companyProfile.findFirst();
    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: {
          siteName: "DEZORYN TECHNOLOGY",
          tagline: "Technology That Moves Businesses Forward",
          mission: "Engineering resilient, secure, and sovereign software platforms for enterprises globally.",
          vision: "To be the global benchmark for enterprise cloud and AI-driven platforms.",
          values: [],
          leadershipRoster: [],
          officeLocations: [],
          stats: {},
        },
      });
    }
    return profile;
  }

  async updateProfile(input: UpdateCompanyProfileInput, actorName: string) {
    const existing = await this.getProfile();

    const updated = await prisma.companyProfile.update({
      where: { id: existing.id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Company Profile",
      module: "Website CMS",
      entityType: "CompanyProfile",
      entityId: existing.id,
      details: "Updated corporate narrative, executive leadership, and office locations",
      result: AuditResult.SUCCESS,
    });

    return updated;
  }
}

export const companyService = new CompanyService();
