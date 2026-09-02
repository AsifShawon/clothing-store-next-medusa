# London Boy — Direct-to-Consumer (DTC) Clothing E-Commerce Platform

<p align="center">
  <img src="docs/assets/screenshots/01-homepage-desktop.png" alt="London Boy Storefront Desktop" width="100%">
</p>

<p align="center">
  <a href="https://asifshawon.github.io/clothing-store-next-medusa/"><img src="https://img.shields.io/badge/Live%20Storefront-Demo-black?style=for-the-badge&logo=vercel" alt="Live Storefront Demo" /></a>
  <a href="https://asifshawon.github.io/clothing-store-next-medusa/demo-admin/"><img src="https://img.shields.io/badge/Live%20Demo-Admin%20Dashboard-4F46E5?style=for-the-badge&logo=safari" alt="Live Demo Admin" /></a>
  <a href="#portfolio-case-study"><img src="https://img.shields.io/badge/Architecture-Case%20Study-059669?style=for-the-badge&logo=readme" alt="Portfolio Case Study" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Medusa_v2-v2.19+-7C3AED?style=flat-square&logo=medusa" alt="Medusa v2" />
  <img src="https://img.shields.io/badge/Next.js-15.5_(App_Router)-black?style=flat-square&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Tests-Playwright_%26_Unit-22C55E?style=flat-square&logo=playwright" alt="Tests" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

## Quick Jump

