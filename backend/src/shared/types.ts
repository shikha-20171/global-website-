import { FastifyRequest } from "fastify";
import { AdminStatus, PublishStatus } from "@prisma/client";

export interface SafeAdminUser {
  id: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
  status: AdminStatus;
  twoFactorEnforced: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  permissions: string[];
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  sessionId: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  adminUser?: AuthenticatedUser;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PublishStatus | string;
  category?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
