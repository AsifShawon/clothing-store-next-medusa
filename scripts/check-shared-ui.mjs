import fs from "fs"
import path from "path"

console.log("🔍 Checking shared customer-facing UI consumption across apps...")

const REQUIRED_STOREFRONT_CONSUMPTIONS = [
  { file: "apps/storefront/src/app/[countryCode]/(main)/page.tsx", required: ["HomeView"] },
  { file: "apps/storefront/src/modules/store/components/catalog-client/index.tsx", required: ["CatalogView"] },
  { file: "apps/storefront/src/modules/categories/components/category-client/index.tsx", required: ["CategoryView"] },
  { file: "apps/storefront/src/modules/collections/components/collection-client/index.tsx", required: ["CollectionView"] },
  { file: "apps/storefront/src/modules/products/components/product-detail-client/index.tsx", required: ["ProductDetailView"] },
  { file: "apps/storefront/src/modules/cart/components/cart-client/index.tsx", required: ["CartView"] },
  { file: "apps/storefront/src/modules/checkout/components/checkout-client/index.tsx", required: ["CheckoutView"] },
  { file: "apps/storefront/src/modules/order/components/order-completed-client/index.tsx", required: ["OrderConfirmationView"] },
  { file: "apps/storefront/src/modules/account/components/account-layout-client/index.tsx", required: ["AccountShell"] },
  { file: "apps/storefront/src/modules/account/components/overview-client/index.tsx", required: ["AccountOverview"] },
  { file: "apps/storefront/src/modules/account/components/orders-client/index.tsx", required: ["AccountOrders"] },
  { file: "apps/storefront/src/modules/account/components/profile-client/index.tsx", required: ["AccountProfile"] },
  { file: "apps/storefront/src/modules/account/components/addresses-client/index.tsx", required: ["AccountAddresses"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/about/page.tsx", required: ["AboutView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/contact/page.tsx", required: ["ContactView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/faq/page.tsx", required: ["FaqView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/size-guide/page.tsx", required: ["SizeGuideView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/shipping-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/return-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/privacy-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/terms-and-conditions/page.tsx", required: ["PolicyView"] },
]

const REQUIRED_DEMO_CONSUMPTIONS = [
  { file: "apps/portfolio-demo/src/app/page.tsx", required: ["HomeView"] },
  { file: "apps/portfolio-demo/src/app/shop/page.tsx", required: ["CatalogView"] },
  { file: "apps/portfolio-demo/src/app/category/page.tsx", required: ["CategoryView"] },
  { file: "apps/portfolio-demo/src/app/collection/page.tsx", required: ["CollectionView"] },
  { file: "apps/portfolio-demo/src/app/product/page.tsx", required: ["ProductDetailView"] },
  { file: "apps/portfolio-demo/src/app/cart/page.tsx", required: ["CartView"] },
  { file: "apps/portfolio-demo/src/app/checkout/page.tsx", required: ["CheckoutView"] },
  { file: "apps/portfolio-demo/src/app/order/page.tsx", required: ["OrderConfirmationView"] },
  { file: "apps/portfolio-demo/src/app/about/page.tsx", required: ["AboutView"] },
  { file: "apps/portfolio-demo/src/app/contact/page.tsx", required: ["ContactView"] },
  { file: "apps/portfolio-demo/src/app/faq/page.tsx", required: ["FaqView"] },
  { file: "apps/portfolio-demo/src/app/size-guide/page.tsx", required: ["SizeGuideView"] },
  { file: "apps/portfolio-demo/src/app/shipping-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/portfolio-demo/src/app/return-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/portfolio-demo/src/app/privacy-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/portfolio-demo/src/app/terms-and-conditions/page.tsx", required: ["PolicyView"] },
]

let missingCount = 0

function verifyConsumptions(list, appName) {
  for (const item of list) {
    const fullPath = path.resolve(process.cwd(), item.file)
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ [${appName}] Missing required file: ${item.file}`)
      missingCount++
      continue
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    for (const comp of item.required) {
      if (!content.includes(comp)) {
        console.error(`❌ [${appName}] ${item.file} does NOT consume shared component <${comp}>`)
        missingCount++
      }
    }
  }
}

verifyConsumptions(REQUIRED_STOREFRONT_CONSUMPTIONS, "Storefront")
verifyConsumptions(REQUIRED_DEMO_CONSUMPTIONS, "Portfolio-Demo")

if (missingCount > 0) {
  console.error(`🚨 Shared UI verification FAILED with ${missingCount} missing consumption(s).`)
  process.exit(1)
} else {
  console.log("✅ Shared UI verification PASSED: Both Storefront and Portfolio Demo fully consume @dtc/storefront-ui.")
  process.exit(0)
}
