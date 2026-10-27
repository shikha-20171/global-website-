# DEZORYN TECHNOLOGY — Frontend & Admin Integration Guide

This guide specifies the integration contract for both Next.js applications:
1. **Global Corporate Website** (`frontend/`)
2. **Super Admin Console** (`admin/`)

---

## 1. Unified Backend Architecture

Both applications communicate with **ONE shared Fastify backend** connected to **ONE PostgreSQL database (`dezoryn_db`)**.

- **Local Development Base URL**: `http://localhost:5001`
- **Staging Base URL**: `https://api-staging.dezoryn.com`
- **Production Base URL**: `https://api.dezoryn.com`
- **Swagger / OpenAPI Documentation**: `http://localhost:5001/docs`

All endpoints are hosted at `/api/v1` and are also accessible via `/api` for legacy backwards compatibility.

---

## 2. Environment Configuration

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Admin Console (`admin/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 3. Standard Response & Error Contracts

All responses follow a consistent, predictable JSON envelope.

### Successful Response:
```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [
    {
      "id": "cmvahys4g001ltpwiszf7t5d1",
      "slug": "schooly-core",
      "name": "Schooly Core",
      "tagline": "Next-Gen Multi-Tenant Educational ERP Engine",
      "status": "PUBLISHED"
    }
  ],
  "meta": {
    "total": 13,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Valid business email is required"
    }
  ]
}
```

---

## 4. Authentication & Super Admin Authorization

Administrative routes require authentication and verify that the user possesses the `super_admin` role.

The backend supports dual authentication modes:
1. **HttpOnly Cookie** (`dezoryn_admin_session`): Automatically set on login; ideal for browser navigation with `credentials: "include"`.
2. **Authorization Header** (`Bearer <token>`): Provided in the login response payload; ideal for programmatic and API clients.

### Super Admin Login Example:
```javascript
// POST /api/v1/admin/auth/login
const res = await fetch("http://localhost:5001/api/v1/admin/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Captures HttpOnly session cookie
  body: JSON.stringify({
    email: "admin@dezoryn.com",
    password: "YourSecurePassword123!"
  })
});

const data = await res.json();
// data.data.token contains the session token
// data.data.user contains the authenticated Super Admin profile
```

### Super Admin Profile Verification (`/api/v1/admin/auth/me`):
```javascript
const res = await fetch("http://localhost:5001/api/v1/admin/auth/me", {
  headers: {
    "Authorization": `Bearer ${token}`
  },
  credentials: "include"
});
```

### Super Admin Logout (`/api/v1/admin/auth/logout`):
```javascript
const res = await fetch("http://localhost:5001/api/v1/admin/auth/logout", {
  method: "POST",
  credentials: "include"
});
```

---

## 5. Global Website Page-to-Endpoint Mapping (`frontend/`)

| Website Page Route | Backend API Endpoint | Key Data Returned |
| :--- | :--- | :--- |
| `/` (Homepage) | `GET /api/v1/pages/home` | 11 homepage builder sections, headline, CTAs, cards |
| Header Navigation | `GET /api/v1/navigation` | Header mega-menu hierarchy and mobile nav links |
| Footer | `GET /api/v1/navigation` | 6-column footer navigation hierarchy |
| Brand Info & Settings | `GET /api/v1/settings/public` | Public site name, primary currency, support contact |
| `/about` (Company) | `GET /api/v1/company` | Mission, Vision, Core Values, Leadership & Offices |
| `/products` (Marketplace) | `GET /api/v1/products` | All published SaaS engines with tier plans |
| `/products/[slug]` | `GET /api/v1/products/:slug` | SaaS engine capabilities, features, plans, matrix |
| `/products/compare` | `GET /api/v1/products/compare` | 7 comparison attributes across 13 SaaS engines |
| `/solutions` | `GET /api/v1/solutions` | Published enterprise solutions blueprints |
| `/solutions/[slug]` | `GET /api/v1/solutions/:slug` | Enterprise solution architecture details |
| `/industries` | `GET /api/v1/industries` | 10 industry verticals and blueprints |
| `/industries/[slug]` | `GET /api/v1/industries/:slug` | Industry challenges, solutions, ROI metrics |
| `/projects` (Portfolio) | `GET /api/v1/projects` | 13 customer engineering showcases |
| `/case-studies` | `GET /api/v1/case-studies` | 13 case studies with ROI metrics and testimonials |
| `/blog` | `GET /api/v1/content/blog` | Technical blog articles with search & pagination |
| `/pricing` | `GET /api/v1/pricing` | Starter, Growth, Business, Enterprise pricing tiers |
| `/legal/[slug]` | `GET /api/v1/legal/:slug` | Legal policies (Privacy, Terms, Security, Refund) |
| Public Contact Form | `POST /api/v1/contact` | Submits inquiry with 2-min duplicate spam throttle |
| Public Demo Calendar | `POST /api/v1/demo` | Schedules product walkthrough session |
| Newsletter Subscription | `POST /api/v1/newsletter/subscribe` | Email subscription with duplicate handling |

---

## 6. Admin Panel Module-to-Endpoint Mapping (`admin/`)

| Admin Module | Backend API Endpoint | HTTP Method |
| :--- | :--- | :--- |
| Executive Dashboard | `/api/v1/admin/dashboard` | `GET` |
| Products Management | `/api/v1/admin/products` | `GET`, `POST` |
| Product Details / Edit | `/api/v1/admin/products/:id` | `GET`, `PUT`, `DELETE` |
| Product Publish State | `/api/v1/admin/products/:id/publish` | `POST` |
| Inbound CRM Leads | `/api/v1/admin/inquiries` | `GET` |
| Lead Pipeline Status | `/api/v1/admin/inquiries/:id/status`| `PATCH` |
| Demo Walkthroughs | `/api/v1/admin/demos` | `GET` |
| Demo Confirmation | `/api/v1/admin/demos/:id/status` | `PATCH` |
| CMS Pages Management | `/api/v1/admin/pages` | `GET`, `POST` |
| Page Edit & Sections | `/api/v1/admin/pages/:id` | `GET`, `PUT`, `DELETE` |
| Section Content / Settings | `/api/v1/admin/sections/:id` | `PUT` |
| Media Asset Library | `/api/v1/admin/media` | `GET`, `POST` |
| Media File Upload | `/api/v1/admin/media/upload` | `POST` (multipart) |
| Media Asset Deletion | `/api/v1/admin/media/:id` | `DELETE` |
| User Governance | `/api/v1/admin/users` | `GET`, `POST` |
| User Details / Update | `/api/v1/admin/users/:id` | `GET`, `PUT`, `DELETE` |
| RBAC Roles & Perms | `/api/v1/admin/roles` | `GET` |
| System Settings | `/api/v1/admin/settings` | `GET`, `PUT` |
| Corporate Profile | `/api/v1/admin/company` | `PUT` |
| Legal Policies | `/api/v1/admin/legal/:id` | `PUT` |
| Security Audit Trail | `/api/v1/admin/audit-logs` | `GET` |
| Admin Notifications | `/api/v1/admin/notifications` | `GET` |
