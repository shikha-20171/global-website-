import { prisma } from "../../config/database.js";
import { NotFoundError, BadRequestError } from "../../shared/errors.js";
import { logAuditEvent } from "../../middleware/audit.js";
import { AssetType, AuditResult } from "@prisma/client";
import { CreateMediaAssetInput, UpdateMediaAssetInput } from "./media.schema.js";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES } from "../../config/constants.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { MultipartFile } from "@fastify/multipart";

export class MediaService {
  private uploadsDir = path.resolve(process.cwd(), "uploads");

  constructor() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async listMedia(assetType?: AssetType) {
    const where = assetType ? { assetType } : {};
    return prisma.mediaAsset.findMany({
      where,
      include: {
        uploader: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getMediaById(id: string) {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        uploader: { select: { id: true, name: true, email: true } },
      },
    });

    if (!asset) throw new NotFoundError("Media asset not found");
    return asset;
  }

  async uploadFile(part: MultipartFile, uploaderId?: string, actorName?: string) {
    const mimeType = part.mimetype;
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestError(`Unsupported file format "${mimeType}". Allowed formats: JPEG, PNG, WEBP, SVG, GIF, PDF`);
    }

    const ext = path.extname(part.filename).toLowerCase() || ".png";
    const sanitizedBase = path.basename(part.filename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}_${sanitizedBase}${ext}`;
    const destinationPath = path.join(this.uploadsDir, uniqueName);

    // Stream to disk
    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(destinationPath);
      (part.file as any).pipe(writeStream);
      writeStream.on("finish", () => resolve());
      writeStream.on("error", (err: any) => reject(err));
    });

    const stats = fs.statSync(destinationPath);
    if (stats.size > MAX_UPLOAD_SIZE_BYTES) {
      fs.unlinkSync(destinationPath);
      throw new BadRequestError(`File exceeds maximum permissible size of ${MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB`);
    }

    const publicUrl = `/uploads/${uniqueName}`;

    let assetType: AssetType = AssetType.GENERAL;
    if (ext === ".pdf") assetType = AssetType.DOCUMENT;
    else if (sanitizedBase.includes("logo")) assetType = AssetType.LOGO;
    else assetType = AssetType.PRODUCT_ART;

    const asset = await prisma.mediaAsset.create({
      data: {
        name: part.filename,
        filePath: publicUrl,
        mimeType,
        sizeBytes: stats.size,
        assetType,
        uploaderId,
      },
    });

    if (actorName) {
      await logAuditEvent({
        adminUserId: uploaderId,
        adminName: actorName,
        action: "Uploaded Media Asset",
        module: "Media Management",
        entityType: "MediaAsset",
        entityId: asset.id,
        details: `Uploaded file "${part.filename}" (${(stats.size / 1024).toFixed(1)} KB) -> ${publicUrl}`,
        result: AuditResult.SUCCESS,
      });
    }

    return asset;
  }

  async createMediaRecord(input: CreateMediaAssetInput, uploaderId?: string, actorName?: string) {
    const asset = await prisma.mediaAsset.create({
      data: {
        ...input,
        uploaderId,
      },
    });

    if (actorName) {
      await logAuditEvent({
        adminUserId: uploaderId,
        adminName: actorName,
        action: "Registered Media Asset Record",
        module: "Media Management",
        entityType: "MediaAsset",
        entityId: asset.id,
        details: `Registered media metadata for "${asset.name}"`,
        result: AuditResult.SUCCESS,
      });
    }

    return asset;
  }

  async updateMedia(id: string, input: UpdateMediaAssetInput, actorName: string) {
    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: input,
    });

    await logAuditEvent({
      adminName: actorName,
      action: "Updated Media Asset Metadata",
      module: "Media Management",
      entityType: "MediaAsset",
      entityId: id,
      details: `Updated metadata for media asset "${updated.name}"`,
      result: AuditResult.SUCCESS,
    });

    return updated;
  }

  async deleteMedia(id: string, actorName: string) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundError("Media asset not found");

    // Clean up local disk file if exists
    if (asset.filePath.startsWith("/uploads/")) {
      const fileName = asset.filePath.replace("/uploads/", "");
      const fullPath = path.join(this.uploadsDir, fileName);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.warn("Could not delete file from disk:", e);
        }
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });

    await logAuditEvent({
      adminName: actorName,
      action: "Deleted Media Asset",
      module: "Media Management",
      entityType: "MediaAsset",
      entityId: id,
      details: `Deleted media asset "${asset.name}"`,
      result: AuditResult.SUCCESS,
    });

    return { id, deleted: true };
  }
}

export const mediaService = new MediaService();
