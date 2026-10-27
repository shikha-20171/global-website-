# DEZORYN TECHNOLOGY — Complete API Endpoint Inventory

All endpoints are hosted with the primary base path `/api/v1` and are also accessible via `/api` for legacy frontend compatibility.

## 1. System Health & Documentation

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Root health check and database connectivity probe |
| `GET` | `/api/v1/health` | Public | Versioned health check with database latency |
| `GET` | `/docs` | Public | Interactive Swagger / OpenAPI documentation UI |

## 2. Authentication & Governance (Super Admin)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/admin/auth/login` | Public | Super Admin login (Bcrypt verify, issues session cookie & token) |
| `POST` | `/api/v1/admin/auth/logout` | Super Admin | Revokes active administrative session & clears cookie |
| `GET` | `/api/v1/admin/auth/me` | Super Admin | Retrieves current authenticated Super Admin profile |
| `POST` | `/api/v1/admin/auth/change-password` | Super Admin | Changes password and revokes previous active sessions |
| `GET` | `/api/v1/admin/dashboard` | Super Admin | Real-time aggregate platform metrics from PostgreSQL |
| `GET` | `/api/v1/admin/users` | Super Admin | List all administrator user accounts |
| `GET` | `/api/v1/admin/users/:id` | Super Admin | Get administrator details by ID |
| `POST` | `/api/v1/admin/users` | Super Admin | Create new administrator account |
| `PUT` | `/api/v1/admin/users/:id` | Super Admin | Update administrator details or reset password |
| `DELETE`| `/api/v1/admin/users/:id` | Super Admin | Delete administrator account (last Super Admin protected) |
| `GET` | `/api/v1/admin/roles` | Super Admin | List system roles with permission mappings |
| `GET` | `/api/v1/admin/roles/:id` | Super Admin | Get role details |
| `GET` | `/api/v1/admin/permissions` | Super Admin | List all 14 fine-grained platform permissions |
| `GET` | `/api/v1/admin/audit-logs` | Super Admin | Query historical security audit trail with filters |
| `GET` | `/api/v1/admin/notifications` | Super Admin | Query pending CRM leads, demo bookings, and security alerts |

## 3. Website Content Management System (CMS)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/pages` | Public | List published website CMS pages |
| `GET` | `/api/v1/pages/:slug` | Public | Retrieve single published page by slug with enabled sections |
| `GET` | `/api/v1/navigation` | Public | Retrieve published navigation menus (header, footer, mobile) |
| `GET` | `/api/v1/company` | Public | Retrieve corporate mission, vision, values, leadership, offices |
| `GET` | `/api/v1/legal` | Public | List published corporate legal policies |
| `GET` | `/api/v1/legal/:slug` | Public | Retrieve legal policy clauses and compliance frameworks by slug |
| `GET` | `/api/v1/settings/public` | Public | Retrieve sanitized public website configuration parameters |
| `GET` | `/api/v1/admin/pages` | Super Admin | List all pages (including drafts and archived) |
| `GET` | `/api/v1/admin/pages/:id` | Super Admin | Get page details with all sections |
| `GET` | `/api/v1/admin/pages/:id/preview`| Super Admin | Preview draft page content before publication |
| `POST` | `/api/v1/admin/pages` | Super Admin | Create new website page |
| `PUT` | `/api/v1/admin/pages/:id` | Super Admin | Update page details and SEO metadata |
| `POST` | `/api/v1/admin/pages/:id/publish`| Super Admin | Publish, unpublish, or archive page |
| `DELETE`| `/api/v1/admin/pages/:id` | Super Admin | Delete page and associated builder sections |
| `GET` | `/api/v1/admin/sections` | Super Admin | List builder sections across all pages |
| `PUT` | `/api/v1/admin/sections/:id` | Super Admin | Update builder section headline, content, settings JSON |
| `PUT` | `/api/v1/admin/company` | Super Admin | Update corporate narrative and leadership roster |
| `PUT` | `/api/v1/admin/legal/:id` | Super Admin | Update legal policy clauses and reviewed dates |
| `GET` | `/api/v1/admin/settings` | Super Admin | List all site settings with secrets masked |
| `PUT` | `/api/v1/admin/settings` | Super Admin | Save or bulk-update site settings |

