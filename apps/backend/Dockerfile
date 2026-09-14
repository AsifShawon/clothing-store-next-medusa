# ==============================================================================
# MEDUSA V2 BACKEND PRODUCTION DOCKERFILE
# Multi-stage, non-root, frozen-lockfile build optimized for Turborepo monorepo.
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

# Copy monorepo configuration and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install dependencies for the backend project only
RUN pnpm install --frozen-lockfile --filter @dtc/backend...

# ------------------------------------------------------------------------------
# 2. Build Stage
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend ./apps/backend

ENV NODE_ENV=production
RUN pnpm --filter @dtc/backend run build

# ------------------------------------------------------------------------------
# 3. Production Runner Stage
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk update && apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.11.1
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

# Copy installed node_modules and built application
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/backend ./apps/backend
COPY --from=builder --chown=node:node /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./

USER node

WORKDIR /app/apps/backend

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 9000) + '/health').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["pnpm", "run", "start"]