- [Project Summary](#project-summary)
- [Live Interactive Demos](#live-interactive-demos)
- [Safety Disclaimers & Security Model](#safety-disclaimers--security-model)
- [Monorepo Architecture Distinction](#monorepo-architecture-distinction)
- [Architecture Diagram](#architecture-diagram)
- [Feature Matrix](#feature-matrix)
- [Visual Showcase & Screenshots](#visual-showcase--screenshots)
- [60–90 Second Browser Walkthrough](#6090-second-browser-walkthrough)
- [Technology Stack](#technology-stack)
- [Local Development Instructions](#local-development-instructions)
- [Demo Reset & Storage Management](#demo-reset--storage-management)
- [Known Limitations](#known-limitations)
- [Portfolio Case Study](#portfolio-case-study)
- [Future Real-Production Deployment Path](#future-real-production-deployment-path)

---

## Project Summary

**London Boy** is a production-grade, single-brand Direct-to-Consumer (DTC) menswear e-commerce platform built on modern headless commerce patterns. Designed for high performance, minimalist aesthetics, and streamlined operations, the project demonstrates a complete headless commerce lifecycle — from catalog exploration, faceted filtering, and multi-variant sizing to coupon discounting, responsive bag drawer, multi-step checkout, customer order portals, and merchant back-office administration.

The repository follows a **dual-track monorepo architecture**:
1. **The Real Enterprise Stack** (`apps/backend` + `apps/storefront`): A full-stack headless commerce system powered by the official **Medusa v2 framework**, PostgreSQL 16, Redis 7, Stripe payment authorization, and native Medusa Admin (`@medusajs/dashboard`).
2. **The Portfolio Demonstration Application** (`apps/portfolio-demo`): A zero-backend, 100% client-side Next.js 15 static export (`output: "export"`) leveraging browser `localStorage` to deliver a fully functional, zero-cost, high-reliability interactive demonstration for developer portfolios.

---

## Live Interactive Demos

Experience the complete application live directly in your browser with zero sign-up required:

| Component | Live Demo Link | Local Dev Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Storefront Demo** | [Launch Storefront](https://asifshawon.github.io/clothing-store-next-medusa/) | `http://localhost:8080/` | Customer shopping experience, cart, coupon `LONDON10`, checkout, customer orders |
| **Demo Admin Dashboard** | [Launch Demo Admin](https://asifshawon.github.io/clothing-store-next-medusa/demo-admin/) | `http://localhost:8080/demo-admin/` | Merchant administration: product catalog CRUD, order fulfillment, refund simulation, coupons |
| **60–90s Walkthrough Guide** | [View Walkthrough Guide](docs/walkthrough-guide.md) | — | Step-by-step illustrated narrative of the entire customer & admin workflow |

---

## Safety Disclaimers & Security Model

> [!IMPORTANT]
> ### Explicit Demonstration Constraints & Security Disclaimers:
> - **No Real Payment is Processed**: All transactions, credit card fields, and Cash on Delivery choices are strictly simulated client-side for demonstration purposes.
> - **Demo Admin is Not Secure Authentication**: The `/demo-admin` suite is a simulated browser workspace created for public portfolio inspection; it does not employ server-side tokens or enterprise RBAC.
> - **All Data is Local to Each Browser**: State is stored strictly inside each visitor's browser HTML5 `localStorage` (`london-boy:portfolio-demo:v1`).
> - **Visitors Cannot See One Another's Data**: Because data never leaves the client browser, each visitor operates in a private, isolated sandbox with zero risk of shared data leaks or database vandalism.
> - **One-Click State Reset**: Clicking **"Reset Demo Data"** instantly purges custom orders and restores the authentic 6-garment, 38-variant seed catalog.
> - **Real Production Requires Hosted Infrastructure**: Real-world commercial deployment requires provisioning the Medusa v2 backend with PostgreSQL 16, Redis 7, and live Stripe credentials (`apps/backend`).

---

## Monorepo Architecture Distinction

This repository is strictly partitioned into three distinct applications managed by [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/):

| Dimension | Real Medusa Backend (`apps/backend`) | Real Medusa Storefront (`apps/storefront`) | Portfolio Demo (`apps/portfolio-demo`) |
| :--- | :--- | :--- | :--- |
| **Directory** | `apps/backend` | `apps/storefront` | `apps/portfolio-demo` |
| **Role** | Commercial Headless Backend | Production Web Storefront | Zero-Cost Static Portfolio Demo |
| **Framework** | Medusa v2.19 (`@medusajs/medusa`) | Next.js 15 (App Router / SSR) | Next.js 15 (Static Export / `out`) |
| **Data Layer** | PostgreSQL 16 + MikroORM | Medusa JS Client & REST SDK | Browser `localStorage` Engine |
| **Caching / Queue** | Redis 7 Event Bus & Cache | Next.js Cache & Server Actions | In-Memory React State + Storage Sync |
| **Admin Panel** | Built-in `@medusajs/dashboard` at `/app` | None (Client Storefront) | Simulated `/demo-admin` Suite |
| **Payment Gateway** | Real Stripe Elements & Webhooks | Stripe React Provider | Simulated Payment Sandbox |
| **Hosting Cost** | \$20–\$50/mo (VPS / Managed DB) | \$0–\$20/mo (Vercel / Node VPS) | **\$0.00/mo (GitHub Pages / Static CDN)** |

### 1. `apps/backend`: Real Medusa Commerce Engine
The production headless backend built with Medusa v2. It defines the core domain model, custom workflows, API routes (`src/api/*`), data migrations (`medusa db:migrate`), and the native Medusa Admin dashboard (`@medusajs/dashboard`) served at `/app`. Business logic is encapsulated in composable Medusa Workflows rather than monolithic route handlers.

### 2. `apps/storefront`: Real Medusa-Connected Storefront
The full-scale Next.js 15 App Router storefront configured for production. It communicates with `apps/backend` over HTTP using `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and handles server-side rendering, dynamic inventory queries, Stripe payment element mounts, and user authentication sessions.

### 3. `apps/portfolio-demo`: Static Browser Simulation
A standalone, zero-backend Next.js 15 static export (`output: "export"`). It preserves the exact visual fidelity, UX workflows, component hierarchy, and data schemas of the real stack while executing 100% within the user's browser. It eliminates server operating costs, database sleep states, and vandalism risks for public portfolio hosting.

---

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Monorepo ["London Boy Monorepo (pnpm + Turborepo)"]
        direction TB

        subgraph DemoTrack ["Static Portfolio Track (Zero Cost / 100% Uptime)"]
            DemoApp["apps/portfolio-demo (Next.js 15 Static Export)"]
            LocalStorage["Browser HTML5 localStorage Engine (london-boy:portfolio-demo:v1)"]
            DemoAdmin["Simulated Demo Admin (/demo-admin)"]
            
            DemoApp <--> LocalStorage
            DemoApp <--> DemoAdmin
        end

        subgraph RealTrack ["Real Production Track (Enterprise Infrastructure)"]
            Storefront["apps/storefront (Next.js 15 App Router)"]
            Backend["apps/backend (Medusa v2 Commerce Engine)"]
            Postgres[("PostgreSQL 16 Database")]
            Redis[("Redis 7 Cache & Event Bus")]
            RealAdmin["Native Medusa Admin (@medusajs/dashboard at /app)"]
            StripeGateway["Stripe Payments & Webhooks"]
            S3Storage["S3 Media & Asset Storage"]

            Storefront <-- "REST / SDK (Publishable Key)" --> Backend
            Backend <--> Postgres
            Backend <--> Redis
            Backend <--> RealAdmin
            Backend <--> StripeGateway
            Backend <--> S3Storage
        end
    end

    DeployDemo["GitHub Pages / Vercel Static ($0/mo)"]
    DeployProd["Docker Compose / VPS / Managed Cloud ($30-50/mo)"]

    DemoTrack --> DeployDemo
    RealTrack --> DeployProd
```

---

## Feature Matrix

### Customer Storefront Experience
- **Curated Catalog**: 6 authentic garments (*London Boy Heavyweight T-Shirt, Regent Knit Polo, Oxford Smart Shirt, Soho Cap, Chelsea Chinos, Mayfair Bomber*) with 38 total size and color variants.
- **Dynamic Variant Selector**: Real-time pricing (in BDT ৳), size matrix (S, M, L, XL), color swatches, and live inventory badges.
- **Faceted Search & Filtering**: Instant keyword search and multi-category filters without page reloads.
- **Bag Drawer & Cart**: Responsive sliding drawer, line item management, and subtotal recalculation.
- **Promotion Discount Engine**: Instant validation and application of coupon codes (e.g., `LONDON10` for 10% discount).
- **Multi-Step Checkout**: Customer contact capture, address validation, courier shipping method selection, and payment options.
- **Customer Order Portal**: Order history list, itemized order tracking receipts, and live status badge indicators.

### Merchant Demo Administration (`/demo-admin`)
- **Executive KPI Dashboard**: Real-time Gross Revenue, Order Count, Average Order Value (AOV), and Active Product metrics.
- **Product Catalog Management**: Create new garments, edit descriptions, adjust pricing, toggle visibility, and configure multi-variant inventory matrices with SKU validation.
- **Order Lifecycle Pipeline**: Search and inspect customer orders, transition fulfillment statuses (*Pending $\to$ Processing $\to$ Shipped $\to$ Delivered $\to$ Canceled*), and attach courier tracking numbers.
- **Refund & Cancellation Simulation**: One-click order cancellation with single-execution inventory restoration.
- **Promotional Coupon Manager**: Create custom coupon codes, configure percentage discounts, and toggle active states.
- **Two-Step Demo State Reset**: Instant state purge and restoration to pristine seed catalog.

---

## Visual Showcase & Screenshots

All 12 high-resolution UI states captured automatically via Playwright browser verification:

### 1. Storefront Experience (Desktop & Mobile)

| Desktop Homepage (`1440x900`) | Mobile Homepage (`390x844`) |
| :---: | :---: |
| [![Homepage Desktop](docs/assets/screenshots/01-homepage-desktop.png)](docs/assets/screenshots/01-homepage-desktop.png) | [![Homepage Mobile](docs/assets/screenshots/02-homepage-mobile.png)](docs/assets/screenshots/02-homepage-mobile.png) |

| Shop Catalog with Filters | Product Variant Selection |
| :---: | :---: |
| [![Shop Filters](docs/assets/screenshots/03-shop-filters.png)](docs/assets/screenshots/03-shop-filters.png) | [![Product Variant](docs/assets/screenshots/04-product-variant-selection.png)](docs/assets/screenshots/04-product-variant-selection.png) |

| Shopping Cart & Bag Drawer | Multi-Step Checkout Review |
| :---: | :---: |
| [![Cart](docs/assets/screenshots/05-cart.png)](docs/assets/screenshots/05-cart.png) | [![Checkout Review](docs/assets/screenshots/06-checkout-review.png)](docs/assets/screenshots/06-checkout-review.png) |

| Order Confirmation Receipt | Customer Order History Portal |
| :---: | :---: |
| [![Order Confirmation](docs/assets/screenshots/07-order-confirmation.png)](docs/assets/screenshots/07-order-confirmation.png) | [![Order History](docs/assets/screenshots/08-customer-order-history.png)](docs/assets/screenshots/08-customer-order-history.png) |

---

### 2. Merchant Demo Administration

| Demo Admin Dashboard | Admin Order Management & Tracking |
| :---: | :---: |
| [![Admin Dashboard](docs/assets/screenshots/09-demo-admin-dashboard.png)](docs/assets/screenshots/09-demo-admin-dashboard.png) | [![Admin Order Detail](docs/assets/screenshots/10-admin-order-detail.png)](docs/assets/screenshots/10-admin-order-detail.png) |

| Product & Variant Matrix Editor | Admin Mobile Responsive View |
| :---: | :---: |
| [![Product Editing](docs/assets/screenshots/11-admin-product-editing.png)](docs/assets/screenshots/11-admin-product-editing.png) | [![Admin Mobile](docs/assets/screenshots/12-admin-mobile-view.png)](docs/assets/screenshots/12-admin-mobile-view.png) |

---

## 60–90 Second Browser Walkthrough

Follow the 11-step end-to-end commerce walkthrough to test every feature in under 90 seconds:

```text
[1. Open Storefront] ──> [2. Browse Catalog] ──> [3. Select Variant (Black / L)] ──> [4. Add to Bag]
       │
       ▼
[5. Apply Promo LONDON10] ──> [6. Complete Checkout] ──> [7. Open Demo Admin (/demo-admin)]
       │
       ▼
[8. Find New Order] ──> [9. Mark "Shipped" + Add Tracking] ──> [10. Verify Customer Account]
       │
       ▼
[11. Reset Demo Data in Settings]
```

> 📖 **Full Illustrated Walkthrough Guide**: For detailed screenshots, verification checks, and step-by-step notes, see [docs/walkthrough-guide.md](docs/walkthrough-guide.md).

---

## Technology Stack

```text
├── Headless Backend (@dtc/backend)
│   ├── Framework:        Medusa v2.19 (@medusajs/medusa, @medusajs/framework)
│   ├── Language:         TypeScript 5.3+ / Node.js 20+
│   ├── Database:         PostgreSQL 16 (MikroORM migrations)
│   ├── Cache & Bus:      Redis 7
│   ├── Admin UI:         @medusajs/dashboard (Native at /app)
│   └── Payments:         Stripe API Provider
│
├── Modern Storefront (@dtc/storefront)
│   ├── Framework:        Next.js 15.5 (App Router, Server Actions)
│   ├── UI Library:       React 19, Tailwind CSS 3.4
│   ├── Design System:    Medusa UI Preset (@medusajs/ui-preset), Radix UI, Headless UI
│   └── SDK:              @medusajs/js-sdk
│
├── Portfolio Demo Engine (@dtc/portfolio-demo)
│   ├── Export Mode:      Next.js 15 Static HTML Export (output: "export")
│   ├── Storage Engine:   Versioned HTML5 localStorage Repository (LB_PORTFOLIO_DEMO_STATE_V1)
│   ├── Reactivity:       React Context + Storage Event Cross-Tab Bus
│   └── Deployment:       100% Static CDN (GitHub Pages / Cloudflare / Vercel)
│
└── Tooling & Quality Assurance
    ├── Monorepo:         Turborepo 2.0+ & pnpm 10.11+
    ├── E2E Testing:      Playwright Test (Chromium, Firefox, WebKit, Mobile Chrome)
    ├── Code Quality:     ESLint (@medusajs/eslint-plugin recommended) & Prettier
    └── Container:        Docker Compose
```

---

## Local Development Instructions

### Prerequisites
- **Node.js**: `v20.19.0+` or `v22.12.0+`
- **pnpm**: `v10.11.1+`
- **PostgreSQL 16+ & Redis 7+** *(Only required for running the real Medusa backend)*

---

### Option A: Running the Browser Portfolio Demo *(Fastest — Zero Setup)*

The portfolio demo runs instantly with zero database or environment variable setup:

```bash
# 1. Clone repository
git clone https://github.com/AsifShawon/clothing-store-next-medusa.git
cd clothing-store-next-medusa

# 2. Install workspace dependencies
pnpm install

# 3. Start Portfolio Demo development server
pnpm run demo:dev
```
Open **`http://localhost:8080`** for the Storefront or **`http://localhost:8080/demo-admin`** for the Admin Dashboard.

To build and test the static export:
```bash
# Build static export into apps/portfolio-demo/out
pnpm run demo:build

# Run unit tests and Playwright E2E suite
pnpm run demo:test
pnpm --filter @dtc/portfolio-demo test:e2e
```

---

### Option B: Running the Real Medusa Production Stack

To run the complete enterprise Medusa backend alongside the connected Next.js storefront:

```bash
# 1. Configure backend environment
cd apps/backend
cp .env.template .env

# Set DATABASE_URL and REDIS_URL in .env
# Example: DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa_dtc

# 2. Run database migrations & create admin user
pnpm exec medusa db:migrate
pnpm exec medusa user -e admin@londonboy.co.uk -p supersecret

# 3. Start Medusa backend server
pnpm dev
# Backend runs at http://localhost:9000 (Admin dashboard at http://localhost:9000/app)
```

In a second terminal, configure and start the storefront:

```bash
# 4. Configure storefront environment
cd apps/storefront
cp .env.template .env.local

# Add your publishable key from Medusa Admin (Settings > Publishable API Keys):
# NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
# NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# 5. Start storefront server
pnpm dev
# Storefront runs at http://localhost:8000
```

---

## Demo Reset & Storage Management

The portfolio demonstration employs an isolated storage repository (`StorageRepository`) with built-in self-healing and versioning:

1. **State Key**: All custom state is keyed under `london-boy:portfolio-demo:v1`.
2. **One-Click UI Reset**: 
   - Navigate to `/demo-admin/settings/` and click **"Reset Demo Data"** (or click the permanent header reset trigger).
   - Enter confirmation to instantly flush custom orders and restore the default 6 garments and 38 variants.
3. **Manual Browser DevTools Reset**:
   ```javascript
   localStorage.removeItem("london-boy:portfolio-demo:v1");
   location.reload();
   ```
4. **Self-Healing Resilience**:
   - If corrupted JSON or an incompatible schema version is encountered, the repository automatically purges the corrupted payload and rehydrates the pristine seed catalog without crashing the application.
   - If `QuotaExceededError` occurs, older activity logs are trimmed automatically.

---

## Known Limitations

| Area | Portfolio Demo Behavior (`apps/portfolio-demo`) | Production Medusa Stack (`apps/backend`) |
| :--- | :--- | :--- |
| **Cross-Device Sync** | Local to current browser instance (does not sync to other devices). | Central PostgreSQL database with multi-device synchronization. |
| **Authentication** | Simulated role switching without cryptographic JWTs. | Secure Argon2/scrypt password hashing with session cookies. |
| **Payment Gateway** | Simulated authorization (immediate confirmation). | Live Stripe PCI-compliant card tokenization & 3D Secure. |
| **Media Assets** | Hosted via public CDN URLs (`images.unsplash.com`). | Private S3/Cloudflare R2 buckets with signed URLs. |
| **Emails** | Simulated on-screen receipts. | Live transactional email delivery via Resend or SendGrid. |

---

## Portfolio Case Study

### 1. Problem Statement
When showcasing an advanced headless e-commerce architecture in a public developer portfolio, developers face two major obstacles:
1. **Cloud Hosting Overhead**: Running persistent cloud PostgreSQL databases, Redis clusters, and Node.js backend instances costs \$30–\$50/month continuously.
2. **Public Demo Vandalism & Cold Starts**: Publicly accessible shared databases frequently get altered, corrupted, or filled with spam by visitors, while free-tier servers suffer 30-second cold-start delays that ruin recruiter impressions.

### 2. Architectural Decision
To solve this, I designed a **dual-track architecture within a single Turborepo monorepo**:
- Maintained a clean, production-ready **Medusa v2 backend and Next.js 15 storefront** for commercial deployment.
- Created a **deterministic, zero-backend static export replica** (`apps/portfolio-demo`) compiled to static HTML, JavaScript, and Tailwind CSS that deploys for free with **zero server costs and 100% uptime**.

### 3. Why `localStorage` was Selected for the Free Demo
- **Zero Cost & Infinite Uptime**: Runs entirely in the client browser with no servers to maintain or pay for.
- **Sub-Millisecond Response Times**: Zero network latency or cold starts; page transitions and cart operations are instantaneous.
- **Total Visitor Isolation**: Every visitor receives their own private sandbox. Visitors cannot see, modify, or corrupt each other's demo orders.
- **Offline & Low-Bandwidth Resilience**: Once loaded, the entire storefront and admin suite function without internet connectivity.

### 4. How Real Medusa Boundaries Were Preserved
The simulation strictly mirrors Medusa's architectural domain models:
- **Entity Schemas**: Products, variants, inventory items, line items, orders, and promotion codes mirror Medusa v2 types.
- **Workflow State Transitions**: Order fulfillment follows Medusa's exact status machines (`pending` $\to$ `shipped` $\to$ `delivered` $\to$ `canceled`).
- **Inventory Invariants**: Order placement decrements inventory; cancellations restore inventory exactly once; negative stock is strictly blocked.

### 5. Testing Strategy
- **Unit Testing**: 27 unit tests validating catalog integrity, promotion formulas (`LONDON10`), inventory decrement rules, schema migrations, and quota resilience.
- **End-to-End Browser Testing**: 64 automated Playwright test runs across **Chromium, Firefox, WebKit (Safari), and Mobile Chrome**, ensuring zero console errors, zero React hydration mismatches, zero forbidden external network calls, and responsive layouts across viewports.

### 6. What Would Change for Production
To transition the store to commercial production:
1. Switch deployment target from `apps/portfolio-demo` to `apps/backend` + `apps/storefront`.
2. Provision managed PostgreSQL 16 and Redis 7 instances.
3. Configure live Stripe API keys and register the webhook endpoint (`/store/stripe/hooks`).
4. Attach an S3-compatible cloud bucket (AWS S3 or Cloudflare R2) for product photography.
5. Enable Resend or SendGrid API keys for transactional order confirmation emails.
6. Deploy containerized services via Docker Compose behind a Caddy reverse proxy with automated SSL certificate renewal.

---

## Future Real-Production Deployment Path

For real-world deployment, the production stack is packaged with Docker Compose:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: medusa_dtc
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    environment:
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@postgres:5432/medusa_dtc
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      STRIPE_API_KEY: ${STRIPE_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  storefront:
    build:
      context: .
      dockerfile: apps/storefront/Dockerfile
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: https://api.londonboy.co.uk
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${MEDUSA_PUBLISHABLE_KEY}
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  pgdata:
```

### Production Infrastructure Checklist:
1. **Reverse Proxy & SSL**: Configure Caddy or Nginx with automatic Let's Encrypt certificates for `londonboy.co.uk` and `api.londonboy.co.uk`.
2. **Database Backups**: Automated daily PostgreSQL pg_dump backups to offsite cold storage.
3. **Continuous Integration**: GitHub Actions CI workflow executing Medusa module integration suites (`pnpm run test:integration:modules`) and storefront build verification.

---

## License

This project is licensed under the [MIT License](LICENSE).
