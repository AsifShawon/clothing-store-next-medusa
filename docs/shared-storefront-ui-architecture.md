# Shared Storefront UI & Commerce Contracts Architecture

## 1. Executive Summary

This repository enforces a strict **single customer-facing storefront UI implementation** shared across disparate commerce providers:
1. **Production System (`apps/storefront`)**: Full-stack Next.js 15 App Router connected to the official **Medusa v2 backend** (`apps/backend`), PostgreSQL 16, Redis 7, live Stripe Elements, and native Medusa Admin at `/app`.
2. **Portfolio Demonstration (`apps/portfolio-demo`)**: 100% client-side Next.js 15 static export (`output: "export"`) running strictly on versioned browser `localStorage` (`london-boy:portfolio-demo:v1`), simulated payment modes, and custom Demo Admin at `/demo-admin`.
3. **Future Systems**: Any future database-backed Next.js commerce implementation can reuse the exact same customer UI components and views by implementing the contracts in `packages/commerce-contracts`.

---

## 2. Monorepo Package Topology

```text
                               ┌────────────────────────┐
                               │ packages/             │
                               │ commerce-contracts     │
                               │ (Domain View Models)   │
                               └───────────▲────────────┘
                                           │
                               ┌───────────┴────────────┐
                               │ packages/             │
                               │ storefront-ui          │
                               │ (Shared Views & Theme) │
                               └─────▲────────────▲─────┘
                                     │            │
            ┌────────────────────────┴─┐        ┌─┴────────────────────────┐
            │ apps/storefront          │        │ apps/portfolio-demo      │
            │ (Medusa v2 Headless SSR) │        │ (Static HTML LocalStorage│
            │ Adapter: adapters/medusa │        │ Adapter: adapters/local  │
            └────────────┬─────────────┘        └──────────────────────────┘
                         │
            ┌────────────▼─────────────┐
            │ apps/backend             │
            │ (Medusa v2 Engine)       │
            └──────────────────────────┘
```

---

## 3. Strict Boundary Rules & Zero-Leakage Policy

`packages/commerce-contracts` and `packages/storefront-ui` are completely isolated from all commerce runtimes. They **must never** import or reference:
- `@medusajs/*` (no SDKs, types, or modules)
- `@lib/data/*` (no storefront server actions)
- `server-only`
- `localStorage` or `window.localStorage`
- `DemoStoreContext`, `StorageRepository`, or demo state
- Stripe SDKs (`@stripe/*`)
- Backend environment variables (`MEDUSA_*`, `DATABASE_URL`, `REDIS_URL`, etc.)

Boundary compliance is verified by `scripts/check-package-boundaries.mjs` and the root command:
```bash
pnpm run check:boundaries
```

---

## 4. Architectural Separation: Controllers vs Views

Route files in each application act as **Controllers**:
1. **Load data** from the provider (Medusa server fetch or LocalStorage hook).
2. **Transform** provider data into shared contracts (`ProductView`, `CartView`, `CheckoutView`, `CustomerView`, `OrderView`).
3. **Provide action callbacks** conforming to feature interfaces (`CartActions`, `CheckoutActions`, `CustomerActions`).
4. **Render** the shared view from `@dtc/storefront-ui/views`, supplying capabilities and optional slots.

### Example Controller Pattern
```tsx
// apps/storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx
import { ProductDetailView } from "@dtc/storefront-ui/views"
import { toProductView } from "@/adapters/medusa/catalog"
import { listProducts } from "@lib/data/products"

export default async function ProductPage({ params }) {
  const { handle, countryCode } = await params
  const { response } = await listProducts({ countryCode, queryParams: { handle } })
  const productView = toProductView(response.products[0])

  return (
    <ProductDetailView
      product={productView}
      routes={medusaRoutes(countryCode)}
      capabilities={medusaCapabilities}
    />
  )
}
```

---

## 5. Slot Architecture for Intentional Differences

Intentional demonstration features (such as Demo Admin links, reset demo data modals, simulated payment choices, and security notices) are injected via **slots** without branching shared UI code:

| Slot Name | Medusa Storefront Behavior | Portfolio Demo Behavior |
| :--- | :--- | :--- |
| `demoNoticeSlot` | Null / unrendered | `<CheckoutNotice />` / Demo Banner |
| `headerActionsSlot` | Currency badge (`🇧🇩 BDT (৳)`) | "Demo Admin" badge button |
| `footerControlsSlot`| Currency badge | "Reset Demo Data" modal trigger |
| `paymentSlot` | Real Stripe Elements / Manual payment | Simulated COD, Demo Card & Mobile Wallets |
| `authNoticeSlot` | Standard password reset link | 1-Click "Continue as Demo Customer" button |
| `orderActionsSlot` | Continue Shopping link | "Inspect in Demo Admin" button |

---

## 6. Guide for Future Commerce Implementations

To connect a future full-stack commerce engine (e.g. Next.js with Prisma / Drizzle / PostgreSQL):
1. Create `apps/future-storefront` in Turborepo.
2. Add workspace dependencies on `@dtc/commerce-contracts` and `@dtc/storefront-ui`.
3. Create `src/adapters/db/` to map database queries to `ProductView`, `CartView`, etc.
4. Implement `CartActions`, `CheckoutActions`, and `CustomerActions` using server actions or API routes.
5. Define `StoreRoutes` for the application's URL schema.
6. Render shared views from `@dtc/storefront-ui/views`. Zero customer-facing UI needs to be re-authored or copied.
