# DEZORYN TECHNOLOGY — Shared Fastify Backend & Database Service

The enterprise backend API and PostgreSQL control plane engine powering both the **DEZORYN TECHNOLOGY** Global Website (`frontend/`, port 3000) and Super Admin Console (`admin/`, port 3001).

Built with:
- **Runtime & Server**: Node.js, Fastify `^4.29.1`, TypeScript
- **Database**: PostgreSQL `14+` (`dezoryn_db`, 34 tables)
- **ORM**: Prisma ORM `^5.22.0`
- **Validation**: Zod schema validation
- **Documentation**: Swagger / OpenAPI 3.0 UI at `/docs`
- **Security**: Bcrypt password hashing, session tokens (`AdminSession`), HttpOnly cookies, CSRF protection, multi-origin CORS, rate limiting, and automated audit logging
- **Authorization**: **ONE Super Admin role (`super_admin`)** across all administrative endpoints.

---

## 1. Architecture Overview

The backend uses a modular layered architecture:

```
backend/
├── src/
│   ├── config/          # Environment validation (Zod), constants, database singleton
│   ├── plugins/         # Fastify plugins (CORS, Cookie, Rate Limit, Multipart, Swagger, Error Handler)
│   ├── middleware/      # Authentication (Bearer + Cookie), Super Admin authorization, Audit logger
│   ├── modules/         # 22 Domain modules (Routes, Controllers, Services, Schemas)
│   │   ├── auth/        # Login, logout, current user, password change
│   │   ├── users/       # Admin user management & safety guards
│   │   ├── roles/       # Role and 14 permission inspection
│   │   ├── dashboard/   # Real DB metrics, product/page counts, activity streams
│   │   ├── pages/       # Public CMS pages & 11 homepage builder sections
│   │   ├── navigation/  # Header mega-menus, 6-column footer links
│   │   ├── company/     # Corporate narrative, leadership roster, offices
│   │   ├── legal/       # 6 legal policies (Privacy, Terms, Security, etc.)
│   │   ├── products/    # 13 SaaS products, categories, features, plans
│   │   ├── comparison/  # 7 criteria evaluation matrix across all products
│   │   ├── solutions/   # 7 enterprise architecture blueprints
│   │   ├── industries/  # 10 vertical blueprints, challenges & ROI metrics
│   │   ├── projects/    # 13 engineering showcases
│   │   ├── case-studies/# 13 customer case studies & testimonials
│   │   ├── resources/   # Blog, whitepapers, runbooks, public APIs, FAQs, careers, partners
│   │   ├── pricing/     # Tiered pricing plans with price update audit logs
│   │   ├── leads/       # Contact enquiries, demo bookings, newsletter with spam defense
│   │   ├── media/       # Safe file upload, MIME/size validation, local & cloud storage abstraction
│   │   ├── settings/    # Public sanitized config & admin secret-masked settings
│   │   ├── audit/       # Immutable administrative audit trail
│   │   ├── notifications/# Actionable unread leads, pending demos, failed logins
│   │   └── health/      # Live database latency check (/health, /api/v1/health)
│   ├── routes/          # Central router mounting /api/v1 and /api legacy alias
│   ├── shared/          # Types, AppError hierarchy, success/error responders, hashing
│   ├── app.ts           # Fastify application factory
│   └── server.ts        # Server entrypoint
├── scripts/             # Admin consolidation & bootstrap scripts
├── docs/                # Comprehensive documentation
│   ├── DATABASE_TO_MODULE_MAPPING.md
│   ├── API_ENDPOINT_INVENTORY.md
│   └── FRONTEND_INTEGRATION_GUIDE.md
└── tests/               # Test suites
```

---

## 2. Prerequisites & Setup

- **Node.js**: `v20.x` or higher
- **PostgreSQL**: `14.x` or higher running with database `dezoryn_db`
- **npm**: `v10.x` or higher

### Environment Configuration
```bash
cd backend
cp .env.example .env
```

