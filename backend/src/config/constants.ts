export const COOKIE_NAME = "dezoryn_admin_session";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  WEBSITE_MGR: "website_mgr",
  PRODUCT_MGR: "product_mgr",
  CONTENT_EDITOR: "content_editor",
  SALES_MGR: "sales_mgr",
} as const;

export const PERMISSIONS = {
  WEBSITE_READ: "website:read",
  WEBSITE_WRITE: "website:write",
  WEBSITE_PUBLISH: "website:publish",
  PRODUCTS_READ: "products:read",
  PRODUCTS_WRITE: "products:write",
  PRODUCTS_PUBLISH: "products:publish",
  SOLUTIONS_MANAGE: "solutions:manage",
  LEADS_READ: "leads:read",
  LEADS_MANAGE: "leads:manage",
  DEMOS_MANAGE: "demos:manage",
  CONTENT_MANAGE: "content:manage",
  MEDIA_MANAGE: "media:manage",
  SETTINGS_MANAGE: "settings:manage",
  USERS_MANAGE: "users:manage",
} as const;

export const SESSION_EXPIRATION_DAYS = 7;
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];
