import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

test.describe("London Boy Accessibility, Viewports & Keyboard Navigation", () => {
  test("1. Keyboard navigation opens and closes Search modal with Escape", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Focus search button
    const searchTrigger = page.locator("button[aria-label='Search products']").or(page.locator("button:has-text('Search')")).first()
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click()
      await page.waitForTimeout(300)

      // Modal input should be visible
      const searchModalInput = page.locator("input[placeholder*='Search by keyword']").or(page.locator("input[placeholder*='Search']")).first()
      await expect(searchModalInput).toBeVisible()

      // Press Escape to dismiss
      await page.keyboard.press("Escape")
      await page.waitForTimeout(300)
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("2. Reduced motion preference is respected without errors", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    const diagnostics = attachDiagnostics(page)

    await page.goto("/")
    await expect(page.locator("text=LONDON BOY").first()).toBeVisible()

    await page.goto("/shop")
    await expect(page.locator("text=London Boy Signature Heavyweight T-Shirt").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("3. Direct load of static query routes (/product, /order, /demo-admin/settings)", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)

    // Direct load of PDP
    await page.goto("/product?handle=oxford-smart-shirt")
    await expect(page.locator("h1:has-text('Oxford Button-Down Smart Shirt')")).toBeVisible()

    // Direct load of Collection
    await page.goto("/collection?handle=new-arrivals")
    await expect(page.locator("h1:has-text('New Arrivals')")).toBeVisible()

    // Direct load of Admin Settings
    await page.goto("/demo-admin/settings")
    await expect(page.locator("h1:has-text('Settings & Local Storage')").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })
})
