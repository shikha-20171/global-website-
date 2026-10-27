import { prisma } from "../../config/database.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { AuditResult, SettingGroup } from "@prisma/client";
import { UpdateSettingInput } from "./settings.schema.js";

export class SettingsService {
  async getPublicSettings() {
    const settings = await prisma.siteSetting.findMany({
      where: { isSecret: false },
    });

    const dictionary: Record<string, string> = {};
    for (const s of settings) {
      dictionary[s.key] = s.value;
    }

    return dictionary;
  }

  async getAdminSettings() {
    const settings = await prisma.siteSetting.findMany({
      orderBy: [{ group: "asc" }, { key: "asc" }],
    });

    // Mask secret values in response for safety
    return settings.map((s: any) => ({
      ...s,
      value: s.isSecret ? "••••••••••••••••" : s.value,
    }));
  }

  async saveAdminSetting(input: UpdateSettingInput, actorName: string) {
    const setting = await prisma.siteSetting.upsert({
      where: { key: input.key },
      update: {
        value: input.value,
        description: input.description,
        group: input.group,
        isSecret: input.isSecret,
      },
      create: {
        key: input.key,
        value: input.value,
        description: input.description,
        group: input.group,
        isSecret: input.isSecret,
      },
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Site Setting",
      module: "System Settings",
      entityType: "SiteSetting",
      entityId: setting.id,
      details: `Updated setting parameter "${input.key}" (${input.isSecret ? "Secret" : "Public"})`,
      result: AuditResult.SUCCESS,
    });

    return setting;
  }

  async bulkSaveAdminSettings(settingsMap: Record<string, any>, actorName: string) {
    const keys = Object.keys(settingsMap);
    const updatedKeys: string[] = [];

    for (const key of keys) {
      const val = settingsMap[key];
      const stringVal = typeof val === "object" ? JSON.stringify(val) : String(val);

      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: {
          key,
          value: stringVal,
          group: SettingGroup.GENERAL,
        },
      });
      updatedKeys.push(key);
    }

    await logAuditEvent({
      adminName: actorName,
      action: "Bulk Updated Site Settings",
      module: "System Settings",
      entityType: "SiteSetting",
      details: `Updated ${updatedKeys.length} settings: ${updatedKeys.join(", ")}`,
      result: AuditResult.SUCCESS,
    });

    return { updated: updatedKeys.length };
  }
}

export const settingsService = new SettingsService();
