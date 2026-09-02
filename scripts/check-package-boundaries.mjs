import fs from "fs"
import path from "path"

const FORBIDDEN_PATTERNS = [
  { name: "@medusajs/*", regex: /['"]@medusajs\// },
  { name: "@lib/data/*", regex: /['"]@lib\/data\// },
  { name: "server-only", regex: /['"]server-only['"]/ },
  { name: "window.localStorage", regex: /\bwindow\.localStorage\b/ },
  { name: "localStorage", regex: /\blocalStorage\b/ },
  { name: "DemoStoreContext", regex: /\bDemoStoreContext\b|\buseDemoStore\b|\buseDemoCart\b|\buseDemoProduct\b|\buseDemoCustomer\b|\buseDemoOrders\b/ },
  { name: "StorageRepository", regex: /\bStorageRepository\b/ },
  { name: "Stripe SDK", regex: /['"]@stripe\/|\bStripeWrapper\b/ },
  { name: "backend environment variables", regex: /process\.env\.(?:MEDUSA_|DATABASE_URL|REDIS_URL|JWT_SECRET|COOKIE_SECRET)/ },
]

const PACKAGES_TO_SCAN = [
  path.resolve(process.cwd(), "packages/commerce-contracts/src"),
  path.resolve(process.cwd(), "packages/storefront-ui/src"),
]

let violationsCount = 0

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      scanDirectory(fullPath)
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8")
      const lines = content.split("\n")

      lines.forEach((line, index) => {
        // Skip comment-only lines explaining rules if any
        if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
          return
        }

        for (const rule of FORBIDDEN_PATTERNS) {
          if (rule.regex.test(line)) {
            console.error(
              `❌ Boundary violation [${rule.name}]:\n  File: ${fullPath}:${index + 1}\n  Content: ${line.trim()}\n`
            )
            violationsCount++
          }
        }
      })
    }
  }
}

console.log("🔍 Scanning shared packages for forbidden provider-specific imports...")
for (const pkgDir of PACKAGES_TO_SCAN) {
  scanDirectory(pkgDir)
}

if (violationsCount > 0) {
  console.error(`🚨 Boundary check FAILED with ${violationsCount} violation(s).`)
  process.exit(1)
} else {
  console.log("✅ Boundary check PASSED: Zero forbidden provider-specific dependencies in shared packages.")
  process.exit(0)
}
