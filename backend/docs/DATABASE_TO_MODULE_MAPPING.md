# DEZORYN TECHNOLOGY — Database-to-Module Mapping

This document provides the definitive architectural mapping between the 34 tables in the `dezoryn_db` PostgreSQL database and the modular backend services.

| PostgreSQL Table | Domain Module | Description & Responsibilities | Access Level |
| :--- | :--- | :--- | :--- |
| `AdminUser` | `modules/users`, `modules/auth` | Administrator credentials, hashed passwords, 2FA status, and session linkages. | Protected (Super Admin) |
| `Role` | `modules/roles` | RBAC roles consolidated to single `super_admin` authority. | Protected (Super Admin) |
| `Permission` | `modules/roles` | 14 fine-grained permission codes across platform systems. | Protected (Super Admin) |
| `RolePermission` | `modules/roles` | Junction table granting full capabilities to Super Administrator. | Protected (Super Admin) |
| `AdminSession` | `modules/auth` | Cryptographically hashed token sessions with expiration & revocation timestamps. | Protected (Super Admin) |
| `AuditLog` | `modules/audit` | Immutable security audit trail recording all administrative actions. | Protected (Super Admin) |
| `WebsitePage` | `modules/pages` | CMS static and dynamic website pages, route slugs, SEO metadata, and publication status. | Public (Read) / Super Admin (CRUD) |
| `PageSection` | `modules/pages` | Modular 11-section homepage builder with JSON configurations and display ordering. | Public (Read) / Super Admin (CRUD) |
| `NavigationItem` | `modules/navigation` | Header mega-menus, 6-column footer links, and mobile navigation hierarchy. | Public (Read) / Super Admin (CRUD) |
| `SiteSetting` | `modules/settings` | Key-value site settings, public brand parameters, and protected system flags. | Public (Sanitized) / Super Admin (Full) |
| `MediaAsset` | `modules/media` | Uploaded images, documents, logos, MIME types, file sizes, and usage counters. | Public (Read) / Super Admin (Upload/Delete) |
| `CompanyProfile` | `modules/company` | Mission, Vision, Core Values, Leadership roster, and Global office locations. | Public (Read) / Super Admin (Update) |
| `LegalPolicy` | `modules/legal` | 6 corporate legal policies (Privacy, Terms, Security, Refund, Cookies, AUP). | Public (Read) / Super Admin (Update) |
| `ProductCategory` | `modules/products` | 12 SaaS verticals (Education, Healthcare, Real Estate, Logistics, FinTech, etc.). | Public (Read) / Super Admin (CRUD) |
| `Product` | `modules/products` | 13 SaaS flagship engines, tags, modules, integrations, deployment models, status. | Public (Published) / Super Admin (Full) |
| `ProductFeature` | `modules/products` | Structured capability highlights and key features per product. | Public (Read) / Super Admin (CRUD) |
| `ProductPlan` | `modules/pricing` | Tiered pricing (Starter, Growth, Business, Enterprise) with quotas and feature bullets. | Public (Read) / Super Admin (CRUD) |
| `ComparisonAttribute` | `modules/comparison` | 7 architectural, compliance, and integration criteria. | Public (Read) / Super Admin (CRUD) |
| `ProductComparisonValue`| `modules/comparison` | Product-specific values for matrix comparison grid (13 x 7 = 91 values). | Public (Read) / Super Admin (Update) |
| `Solution` | `modules/solutions` | 7 enterprise architecture blueprints (Enterprise, AI, Automation, Cloud, etc.). | Public (Published) / Super Admin (Full) |
| `Industry` | `modules/industries` | 10 industry verticals with challenges, solutions, ROI metrics, and product links. | Public (Published) / Super Admin (Full) |
| `Project` | `modules/projects` | 13 client engineering showcases with technical stacks and key results. | Public (Published) / Super Admin (Full) |
| `CaseStudy` | `modules/case-studies` | 13 in-depth customer success stories, ROI metrics, architecture, and quotes. | Public (Published) / Super Admin (Full) |
| `BlogPost` | `modules/resources` | 8 technical journal articles with author profiles, tags, and read times. | Public (Published) / Super Admin (Full) |
| `InsightReport` | `modules/resources` | 3 executive whitepapers and research reports with download counters. | Public (Published) / Super Admin (Full) |
| `DocumentationRunbook` | `modules/resources` | 3 cloud topology and Kubernetes/SQL runbooks with code samples. | Public (Published) / Super Admin (Full) |
| `ApiResource` | `modules/resources` | 3 public REST endpoint specifications, rate limits, and parameter schemas. | Public (Published) / Super Admin (Full) |
| `Faq` | `modules/resources` | Frequently asked questions categorized by domain and product. | Public (Read) / Super Admin (CRUD) |
| `JobPosting` | `modules/resources` | 3 career job openings across engineering and executive departments. | Public (Published) / Super Admin (Full) |
| `Partner` | `modules/resources` | 4 strategic technology, solution, and channel partner integrations. | Public (Published) / Super Admin (Full) |
| `LeadEnquiry` | `modules/leads` | Inbound enterprise sales leads, budgets, deal values, and pipeline stages. | Public (Submit) / Super Admin (Manage) |
| `DemoRequest` | `modules/leads` | Interactive demo walkthrough bookings with preferred calendar slots. | Public (Submit) / Super Admin (Manage) |
| `NewsletterSubscription`| `modules/leads` | Unique email subscription engine with duplicate prevention & unsubscribe flow. | Public (Submit) / Super Admin (Manage) |
