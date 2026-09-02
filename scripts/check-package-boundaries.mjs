import fs from "fs"
import path from "path"

const SHARED_PACKAGES_FORBIDDEN = [
  { name: "@medusajs/*", regex: /['"]@medusajs\// },
  { name: "@lib/data/*", regex: /['"]@lib\/data\// },
  { name: "server-only", regex: /['"]server-only['"]/ },
  { name: "window.localStorage", regex: /\bwindow\.localStorage\b/ },
  { name: "localStorage", regex: /\blocalStorage\b/ },
  { name: "DemoStoreContext", regex: /\bDemoStoreContext\b|\buseDemoStore\b|\buseDemoCart\b|\buseDemoProduct\b|\buseDemoCustomer\b|\buseDemoOrders\b/ },
  { name: "StorageRepository", regex: /\bStorageRepository\b/ },
  { name: "Stripe SDK", regex: /['"]@stripe\/|\bStripeWrapper\b/ },
  { name: "backend environment variables", regex: /process\.env\.(?:MEDUSA_|DATABASE_URL|REDIS_URL|JWT_SECRET|COOKIE_SECRET)/ },
  { name: "cross-app imports", regex: /['"](?:\.\.\/)+apps\// },
]

const DEMO_FORBIDDEN = [
  { name: "@medusajs backend SDKs", regex: /['"]@medusajs\/(?:js-sdk|medusa|types|framework)/ },
  { name: "storefront app imports", regex: /['"](?:\.\.\/)+storefront\// },
  { name: "backend app imports", regex: /['"](?:\.\.\/)+backend\// },
]

const STOREFRONT_FORBIDDEN = [
  { name: "portfolio-demo app imports", regex: /['"](?:\.\.\/)+portfolio-demo\// },
  { name: "backend app imports", regex: /['"](?:\.\.\/)+backend\// },
]

let violationsCount = 0

function scanDirectory(dirPath, rules, label) {
  if (!fs.existsSync(dirPath)) {
    return
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist") {
        continue
      }
      scanDirectory(fullPath, rules, label)
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs|cjs)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8")
      const lines = content.split("\n")

      lines.forEach((line, index) => {
        if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
          return
        }

        for (const rule of rules) {
          if (rule.regex.test(line)) {
            console.error(
              `❌ [${label}] Boundary violation [${rule.name}]:\n  File: ${fullPath}:${index + 1}\n  Content: ${line.trim()}\n`
            )
            violationsCount++
          }
        }
      })
    }
  }
}

console.log("🔍 Scanning monorepo architecture boundaries...")

// 1. Shared packages must remain pure & decoupled
scanDirectory(path.resolve(process.cwd(), "packages/commerce-contracts/src"), SHARED_PACKAGES_FORBIDDEN, "commerce-contracts")
scanDirectory(path.resolve(process.cwd(), "packages/storefront-ui/src"), SHARED_PACKAGES_FORBIDDEN, "storefront-ui")

// 2. Demo must remain pure static export without Medusa or Storefront imports
scanDirectory(path.resolve(process.cwd(), "apps/portfolio-demo/src"), DEMO_FORBIDDEN, "portfolio-demo")

// 3. Storefront must not leak into demo or backend internal directories
scanDirectory(path.resolve(process.cwd(), "apps/storefront/src"), STOREFRONT_FORBIDDEN, "storefront")

if (violationsCount > 0) {
  console.error(`🚨 Boundary check FAILED with ${violationsCount} violation(s).`)
  process.exit(1)
} else {
  console.log("✅ Boundary check PASSED: Monorepo boundaries strictly respected.")
  process.exit(0)
}