## 4. Products, Marketplace & Pricing

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Public | List published SaaS products with category & search filter |
| `GET` | `/api/v1/products/:slug` | Public | Get single SaaS engine details, features, plans, comparisons |
| `GET` | `/api/v1/products/categories` | Public | List product categories with live product counts |
| `GET` | `/api/v1/products/compare` | Public | Full product comparison matrix across 7 criteria |
| `GET` | `/api/v1/pricing` | Public | Public pricing plans and subscription tiers |
| `GET` | `/api/v1/admin/products` | Super Admin | List all SaaS products for management |
| `GET` | `/api/v1/admin/products/:id` | Super Admin | Get product details for editing |
| `POST` | `/api/v1/admin/products` | Super Admin | Create new SaaS product |
| `PUT` | `/api/v1/admin/products/:id` | Super Admin | Update SaaS product details and capabilities |
| `POST` | `/api/v1/admin/products/:id/publish`| Super Admin | Change product publication status |
| `DELETE`| `/api/v1/admin/products/:id` | Super Admin | Delete product from catalog |
| `POST` | `/api/v1/admin/categories` | Super Admin | Create product category |
| `PUT` | `/api/v1/admin/categories/:id`| Super Admin | Update product category |
| `DELETE`| `/api/v1/admin/categories/:id`| Super Admin | Delete product category |
| `GET` | `/api/v1/admin/pricing` | Super Admin | List all configured pricing plans |
| `POST` | `/api/v1/admin/pricing` | Super Admin | Create new pricing tier |
| `PUT` | `/api/v1/admin/pricing/:id` | Super Admin | Update pricing tier (audited) |
| `DELETE`| `/api/v1/admin/pricing/:id` | Super Admin | Delete pricing tier |

