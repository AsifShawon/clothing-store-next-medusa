# London Boy DTC — Production Operations & Reliability Runbook

This runbook defines the operational standards, maintenance workflows, disaster recovery procedures, and security guidelines for operating the Medusa v2 DTC clothing store backend and Next.js 15 storefront in production.

---

## 1. Production Architecture Overview

The production deployment consists of:
- **Medusa v2 Backend (`apps/backend`)**: Node.js 20+ service running at port 9000, serving REST API endpoints, Medusa Admin at `/app`, and background workflow tasks.
- **Next.js 15 Storefront (`apps/storefront`)**: Node.js standalone service running at port 8000, rendering customer-facing e-commerce pages.
- **PostgreSQL 16**: Primary relational database storing products, orders, customers, inventory, and payment sessions.
- **Redis 7**: In-memory data store providing distributed caching and asynchronous event bus pub/sub.
- **Cloudflare R2 / AWS S3**: S3-compatible cloud object storage for product media and garment swatches.
- **Stripe**: Payment provider processing debit/credit cards with webhook signature verification.
- **Resend**: Transactional email service for order receipts and password reset notifications.
- **Caddy / Nginx Reverse Proxy**: TLS termination, HTTP/2 & HTTP/3, security headers, and domain routing.

---

## 2. Infrastructure Sizing & Requirements

| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Server (VPS / Dedicated)** | 2 vCPU, 4GB RAM, 50GB NVMe SSD | 4 vCPU, 8GB RAM, 100GB NVMe SSD |
| **Operating System** | Ubuntu 22.04 LTS / 24.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| **Docker & Docker Compose** | Docker Engine 24+, Compose v2.20+ | Docker Engine 27+ |
| **Node.js Runtime** | Node.js 20.19.0 LTS | Node.js 20.19.0 LTS |
| **PostgreSQL** | Version 16 Alpine | Managed PostgreSQL 16 (DigitalOcean, Neon, RDS) |
| **Redis** | Version 7 Alpine (with password authentication) | Version 7 Alpine (with AOF persistence) |

---

## 3. Environment Variables Reference

Environment configuration is strictly validated at backend startup via `apps/backend/src/lib/env.ts`. Any missing or weak production values halt startup immediately.

### Backend (`apps/backend/.env.production`)

| Variable | Scope | Mandatory | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Server | Yes | Set to `production` | `production` |
| `PORT` | Server | No | Port backend listens on | `9000` |
| `DATABASE_URL` | Server | Yes | PostgreSQL connection string | `postgres://user:pass@host:5432/medusa_prod` |
| `REDIS_URL` | Server | Yes | Redis connection string | `redis://:pass@host:6379` |
| `JWT_SECRET` | Server | Yes | 32+ char random key for JWT signing | *Random 64-char string* |
| `COOKIE_SECRET` | Server | Yes | 32+ char random key for session cookies | *Random 64-char string* |
| `STORE_CORS` | Server | Yes | Comma-separated storefront origins | `https://londonboy.co.uk` |
| `ADMIN_CORS` | Server | Yes | Comma-separated admin origins | `https://admin.londonboy.co.uk` |
| `AUTH_CORS` | Server | Yes | Comma-separated auth origins | `https://londonboy.co.uk,https://admin.londonboy.co.uk` |
| `MEDUSA_BACKEND_URL` | Server | Yes | Public URL of backend API | `https://api.londonboy.co.uk` |
| `STOREFRONT_URL` | Server | Yes | Public URL of customer storefront | `https://londonboy.co.uk` |
| `S3_URL` | Server | Yes | Public media URL CDN/Bucket | `https://media.londonboy.co.uk` |
| `S3_BUCKET` | Server | Yes | Bucket name | `londonboy-media` |
| `S3_REGION` | Server | Yes | Bucket region | `auto` (for R2) or `us-east-1` |
| `S3_ENDPOINT` | Server | Yes | Endpoint (required for R2/MinIO) | `https://<id>.r2.cloudflarestorage.com` |
| `S3_ACCESS_KEY_ID` | Server | Yes | Storage access key ID | *Access Key* |
| `S3_SECRET_ACCESS_KEY`| Server | Yes | Storage secret key | *Secret Key* |
| `STRIPE_API_KEY` | Server | Optional* | Live Stripe Secret Key (`sk_live_...`) | *Stripe API Key* |
| `STRIPE_WEBHOOK_SECRET`| Server | Optional* | Live Webhook Secret (`whsec_...`) | *Webhook Secret* |
| `STRIPE_CAPTURE` | Server | No | Auto capture payment upon authorization | `true` (default) |
| `RESEND_API_KEY` | Server | Optional**| Resend transactional API key | `re_...` |
| `RESEND_FROM_EMAIL` | Server | No | From email for order notifications | `London Boy <orders@send.londonboy.co.uk>` |
| `RESEND_REPLY_TO` | Server | No | Support reply email | `support@londonboy.co.uk` |

