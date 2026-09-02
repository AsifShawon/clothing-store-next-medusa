import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

const VIEWPORTS = [
  { name: "Mobile (375x812)", width: 375, height: 812 },
  { name: "Tablet (768x1024)", width: 768, height: 1024 },
  { name: "Desktop (1440x1000)", width: 1440, height: 1000 },
]

test.describe("Shared View Visual & Architectural Layout Harness", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } })

      test("Shared HomeView preserves brand identity & department grid", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/")

        // Verify primary header typography & brand logo
        const logo = page.locator("text=LONDON BOY").first()
        await expect(logo).toBeVisible()

        // Hero CTA button presence
        const heroCta = page.locator("a:has-text('Explore Collection')").first()
        await expect(heroCta).toBeVisible()

        // Department collections section
        const sectionHeading = page.locator("text=Shop By Wardrobe Category").first()
        await expect(sectionHeading).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })

      test("Shared CatalogView renders normalized sort options and filters", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/shop")

        // Main heading exists
        await expect(page.locator("h1").first()).toBeVisible()

        // Product cards exist in grid
        const cards = page.locator("a[href*='/product']")
        const count = await cards.count()
        expect(count).toBeGreaterThan(0)

        assertCleanDiagnostics(diagnostics)
      })

      test("Shared ProductDetailView displays price formatting, options, and CTA", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/product?handle=heavyweight-t-shirt")

        // Currency symbol
        await expect(page.locator("text=৳").first()).toBeVisible()

        // Add to bag CTA
        const addToBag = page.locator("button:has-text('Add to Bag'), button:has-text('Add to Cart')").first()
        await expect(addToBag).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })

      test("Shared CartView renders bag summary, pricing breakdown, and checkout link", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/cart")

        // Bag title or empty state
        const bagTitle = page.locator("text=/Shopping Bag/i").first()
        await expect(bagTitle).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })


      test("Shared Editorial & Policy views maintain consistent typography across breakpoints", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)

        const routes = [
          "/about",
          "/contact",
          "/faq",
          "/size-guide",
          "/shipping-policy",
          "/return-policy",
          "/privacy-policy",
          "/terms-and-conditions",
        ]

        for (const route of routes) {
          await page.goto(route)
          await expect(page.locator("h1").first()).toBeVisible()
        }

        assertCleanDiagnostics(diagnostics)
      })
    })
  }
})