## 5. Solutions, Industries & Projects

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/solutions` | Public | List published enterprise solutions blueprints |
| `GET` | `/api/v1/solutions/:slug` | Public | Retrieve solution details by slug |
| `GET` | `/api/v1/industries` | Public | List supported industry verticals and frameworks |
| `GET` | `/api/v1/industries/:slug` | Public | Retrieve industry details and challenges by slug |
| `GET` | `/api/v1/projects` | Public | List published engineering client projects |
| `GET` | `/api/v1/projects/:slug` | Public | Retrieve project details and tech stack by slug |
| `GET` | `/api/v1/case-studies` | Public | List published customer case studies with ROI highlights |
| `GET` | `/api/v1/case-studies/:slug`| Public | Retrieve full case study and testimonial by slug |
| `POST` | `/api/v1/admin/solutions` | Super Admin | Create new enterprise solution |
| `PUT` | `/api/v1/admin/solutions/:id`| Super Admin | Update solution details |
| `DELETE`| `/api/v1/admin/solutions/:id`| Super Admin | Delete solution |
| `POST` | `/api/v1/admin/industries` | Super Admin | Create industry vertical |
| `PUT` | `/api/v1/admin/industries/:id`| Super Admin | Update industry vertical |
| `DELETE`| `/api/v1/admin/industries/:id`| Super Admin | Delete industry vertical |
| `POST` | `/api/v1/admin/projects` | Super Admin | Create showcase project |
| `PUT` | `/api/v1/admin/projects/:id` | Super Admin | Update showcase project |
| `DELETE`| `/api/v1/admin/projects/:id` | Super Admin | Delete showcase project |
| `POST` | `/api/v1/admin/case-studies`| Super Admin | Create customer case study |
| `PUT` | `/api/v1/admin/case-studies/:id`| Super Admin | Update customer case study |
| `DELETE`| `/api/v1/admin/case-studies/:id`| Super Admin | Delete customer case study |

## 6. Resources Hub (Blog, Whitepapers, Runbooks, APIs, FAQs, Careers, Partners)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/content/blog` | Public | List published articles with category and search filter |
| `GET` | `/api/v1/content/blog/:slug`| Public | Retrieve article by slug |
| `GET` | `/api/v1/content/insights` | Public | List whitepapers and insight research reports |
| `GET` | `/api/v1/content/docs` | Public | List documentation runbooks and cloud topologies |
| `GET` | `/api/v1/content/api-reference`| Public | List public REST API documentation specs |
| `GET` | `/api/v1/content/faqs` | Public | List frequently asked questions |
| `GET` | `/api/v1/content/careers` | Public | List open job positions |
| `GET` | `/api/v1/content/partners` | Public | List strategic partner integrations |
| `POST` | `/api/v1/admin/blog` | Super Admin | Create blog article |
| `PUT` | `/api/v1/admin/blog/:id` | Super Admin | Update blog article |
| `DELETE`| `/api/v1/admin/blog/:id` | Super Admin | Delete blog article |
| `POST` | `/api/v1/admin/faqs` | Super Admin | Create FAQ entry |
| `PUT` | `/api/v1/admin/faqs/:id` | Super Admin | Update FAQ entry |
| `DELETE`| `/api/v1/admin/faqs/:id` | Super Admin | Delete FAQ entry |
| `POST` | `/api/v1/admin/careers` | Super Admin | Create career opening |
| `PUT` | `/api/v1/admin/careers/:id` | Super Admin | Update career opening |
| `DELETE`| `/api/v1/admin/careers/:id` | Super Admin | Delete career opening |
| `POST` | `/api/v1/admin/partners` | Super Admin | Create partner record |
| `PUT` | `/api/v1/admin/partners/:id`| Super Admin | Update partner record |
| `DELETE`| `/api/v1/admin/partners/:id`| Super Admin | Delete partner record |

## 7. Inbound Leads, CRM & Newsletter

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/contact` | Public | Submit contact form inquiry (with spam defense) |
| `POST` | `/api/v1/sales-inquiries` | Public | Submit enterprise sales inquiry |
| `POST` | `/api/v1/demo` | Public | Schedule product architecture demo |
| `POST` | `/api/v1/newsletter/subscribe`| Public | Subscribe to engineering newsletter |
| `POST` | `/api/v1/newsletter/unsubscribe`| Public | Unsubscribe email from newsletter |
| `GET` | `/api/v1/admin/inquiries` | Super Admin | List inquiries with filters (status, priority, search) |
| `GET` | `/api/v1/admin/inquiries/:id`| Super Admin | Get inquiry details and timeline |
| `PATCH`| `/api/v1/admin/inquiries/:id/status`| Super Admin | Update lead pipeline status and add note |
| `DELETE`| `/api/v1/admin/inquiries/:id`| Super Admin | Delete inquiry |
| `GET` | `/api/v1/admin/demos` | Super Admin | List scheduled product demos |
| `PATCH`| `/api/v1/admin/demos/:id/status`| Super Admin | Update demo status and assign meeting link |
| `DELETE`| `/api/v1/admin/demos/:id`| Super Admin | Delete demo booking |
| `GET` | `/api/v1/admin/subscribers` | Super Admin | List newsletter subscribers |

## 8. Media Storage & Assets

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/media` | Public | List media assets and CDN file paths |
| `GET` | `/api/v1/admin/media` | Super Admin | List all media assets for administration |
| `POST` | `/api/v1/admin/media/upload`| Super Admin | Upload media file (multipart/form-data) |
| `POST` | `/api/v1/admin/media` | Super Admin | Register media asset metadata |
| `PUT` | `/api/v1/admin/media/:id` | Super Admin | Update media metadata |
| `DELETE`| `/api/v1/admin/media/:id` | Super Admin | Delete media asset and remove from disk |