*\*Both `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` are required if Stripe is enabled in production.*
*\*\*Required unless `DISABLE_EMAIL_NOTIFICATIONS=true`.*

### Storefront (`apps/storefront/.env.production`)

| Variable | Scope | Mandatory | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Server/Client| Yes | Set to `production` | `production` |
| `PORT` | Server | No | Port storefront listens on | `8000` |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Client | Yes | Medusa backend API URL | `https://api.londonboy.co.uk` |
| `NEXT_PUBLIC_BASE_URL` | Client | Yes | Storefront URL | `https://londonboy.co.uk` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`| Client | Yes | Medusa Publishable API key | `pk_...` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Client | No | Default store region | `bd` |
| `NEXT_PUBLIC_STRIPE_KEY` | Client | Optional | Stripe publishable key (`pk_live_...`)| `pk_live_...` |

---

## 4. Deployment Procedure

### Pre-Deployment Checklist
1. Verify secrets are generated and stored in a secure secret manager (e.g. 1Password, Doppler, or server `.env.production` with `chmod 600`).
2. Generate 64-character random secrets:
   ```bash
   openssl rand -base64 48
   ```
3. Test that PostgreSQL and Redis are reachable.
4. Verify DNS records for domains:
   - `londonboy.co.uk` -> VPS Public IP
   - `api.londonboy.co.uk` -> VPS Public IP
   - `media.londonboy.co.uk` -> Cloudflare R2 custom domain

### Step 1: Clone Repository & Checkout Tag
```bash
git clone https://github.com/AsifShawon/clothing-store-next-medusa.git /var/www/londonboy
cd /var/www/londonboy
git checkout tags/v1.0.0 # or target release commit
```

### Step 2: Configure Environment
```bash
cp apps/backend/.env.template apps/backend/.env.production
cp apps/storefront/.env.template apps/storefront/.env.production
# Fill in real production values
chmod 600 apps/backend/.env.production apps/storefront/.env.production
```

### Step 3: Run Database Migrations (Release Step)
Never run migrations automatically on multiple horizontally scaled replicas. Run migrations once as an explicit deployment step:
```bash
docker compose -f docker-compose.prod.yml run --rm backend pnpm exec medusa db:migrate
```

### Step 4: Provision Initial Admin User (First Time Only)
```bash
docker compose -f docker-compose.prod.yml run --rm backend pnpm exec medusa user -e admin@londonboy.co.uk -p 'GENERATE_A_VERY_SECURE_PASSWORD'
```

### Step 5: Build & Launch Services
```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Step 6: Verify Service Health
```bash
# Check container statuses and health states
docker compose -f docker-compose.prod.yml ps

# Query backend health probe
curl -f https://api.londonboy.co.uk/health

# Check live structured logs
docker compose -f docker-compose.prod.yml logs -f --tail=100 backend
```

---

## 5. Stripe Webhook Setup

1. In the Stripe Dashboard (Live Mode), navigate to **Developers > Webhooks**.
2. Click **Add endpoint**.
3. Endpoint URL: `https://api.londonboy.co.uk/hooks/payment/stripe_stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.amount_capturable_updated`
5. Click **Add endpoint**, then reveal the **Signing secret** (`whsec_...`).
6. Set `STRIPE_WEBHOOK_SECRET=whsec_...` in `apps/backend/.env.production`.

---

## 6. Database Backups & Restoration

