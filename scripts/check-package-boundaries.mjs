import fs from "fs"
import path from "path"

export const SHARED_PACKAGES_FORBIDDEN = [
  { name: "@medusajs/*", regex: /['"]@medusajs\// },
  { name: "@lib/data/*", regex: /['"]@lib\/data\// },
  { name: "server-only", regex: /['"]server-only['"]/ },
  { name: "window.localStorage", regex: /\bwindow\.localStorage\b/ },
  { name: "localStorage", regex: /\blocalStorage\b/ },
  { name: "next/navigation hooks", regex: /['"]next\/navigation['"]|\buseRouter\b|\busePathname\b|\buseSearchParams\b/ },
  { name: "DemoStoreContext", regex: /\bDemoStoreContext\b|\buseDemoStore\b|\buseDemoCart\b|\buseDemoProduct\b|\buseDemoCustomer\b|\buseDemoOrders\b/ },
  { name: "StorageRepository", regex: /\bStorageRepository\b/ },
  { name: "Stripe SDK", regex: /['"]@stripe\/|\bStripeWrapper\b/ },
  { name: "backend environment variables", regex: /process\.env\.(?:MEDUSA_|DATABASE_URL|REDIS_URL|JWT_SECRET|COOKIE_SECRET)/ },
  { name: "cross-app imports", regex: /['"](?:\.\.\/)+apps\// },
]

export const DEMO_FORBIDDEN = [
  { name: "@medusajs backend SDKs", regex: /['"]@medusajs\/(?:js-sdk|medusa|types|framework)/ },
  { name: "network access (fetch)", regex: /\bfetch\s*\(/ },
  { name: "storefront app imports", regex: /['"](?:\.\.\/)+storefront\// },
  { name: "backend app imports", regex: /['"](?:\.\.\/)+backend\// },
]

export const STOREFRONT_FORBIDDEN = [
  { name: "portfolio-demo app imports", regex: /['"](?:\.\.\/)+portfolio-demo\// },
  { name: "backend app imports", regex: /['"](?:\.\.\/)+backend\// },
]

export function checkCodeLines(content, rules) {
  const violations = []
  const lines = content.split("\n")

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return
    }

    for (const rule of rules) {
      if (rule.regex.test(line)) {
        violations.push({
          rule: rule.name,
          line: index + 1,
          content: trimmed,
        })
      }
    }
  })

  return violations
}

export function scanDirectory(dirPath, rules, label) {
  let violations = []
  if (!fs.existsSync(dirPath)) {
    return violations
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist") {
        continue
      }
      violations = violations.concat(scanDirectory(fullPath, rules, label))
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs|cjs)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8")
      const fileViolations = checkCodeLines(content, rules)
      for (const v of fileViolations) {
        console.error(
          `❌ [${label}] Boundary violation [${v.rule}]:\n  File: ${fullPath}:${v.line}\n  Content: ${v.content}\n`
        )
      }
      violations = violations.concat(fileViolations.map((v) => ({ ...v, file: fullPath })))
    }
  }

  return violations
}

export function runBoundaryChecks() {
  console.log("🔍 Scanning monorepo architecture boundaries...")
  let totalViolations = 0

  // 1. Shared packages must remain pure & decoupled
  const contractsViolations = scanDirectory(
    path.resolve(process.cwd(), "packages/commerce-contracts/src"),
    SHARED_PACKAGES_FORBIDDEN,
    "commerce-contracts"
  )
  const storefrontUiViolations = scanDirectory(
    path.resolve(process.cwd(), "packages/storefront-ui/src"),
    SHARED_PACKAGES_FORBIDDEN,
    "storefront-ui"
  )
  totalViolations += contractsViolations.length + storefrontUiViolations.length

  // 2. Demo must remain pure static export without Medusa, network calls, or Storefront imports
  const demoViolations = scanDirectory(
    path.resolve(process.cwd(), "apps/portfolio-demo/src"),
    DEMO_FORBIDDEN,
    "portfolio-demo"
  )
  totalViolations += demoViolations.length

  // Ensure no server API routes exist in portfolio-demo
  const demoApiDir = path.resolve(process.cwd(), "apps/portfolio-demo/src/app/api")
  if (fs.existsSync(demoApiDir)) {
    console.error(
      "❌ [portfolio-demo] Prohibited server API directory detected: apps/portfolio-demo/src/app/api. Portfolio demo must remain purely client-side static export."
    )
    totalViolations++
  }

  // 3. Storefront must not leak into demo or backend internal directories
  const storefrontViolations = scanDirectory(
    path.resolve(process.cwd(), "apps/storefront/src"),
    STOREFRONT_FORBIDDEN,
    "storefront"
  )
  totalViolations += storefrontViolations.length

  if (totalViolations > 0) {
    console.error(`🚨 Boundary check FAILED with ${totalViolations} violation(s).`)
    return false
  } else {
    console.log("✅ Boundary check PASSED: Monorepo boundaries strictly respected.")
    return true
  }
}

// Execute when run directly
if (
  process.argv[1] &&
  (process.argv[1].endsWith("check-package-boundaries.mjs") ||
    process.argv[1].includes("check-package-boundaries"))
) {
  const success = runBoundaryChecks()
  process.exit(success ? 0 : 1)
}
