# GEMINI.md

Always adhere to the instructions and constraints defined in [AGENTS.md](./AGENTS.md) and [.agents/rules/architecture.md](./.agents/rules/architecture.md).

## Summary of Core Directives

1. **Single-Brand E-Commerce Only**: Never introduce multi-tenancy, marketplace vendor models, SaaS structures, or subscription logic.
2. **Medusa v2 Architecture**: Use Medusa workflows for business logic, file-based routes in `src/api`, and native built-in Admin at `/app`. Never build a custom admin dashboard for the real backend (a client-side simulation is permitted solely in `apps/portfolio-demo`) or rewrite with NestJS.
3. **No Unapproved Dependencies**: Strictly forbidden: Meilisearch, pgvector, custom AI recommendation systems, visual page builders.
4. **Package Manager**: Strictly `pnpm`. Never use npm/yarn or commit secondary lockfiles.
5. **Approved Stack**: PostgreSQL 16, Redis 7, Docker Compose, Next.js 15 Storefront, Stripe payments, S3 image storage, Resend/SendGrid emails, and VPS reverse proxy deployment.
