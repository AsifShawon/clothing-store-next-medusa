import fs from "fs"
import path from "path"
import { createRequire } from "module"

function getTypeScript() {
  const searchPaths = [
    path.resolve(process.cwd(), "apps/backend/package.json"),
    path.resolve(process.cwd(), "apps/storefront/package.json"),
    path.resolve(process.cwd(), "apps/portfolio-demo/package.json"),
    path.resolve(process.cwd(), "packages/storefront-ui/package.json"),
  ]
  for (const p of searchPaths) {
    try {
      const req = createRequire(p)
      return req("typescript")
    } catch {
      // try next
    }
  }
  throw new Error("Could not resolve 'typescript' from workspace packages.")
}

const ts = getTypeScript()


export const REQUIRED_STOREFRONT_CONSUMPTIONS = [
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
  { file: "apps/storefront/src/modules/account/templates/login-template.tsx", required: ["AuthShell", "LoginForm", "RegisterForm", "ForgotPasswordForm"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/account/reset-password/page.tsx", required: ["AuthShell", "ResetPasswordForm"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/about/page.tsx", required: ["AboutView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/contact/page.tsx", required: ["ContactView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/faq/page.tsx", required: ["FaqView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/size-guide/page.tsx", required: ["SizeGuideView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/shipping-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/return-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/privacy-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/storefront/src/app/[countryCode]/(main)/terms-and-conditions/page.tsx", required: ["PolicyView"] },
]

export const REQUIRED_DEMO_CONSUMPTIONS = [
  { file: "apps/portfolio-demo/src/app/page.tsx", required: ["HomeView"] },
  { file: "apps/portfolio-demo/src/app/shop/page.tsx", required: ["CatalogView"] },
  { file: "apps/portfolio-demo/src/app/category/page.tsx", required: ["CategoryView"] },
  { file: "apps/portfolio-demo/src/app/collection/page.tsx", required: ["CollectionView"] },
  { file: "apps/portfolio-demo/src/app/product/page.tsx", required: ["ProductDetailView"] },
  { file: "apps/portfolio-demo/src/app/cart/page.tsx", required: ["CartView"] },
  { file: "apps/portfolio-demo/src/app/checkout/page.tsx", required: ["CheckoutView"] },
  { file: "apps/portfolio-demo/src/app/order/page.tsx", required: ["OrderConfirmationView"] },
  { file: "apps/portfolio-demo/src/app/account/page.tsx", required: ["AccountShell", "AccountOverview", "AccountProfile", "AccountAddresses", "AuthShell"] },
  { file: "apps/portfolio-demo/src/app/account/orders/page.tsx", required: ["AccountShell", "AccountOrders", "AuthShell"] },
  { file: "apps/portfolio-demo/src/app/about/page.tsx", required: ["AboutView"] },
  { file: "apps/portfolio-demo/src/app/contact/page.tsx", required: ["ContactView"] },
  { file: "apps/portfolio-demo/src/app/faq/page.tsx", required: ["FaqView"] },
  { file: "apps/portfolio-demo/src/app/size-guide/page.tsx", required: ["SizeGuideView"] },
  { file: "apps/portfolio-demo/src/app/shipping-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/portfolio-demo/src/app/return-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/portfolio-demo/src/app/privacy-policy/page.tsx", required: ["PolicyView"] },
  { file: "apps/portfolio-demo/src/app/terms-and-conditions/page.tsx", required: ["PolicyView"] },
]

export function analyzeAstForSharedUI(filePath, sourceCode) {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )

  const importedFromSharedUI = new Map() // importedSymbol -> localName
  const importedFromElsewhere = new Map() // importedSymbol -> moduleSpecifier
  const jsxTagNames = new Set()

  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier.text
      const namedBindings = node.importClause?.namedBindings

      if (namedBindings && ts.isNamedImports(namedBindings)) {
        for (const spec of namedBindings.elements) {
          const importedName = spec.propertyName ? spec.propertyName.text : spec.name.text
          const localName = spec.name.text

          if (moduleSpecifier === "@dtc/storefront-ui") {
            importedFromSharedUI.set(importedName, localName)
          } else {
            importedFromElsewhere.set(importedName, moduleSpecifier)
          }
        }
      }
    }

    if (ts.isJsxElement(node)) {
      const tagName = node.openingElement.tagName.getText(sourceFile)
      jsxTagNames.add(tagName)
    } else if (ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText(sourceFile)
      jsxTagNames.add(tagName)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return {
    importedFromSharedUI,
    importedFromElsewhere,
    jsxTagNames,
  }
}

export function verifyFileConsumption(filePath, requiredSymbols, sourceCodeOverride) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
  if (!sourceCodeOverride && !fs.existsSync(fullPath)) {
    return {
      success: false,
      errors: [`File does not exist: ${filePath}`],
    }
  }

  const content = sourceCodeOverride ?? fs.readFileSync(fullPath, "utf-8")
  const { importedFromSharedUI, importedFromElsewhere, jsxTagNames } = analyzeAstForSharedUI(fullPath, content)

  const errors = []

  for (const sym of requiredSymbols) {
    if (!importedFromSharedUI.has(sym)) {
      if (importedFromElsewhere.has(sym)) {
        errors.push(
          `Component '${sym}' is imported from '${importedFromElsewhere.get(sym)}', NOT from '@dtc/storefront-ui'`
        )
      } else {
        errors.push(`Component '${sym}' is not imported from '@dtc/storefront-ui'`)
      }
      continue
    }

    const localIdentifier = importedFromSharedUI.get(sym)
    if (!jsxTagNames.has(localIdentifier)) {
      errors.push(
        `Component '${sym}' (alias '${localIdentifier}') is imported from '@dtc/storefront-ui' but is NOT instantiated as a JSX Element <${localIdentifier} ... />`
      )
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}

export function runAllChecks() {
  console.log("🔍 Checking shared customer-facing UI AST consumption across apps...")
  let failureCount = 0

  function auditList(list, label) {
    for (const item of list) {
      const result = verifyFileConsumption(item.file, item.required)
      if (!result.success) {
        failureCount++
        console.error(`❌ [${label}] ${item.file}:`)
        for (const err of result.errors) {
          console.error(`     • ${err}`)
        }
      }
    }
  }

  auditList(REQUIRED_STOREFRONT_CONSUMPTIONS, "Storefront")
  auditList(REQUIRED_DEMO_CONSUMPTIONS, "Portfolio-Demo")

  if (failureCount > 0) {
    console.error(`🚨 Shared UI AST verification FAILED with ${failureCount} non-compliant file(s).`)
    return false
  } else {
    console.log("✅ Shared UI AST verification PASSED: Both applications prove genuine AST import & JSX usage of @dtc/storefront-ui.")
    return true
  }
}

// Execute when run directly
if (process.argv[1] && (process.argv[1].endsWith("check-shared-ui.mjs") || process.argv[1].includes("check-shared-ui"))) {
  const success = runAllChecks()
  process.exit(success ? 0 : 1)
}
