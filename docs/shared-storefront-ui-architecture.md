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
            │ Presets: @dtc/storefront │        │ Presets: @dtc/storefront │
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
- Cross-app internal imports (`../../apps/storefront`, `../../apps/portfolio-demo`)

Boundary compliance is verified by the automated verification suite:
```bash
pnpm run check:architecture
pnpm run check:boundaries
pnpm run check:shared-ui
```

---

## 4. Customer Experience Consumption Matrix

Both the Medusa v2 Storefront and the Portfolio Demo consume the identical shared canonical views from `@dtc/storefront-ui`:

| Customer Experience | Shared Canonical View | Medusa Storefront Consumer | Portfolio Demo Consumer |
| :--- | :--- | :--- | :--- |
| **Homepage** | `HomeView` | `src/app/[countryCode]/(main)/page.tsx` | `src/app/page.tsx` |
| **Catalog / Store** | `CatalogView` | `modules/store/components/catalog-client` | `src/app/shop/page.tsx` |
| **Category View** | `CategoryView` | `modules/categories/components/category-client` | `src/app/category/page.tsx` |
| **Collection View** | `CollectionView` | `modules/collections/components/collection-client`| `src/app/collection/page.tsx` |
| **Product Detail** | `ProductDetailView` | `modules/products/components/product-detail-client` | `src/app/product/page.tsx` |
| **Cart View** | `CartView` | `modules/cart/components/cart-client` | `src/app/cart/page.tsx` |
| **Checkout Flow** | `CheckoutView` | `modules/checkout/components/checkout-client` | `src/app/checkout/page.tsx` |
| **Order Completed**| `OrderConfirmationView` | `modules/order/components/order-completed-client` | `src/app/order/page.tsx` |
| **Account Shell** | `AccountShell` | `modules/account/components/account-layout-client` | `src/app/account/page.tsx` |
| **Account Overview** | `AccountOverview` | `modules/account/components/overview-client` | `src/app/account/page.tsx` |
| **Account Orders** | `AccountOrders` | `modules/account/components/orders-client` | `src/app/account/orders/page.tsx` |
| **Account Profile**| `AccountProfile` | `modules/account/components/profile-client` | `src/app/account/page.tsx` |
| **Account Addresses**| `AccountAddresses` | `modules/account/components/addresses-client` | `src/app/account/page.tsx` |
| **About Us** | `AboutView` | `src/app/[countryCode]/(main)/about/page.tsx` | `src/app/about/page.tsx` |
| **Contact Atelier**| `ContactView` | `src/app/[countryCode]/(main)/contact/page.tsx` | `src/app/contact/page.tsx` |
| **FAQ** | `FaqView` | `src/app/[countryCode]/(main)/faq/page.tsx` | `src/app/faq/page.tsx` |
| **Size & Fit Guide**| `SizeGuideView` | `src/app/[countryCode]/(main)/size-guide/page.tsx` | `src/app/size-guide/page.tsx` |
| **Shipping Policy**| `PolicyView` | `src/app/[countryCode]/(main)/shipping-policy/page.tsx` | `src/app/shipping-policy/page.tsx`|
| **Return Policy** | `PolicyView` | `src/app/[countryCode]/(main)/return-policy/page.tsx` | `src/app/return-policy/page.tsx` |
| **Privacy Policy** | `PolicyView` | `src/app/[countryCode]/(main)/privacy-policy/page.tsx` | `src/app/privacy-policy/page.tsx` |
| **Terms & Conditions**| `PolicyView` | `src/app/[countryCode]/(main)/terms-and-conditions/page.tsx` | `src/app/terms-and-conditions/page.tsx` |

---

## 5. Single Source of Truth Theme

The design tokens and styles are defined canonically in `packages/storefront-ui`:
1. **Tailwind Preset**: `packages/storefront-ui/tailwind.preset.js` is exported as `@dtc/storefront-ui/tailwind.preset`.
   - Both `apps/storefront/tailwind.config.js` and `apps/portfolio-demo/tailwind.config.js` include it in their `presets` array.
   - Eliminates duplicate color palettes (`brand`, `grey`), font families (`display`, `heading`, `sans`), responsive screens, border radiuses, and keyframe animations.
2. **Canonical Stylesheet**: `packages/storefront-ui/src/styles/storefront.css` contains all base layers, typography utility classes (`text-small-semi`, `text-base-regular`), button variants (`contrast-btn`), and layout containers (`content-container`).
   - Both apps import `@dtc/storefront-ui/styles/storefront.css` into their root `globals.css`.

---

## 6. Verification & Quality Gates

Run the verification commands from the monorepo root:
```bash
# Architecture & boundary validation
pnpm run check:architecture

# Type check across all packages and apps
pnpm run type-check

# Portfolio demo storage, checkout & admin unit test suite
pnpm run demo:test

# Static export build for Portfolio Demo
pnpm run demo:build

# Next.js production build for Storefront
pnpm run --filter @dtc/storefront build
```
