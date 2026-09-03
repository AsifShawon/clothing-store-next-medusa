import { test, describe } from "node:test"
import assert from "node:assert/strict"
import {
  verifyFileConsumption,
  analyzeAstForSharedUI,
} from "../check-shared-ui.mjs"
import {
  checkCodeLines,
  SHARED_PACKAGES_FORBIDDEN,
  DEMO_FORBIDDEN,
} from "../check-package-boundaries.mjs"

describe("Architecture Checker Robustness & Negative Fixtures Suite", () => {
  describe("1. Shared UI AST Checker Negative Tests", () => {
    test("A comment containing the component name must FAIL the check", () => {
      const source = `
        // This file mentions HomeView in comments
        /* <HomeView /> */
        export default function Page() {
          return <div>Custom Implementation</div>
        }
      `
      const result = verifyFileConsumption("virtual-page.tsx", ["HomeView"], source)
      assert.equal(result.success, false)
      assert.equal(
        result.errors.some((e: string) => e.includes("Component 'HomeView' is not imported from '@dtc/storefront-ui'")),
        true
      )
    })

    test("A string literal containing the component name must FAIL the check", () => {
      const source = `
        export default function Page() {
          const viewName = "HomeView"
          return <div data-view={viewName}>Custom Implementation</div>
        }
      `
      const result = verifyFileConsumption("virtual-page.tsx", ["HomeView"], source)
      assert.equal(result.success, false)
      assert.equal(
        result.errors.some((e: string) => e.includes("Component 'HomeView' is not imported from '@dtc/storefront-ui'")),
        true
      )
    })

    test("An unused import from @dtc/storefront-ui must FAIL the check (no JSX usage)", () => {
      const source = `
        import { HomeView } from "@dtc/storefront-ui"
        export default function Page() {
          return <div>Custom Home Content</div>
        }
      `
      const result = verifyFileConsumption("virtual-page.tsx", ["HomeView"], source)
      assert.equal(result.success, false)
      assert.equal(
        result.errors.some((e: string) =>
          e.includes("Component 'HomeView' (alias 'HomeView') is imported from '@dtc/storefront-ui' but is NOT instantiated as a JSX Element")
        ),
        true
      )
    })

    test("Importing a same-named local component must FAIL the check", () => {
      const source = `
        import { HomeView } from "./local-components/HomeView"
        export default function Page() {
          return <HomeView />
        }
      `
      const result = verifyFileConsumption("virtual-page.tsx", ["HomeView"], source)
      assert.equal(result.success, false)
      assert.equal(
        result.errors.some((e: string) =>
          e.includes("Component 'HomeView' is imported from './local-components/HomeView', NOT from '@dtc/storefront-ui'")
        ),
        true
      )
    })

    test("A genuine import and JSX element from @dtc/storefront-ui must PASS", () => {
      const source = `
        import { HomeView } from "@dtc/storefront-ui"
        export default function Page() {
          return <HomeView title="Welcome" />
        }
      `
      const result = verifyFileConsumption("virtual-page.tsx", ["HomeView"], source)
      assert.equal(result.success, true)
      assert.equal(result.errors.length, 0)
    })

    test("An aliased import from @dtc/storefront-ui used in JSX must PASS", () => {
      const source = `
        import { HomeView as CanonicalHome } from "@dtc/storefront-ui"
        export default function Page() {
          return <CanonicalHome />
        }
      `
      const result = verifyFileConsumption("virtual-page.tsx", ["HomeView"], source)
      assert.equal(result.success, true)
      assert.equal(result.errors.length, 0)
    })
  })

  describe("2. Package Boundary Checker Negative Tests", () => {
    test("Detects prohibited @medusajs import in shared package code", () => {
      const code = `import { HttpTypes } from "@medusajs/types"`
      const violations = checkCodeLines(code, SHARED_PACKAGES_FORBIDDEN)
      assert.equal(violations.length >= 1, true)
      assert.equal(violations[0].rule, "@medusajs/*")
    })

    test("Detects prohibited next/navigation router hook in shared package code", () => {
      const code = `import { useRouter } from "next/navigation"`
      const violations = checkCodeLines(code, SHARED_PACKAGES_FORBIDDEN)
      assert.equal(violations.length >= 1, true)
      assert.equal(violations[0].rule, "next/navigation hooks")
    })

    test("Detects prohibited localStorage access in shared package code", () => {
      const code = `const token = localStorage.getItem("auth_token")`
      const violations = checkCodeLines(code, SHARED_PACKAGES_FORBIDDEN)
      assert.equal(violations.length >= 1, true)
      assert.equal(violations[0].rule, "localStorage")
    })

    test("Detects prohibited fetch() network call in portfolio demo", () => {
      const code = `const res = await fetch("https://api.example.com/products")`
      const violations = checkCodeLines(code, DEMO_FORBIDDEN)
      assert.equal(violations.length >= 1, true)
      assert.equal(violations[0].rule, "network access (fetch)")
    })

    test("Does NOT flag commented lines in code", () => {
      const code = `// import { HttpTypes } from "@medusajs/types"`
      const violations = checkCodeLines(code, SHARED_PACKAGES_FORBIDDEN)
      assert.equal(violations.length, 0)
    })
  })
})
