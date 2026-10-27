# DEZORYN TECHNOLOGY — Enterprise Monorepo

Welcome to the **DEZORYN TECHNOLOGY** enterprise platform monorepo.

## Project Structure
- `frontend/` — Next.js 14 global marketing & SaaS marketplace portal (`http://localhost:3000`)
- `admin/` — Next.js 14 unified administrative control plane (`http://localhost:3001`)
- `backend/` — Node.js & Fastify backend API engine and PostgreSQL database service (`http://localhost:5001`)

---

## 🚀 Creating an Administrator Account

In compliance with our security baseline, there is **NO public sign-up page**. Administrative accounts must be created using the backend CLI setup script:

```bash
cd backend

# Interactive creation (prompts for email, masks password input with asterisks):
npm run admin:create

# Non-interactive / automation mode:
ADMIN_EMAIL="admin@dezoryn.com" ADMIN_PASSWORD="YourStrongPassword123!" ADMIN_NAME="Administrator" npm run admin:create
```

### Key Security Guarantees:
- **No Password Exposure**: Password input is masked in the terminal and never printed to server logs.
- **Duplicate Account Prevention**: Rejects duplicate registrations for an existing email address.
- **Cryptographic Hashing**: Hashes passwords using salted Bcrypt/Argon2id.
- **Single-Tier Admin Control**: No role-based fragmentation; any active admin has full access to the control plane.

---

## 🔑 Administrator Authentication & Password Reset Flow

1. **Login**: Navigate to `http://localhost:3001/login` and enter your registered credentials.
2. **Forgot Password**: Click "Forgot Password?" or visit `http://localhost:3001/forgot-password`. Enter your registered email to generate a cryptographically signed, single-use, 1-hour reset token.
3. **Reset Password**: Open the reset link (`http://localhost:3001/reset-password?token=...`), enter your new password, and submit. The token will be consumed, your password updated, and all previous active sessions invalidated.

### Email Delivery Configuration (`backend/.env`):
```env
SMTP_HOST="smtp.provider.com"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-smtp-password"
SMTP_FROM="security@dezoryn.com"
ADMIN_URL="http://localhost:3001"
```
*Note: If SMTP is not configured, reset links are logged securely to the backend console for local development and testing.*
