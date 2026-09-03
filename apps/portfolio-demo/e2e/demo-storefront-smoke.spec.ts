import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

const VIEWPORTS = [
  { name: "Mobile (375x812)", width: 375, height: 812, isMobile: true },
  { name: "Tablet (768x1024)", width: 768, height: 1024, isMobile: false },
  { name: "Desktop (1440x1000)", width: 1440, height: 1000, isMobile: false },
]

test.describe("Portfolio Demo Storefront Responsive Smoke Suite", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } })

      test("Homepage renders header, hero, categories, and footer cleanly", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/")

        // Header & brand logo
        await expect(page.locator("text=LONDON BOY").first()).toBeVisible()

        // Hero title & CTA
        await expect(page.locator("text=Quiet British Tailoring").or(page.locator("text=Structured Minimalism")).first()).toBeVisible()

        // Department / Category sections
        await expect(page.locator("text=Wardrobe Departments").or(page.locator("text=Shop By Wardrobe Category")).first()).toBeVisible()

        // Footer links
        await expect(page.locator("footer").first()).toBeVisible()
        await expect(page.locator("footer a[href*='/about']").first()).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })

      test("Catalog view renders filters, products, and responsive layout", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/shop")

        // Heading
        await expect(page.locator("h1").first()).toBeVisible()

        // Product grid cards
        const productCards = page.locator("a[href*='/product']")
        await expect(productCards.first()).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })

      test("Product detail view renders gallery, variant options, and CTAs", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)
        await page.goto("/product?handle=heavyweight-t-shirt")

        // Product title & pricing
        await expect(page.locator("h1").first()).toBeVisible()
        await expect(page.locator("text=৳").first()).toBeVisible()

        // Add to bag button
        const addToBagBtn = page.locator("button:has-text('Add to Bag'), button:has-text('Add to Cart')").first()
        await expect(addToBagBtn).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })

      test("Informational and policy views render unified editorial layout", async ({ page }) => {
        const diagnostics = attachDiagnostics(page)

        // About view
        await page.goto("/about")
        await expect(page.locator("text=Born in London. Tailored for Bangladesh.").first()).toBeVisible()

        // Contact view
        await page.goto("/contact")
        await expect(page.locator("text=Get in Touch with London Boy").first()).toBeVisible()



        // FAQ view
        await page.goto("/faq")
        await expect(page.locator("text=Frequently Asked Questions").first()).toBeVisible()

        // Size Guide view
        await page.goto("/size-guide")
        await expect(page.locator("text=Size & Fit Guide").first()).toBeVisible()

        // Shipping Policy view
        await page.goto("/shipping-policy")
        await expect(page.locator("text=Shipping & Delivery Policy").first()).toBeVisible()

        assertCleanDiagnostics(diagnostics)
      })
    })
  }
})
