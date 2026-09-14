# ==============================================================================
# NEXT.JS 15 STOREFRONT PRODUCTION DOCKERFILE
# Multi-stage standalone build with minimal attack surface and small image size.
# ==============================================================================

FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.11.1
WORKDIR /app

# ------------------------------------------------------------------------------
# 1. Dependency Resolution Stage
# ------------------------------------------------------------------------------
FROM base AS dependencies
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/commerce-contracts/package.json ./packages/commerce-contracts/package.json
COPY packages/storefront-ui/package.json ./packages/storefront-ui/package.json
COPY apps/storefront/package.json ./apps/storefront/package.json

# Install dependencies for storefront and its workspace dependencies
RUN pnpm install --frozen-lockfile --filter @dtc/storefront...

# ------------------------------------------------------------------------------
# 2. Build Stage
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/apps/storefront/node_modules ./apps/storefront/node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/storefront ./apps/storefront

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_CHECK=true
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_build_stage_placeholder
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}

RUN pnpm --filter @dtc/storefront run build

# ------------------------------------------------------------------------------
# 3. Production Runner Stage (Standalone Output)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Copy standalone build and public static assets
COPY --from=builder --chown=node:node /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=builder --chown=node:node /app/apps/storefront/public ./apps/storefront/public

USER node

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 8000)).then((res) => { if (res.status >= 500) process.exit(1); }).catch(() => process.exit(1))"

CMD ["node", "apps/storefront/server.js"]
