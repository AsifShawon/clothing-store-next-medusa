# Single-Brand Clothing E-Commerce Architecture & Scope Guardrails

## Core Project Mission

This repository is dedicated solely to building and maintaining a production-ready, single-brand clothing e-commerce platform using the official Medusa v2 DTC starter and Next.js storefront.

---

## Non-Negotiable Scope Boundaries

The following concepts, patterns, and technologies are **STRICTLY PROHIBITED** from being introduced:

| Forbidden Area | Rule | Reason |
| :--- | :--- | :--- |
| **SaaS & Multi-tenancy** | No tenant isolation, tenant IDs, or multi-tenant schemas. | Single-brand direct-to-consumer store only. |
| **Marketplace Vendors** | No vendor portals, vendor payout logic, or multi-vendor catalogs. | Single brand ownership. |
| **Custom Admin Dashboard** | Do not build a separate admin dashboard for the Medusa backend. | The built-in Medusa Admin at `/app` (`@medusajs/dashboard`) must be used for real store operations. (Note: A simulated client-side Demo Admin is permitted solely within `apps/portfolio-demo` for browser-only demonstration). |
| **Alternative Frameworks** | No NestJS, Express rewrites, or competing backend frameworks. | Medusa v2 framework is standard. |
| **AI / Recommendations** | No AI agents in runtime checkout, LLM product generation, or pgvector embeddings. | Out of scope; focus on core e-commerce stability. |
| **Search Engines** | No Meilisearch, Elasticsearch, or Algolia integrations. | Medusa native search and filtering are sufficient for single-brand catalog. |
| **Subscriptions** | No recurring billing or subscription models. | One-time clothing checkout. |
| **Page-Builder Tools** | No visual CMS / drag-and-drop page builder plugins. | Hardened React/Next.js component templates. |

---

## Architectural Conventions

1. **Framework & Language**:
   - Backend: Medusa v2 (`@medusajs/medusa` v2.19+) on Node.js 20+ / 22+.
   - Storefront: Next.js 15 App Router (`apps/storefront`).
   - Admin: Built-in Medusa Admin (`apps/backend/src/admin` for custom extensions/widgets only).
2. **Business Logic in Workflows**:
   - Route handlers (`src/api/*`) MUST only validate inputs, resolve container services, and trigger Workflows (`src/workflows/*`).
   - Business operations (custom checkout steps, notification dispatches, external syncing) belong in workflows and steps.
3. **Data Access & Modules**:
   - Use Medusa module services and the Query Graph (`container.resolve(ContainerRegistrationKeys.QUERY)`).
   - Never write raw SQL queries or import direct database clients in API handlers.
   - When adding custom data models, always generate migrations using `pnpm exec medusa db:generate <module-name>`.
4. **Package Management**:
   - `pnpm` is the ONLY allowed package manager (`pnpm@10.11.1`).
   - Never run `npm install`, `yarn`, or `bun`, and never commit secondary lockfiles (`package-lock.json`, `yarn.lock`).
5. **Approved Integrations**:
   - **Database**: PostgreSQL 16+
   - **Cache & Event Bus**: Redis 7+
   - **Payments**: Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js` on storefront, Medusa Stripe payment provider)
   - **Media Storage**: S3-compatible cloud storage (AWS S3, MinIO, Cloudflare R2)
   - **Transactional Email**: Resend or SendGrid
   - **Deployment**: Docker Compose on VPS behind a reverse proxy (Caddy / Nginx)

---

## Security & Secrets

- Never commit `.env` or `.env.local` files to version control.
- Maintain comprehensive `.env.example` files in `apps/backend` and `apps/storefront` with clear documentation for each required key.
- Storefront requests to Medusa must always include `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
