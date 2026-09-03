# London Boy Portfolio Demo Architecture & Separation Guide

## Overview

This repository contains two distinct architectural tiers:
1. **The Real Production Stack** (`apps/backend` + `apps/storefront`): A full-featured headless e-commerce system built on Medusa v2.19, PostgreSQL 16, Redis 7, Stripe, Resend email notifications, and S3-compatible media storage.
2. **The Portfolio Demonstration Application** (`apps/portfolio-demo`): A standalone, zero-backend, browser-only Next.js 15 static export (`output: "export"`) that simulates the full London Boy commerce lifecycle using versioned browser `localStorage`.

---

## Architectural Separation Matrix

| Dimension | Real Production Stack (`apps/backend` + `apps/storefront`) | Portfolio Demo (`apps/portfolio-demo`) |
| :--- | :--- | :--- |
| **Backend / Framework** | Medusa v2.19 framework (`@medusajs/medusa`) | Zero backend (runs 100% in client browser) |
| **Database** | PostgreSQL 16 relational database | Browser HTML5 `localStorage` (`LB_DEMO_STORAGE_V1`) |
| **Cache & Event Bus** | Redis 7 + Medusa Event Subscribers | In-memory React state + LocalStorage sync |
| **Admin Panel** | Native built-in `@medusajs/dashboard` at `/app` | Simulated `/demo-admin` suite (product CRUD, orders, promos) |
| **Storefront Deployment** | Node.js SSR / Hybrid Server on VPS | Portable Static Export (`out/` directory on GitHub Pages / Vercel) |
| **Payments** | Stripe Elements & webhook processing | Simulated payment authorization (COD & test card) |
| **API Keys / Secrets** | Requires `.env` with publishable key & secrets | Zero credentials or `.env` required |

---

## Portfolio Demo LocalStorage Lifecycle

1. **Hydration**: On application load, `loadStateFromStorage()` reads `LB_PORTFOLIO_DEMO_STATE_V1`. If empty or version mismatch, it automatically loads `INITIAL_DEMO_STATE`.
2. **Reactivity**: `DemoProvider` manages state updates across product additions, cart changes, and order creations.
3. **Query Parameter Routing**: To guarantee seamless static builds with `output: "export"`, dynamic entities use query parameters (e.g. `/product?handle=heavyweight-t-shirt`, `/order?id=LB-ORD-1001`, `/demo-admin/product?id=prod_1`).
4. **Suspense Boundaries**: Every page consuming `useSearchParams()` is wrapped in `<Suspense>` to ensure static export compilation succeeds.
5. **State Reset**: Clicking &quot;Reset Demo Data&quot; immediately purges custom session changes and restores the 6 authentic London Boy garments and 38 variants.

---

## Development & Build Commands

```bash
# Run Portfolio Demo locally (http://localhost:8080)
pnpm run demo:dev

# Build and generate static export in apps/portfolio-demo/out
pnpm run demo:build

# Lint and typecheck the demo app
pnpm run demo:lint
pnpm run demo:test
```