### Automated Daily Backup (`cron`)
Create `/usr/local/bin/medusa-backup.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/medusa"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/medusa_prod_${TIMESTAMP}.dump"

mkdir -p "${BACKUP_DIR}"

# Take binary custom-format dump
docker exec medusa-prod-postgres pg_dump -U medusa_user -d medusa_prod -Fc > "${BACKUP_FILE}"

# Keep last 14 days of backups locally
find "${BACKUP_DIR}" -type f -name "*.dump" -mtime +14 -delete

echo "Backup complete: ${BACKUP_FILE}"
```
Make executable and schedule in cron:
```bash
chmod +x /usr/local/bin/medusa-backup.sh
# In /etc/cron.d/medusa-backup:
0 3 * * * root /usr/local/bin/medusa-backup.sh >> /var/log/medusa-backup.log 2>&1
```

### Restoration Procedure
To restore from a backup file:
```bash
# 1. Stop backend service to prevent write conflicts
docker compose -f docker-compose.prod.yml stop backend

# 2. Restore database from dump
docker exec -i medusa-prod-postgres pg_restore -U medusa_user -d medusa_prod --clean --if-exists < /var/backups/medusa/medusa_prod_YYYYMMDD_HHMMSS.dump

# 3. Restart backend
docker compose -f docker-compose.prod.yml start backend
```

---

## 7. Zero-Downtime Rolling Update & Rollback

### Rolling Update
```bash
# 1. Pull latest code
git pull origin main

# 2. Build updated container images
docker compose -f docker-compose.prod.yml build

# 3. Run database migrations
docker compose -f docker-compose.prod.yml run --rm backend pnpm exec medusa db:migrate

# 4. Gracefully restart backend and storefront
docker compose -f docker-compose.prod.yml up -d --no-deps backend storefront
```

### Emergency Rollback
```bash
# 1. Checkout previous known-good git release
git checkout tags/v_PREVIOUS_VERSION

# 2. Rebuild and deploy containers
docker compose -f docker-compose.prod.yml up -d --build backend storefront

# 3. If database schema rollback is required, restore last backup:
# (Follow Restoration Procedure above)
```

---

## 8. Secret Rotation Guidelines

### Rotating JWT & Cookie Secrets
1. Generate new secrets via `openssl rand -base64 48`.
2. Update `JWT_SECRET` and `COOKIE_SECRET` in `apps/backend/.env.production`.
3. Restart backend: `docker compose -f docker-compose.prod.yml restart backend`.
*Impact: Active customer and admin sessions will require re-login. Existing orders and database data remain unaffected.*

### Rotating Stripe Keys
1. In Stripe Dashboard, generate a new Restricted or Secret Key.
2. In Webhooks, add a secondary webhook signing secret.
3. Update `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` in `.env.production`.
4. Restart backend: `docker compose -f docker-compose.prod.yml restart backend`.
5. After verifying live test transactions, delete the old key in Stripe Dashboard.

---

## 9. Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **Startup Error: `Production Environment Validation Failed`** | Missing required variable or weak secret in production. | Check error output for specific missing key. Ensure `JWT_SECRET` and `COOKIE_SECRET` are >= 32 characters and do not contain `supersecret` or `placeholder`. |
| **CORS Error in Browser Console** | Misconfigured origin in `STORE_CORS` or `ADMIN_CORS`. | Ensure the exact protocol and domain (e.g. `https://londonboy.co.uk`) is listed in `STORE_CORS` without trailing slash or path. |
| **Storefront 401: Invalid Publishable Key** | Missing or incorrect `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. | Create a publishable key in Medusa Admin (`/app/settings/publishable-api-keys`), associate it with your sales channel, and update storefront environment. |
| **Stripe Webhook Returns 400 Bad Request** | Webhook secret mismatch. | Verify `STRIPE_WEBHOOK_SECRET` in backend matches the active live signing secret in Stripe Dashboard. |
| **Image Upload Fails in Admin** | Missing or invalid S3 / Cloudflare R2 credentials. | Verify `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and `S3_ENDPOINT` in `.env.production`. In dev, fallback local storage can be used. |
| **Redis Connection Timeout** | Redis container stopped or password incorrect. | Check `docker compose -f docker-compose.prod.yml logs redis` and verify `REDIS_URL` matches credentials. |