Ensure `.env` matches your local database:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dezoryn_db?schema=public"
PORT=5001
HOST="0.0.0.0"
NODE_ENV="development"
FRONTEND_ORIGIN="http://localhost:3000"
ADMIN_ORIGIN="http://localhost:3001"
SESSION_SECRET="your-strong-production-session-secret-min-32-chars"
COOKIE_SECRET="your-strong-cookie-signing-secret-min-32-chars"
```

---

## 3. Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Run backend in development mode with hot-reload (`tsx watch src/server.ts`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production bundle (`node dist/server.js`) |
| `npm test` | Run comprehensive 46-point backend test suite |
| `npm run test:db` | Run 38-point database integrity test suite |
| `npm run bootstrap:admin` | Idempotent Super Admin creation or password reset script |
| `npm run consolidate:roles` | Safe migration script assigning all admin users to `super_admin` |
| `npm run db:studio` | Open Prisma Studio GUI at `http://localhost:5555` |

---

## 4. Admin Account Creation & Authentication (No Role-Based Permissions)

### Secure Admin Creation (CLI Setup Script)
The system does not expose a public sign-up page. Administrator accounts must be created directly on the backend using the secure CLI command:

```bash
# Interactive Mode (prompts securely for email and masks password input with asterisks):
npm run admin:create

# Non-Interactive / CI Mode (via environment variables):
ADMIN_EMAIL="admin@dezoryn.com" ADMIN_PASSWORD="YourStrongPassword123!" ADMIN_NAME="Admin User" npm run admin:create
```

#### Security Guarantees:
1. **Password Masking**: Terminal input is masked so passwords are never visible or printed to console logs.
2. **Duplicate Account Prevention**: Rejects any attempt to re-register an existing email with an explicit notice to prevent accidental duplicates.
3. **Password Hashing**: Uses secure password hashing (Bcrypt / Argon2id compatible). Plaintext passwords are never stored.
4. **No Public Endpoint**: There is no unauthenticated public registration endpoint.

---

### Password Recovery & Email Delivery Configuration

#### Configuration Environment Variables (`backend/.env`):
```env
# Optional SMTP email provider configuration
SMTP_HOST="smtp.provider.com"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-smtp-password"
SMTP_FROM="security@dezoryn.com"

# Admin Frontend Base URL (used in password reset links)
ADMIN_URL="http://localhost:3001"
```

#### Behavior When Email Provider Is Not Configured:
- The system **does not falsely claim** an email was dispatched.
- For local development and testing, the single-use reset URL is logged securely to the backend terminal:
  `[AUTH SERVICE] Reset URL: http://localhost:3001/reset-password?token=<single_use_token>`
- The API returns a generic anti-enumeration response: `"If that administrative email is registered, instructions to reset your password have been generated."`

---

### Authentication API Endpoints
* `POST /api/v1/admin/auth/login` — Authenticates admin, establishes HttpOnly session cookie and Bearer token.
* `POST /api/v1/admin/auth/logout` — Revokes active database session and clears cookies.
* `GET /api/v1/admin/auth/me` — Returns current authenticated admin profile.
* `POST /api/v1/admin/auth/forgot-password` — Generates single-use, 1-hour cryptographically hashed reset token.
* `POST /api/v1/admin/auth/reset-password` — Validates single-use token, updates password, marks token as used, and invalidates all existing sessions.

---

## 5. API Documentation

Interactive Swagger / OpenAPI 3.0 documentation is available when the server is running:

- **Swagger UI**: `http://localhost:5001/docs`
- **OpenAPI JSON Spec**: `http://localhost:5001/docs/json`

Refer to:
- [`docs/API_ENDPOINT_INVENTORY.md`](file:///Users/shikhagour/Downloads/dezoryn%203/backend/docs/API_ENDPOINT_INVENTORY.md) for full endpoint lists.
- [`docs/DATABASE_TO_MODULE_MAPPING.md`](file:///Users/shikhagour/Downloads/dezoryn%203/backend/docs/DATABASE_TO_MODULE_MAPPING.md) for schema mappings across all 34 tables.
- [`docs/FRONTEND_INTEGRATION_GUIDE.md`](file:///Users/shikhagour/Downloads/dezoryn%203/backend/docs/FRONTEND_INTEGRATION_GUIDE.md) for frontend integration instructions.

---

## 6. Dual API Versioning Support

The backend exposes all endpoints under two paths:
1. **Primary Standard**: `/api/v1/*` (e.g. `/api/v1/products`, `/api/v1/admin/dashboard`)
2. **Backwards Compatible Alias**: `/api/*` (e.g. `/api/products`, `/api/admin/leads`, `/api/website/pages`)

This ensures complete compatibility with existing frontend code (`frontend/lib/api.js` and `admin/lib/api.js`) without modifying client-side implementations.
