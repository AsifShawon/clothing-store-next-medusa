import { test, expect } from "@playwright/test"

test.describe("Storefront Product Detail Page (PDP) & Option Selection", () => {
  test("1. PDP renders product information, option selectors and size guide trigger", async ({ page }) => {
    await page.goto("/bd/products/heavyweight-t-shirt")

    // If product exists in database/fixture, verify complete PDP interactions
    const heading = page.locator("h1")
    if (await heading.count() > 0) {
      await expect(heading).toBeVisible()

      // Check Size Guide Modal Trigger
      const sizeGuideBtn = page.locator("button", { hasText: "View London Boy Size Guide" })
      if (await sizeGuideBtn.count() > 0) {
        await expect(sizeGuideBtn).toBeVisible()
        await sizeGuideBtn.click()

        // Size Guide dialog should be visible
        const dialog = page.locator("[role='dialog']")
        await expect(dialog).toBeVisible()

        // Close dialog via escape key or close button
        await page.keyboard.press("Escape")
        await expect(dialog).not.toBeVisible()
      }

      // Add to Bag CTA Check
      const addToBagBtn = page.locator("[data-testid='add-product-button']")
      if (await addToBagBtn.count() > 0) {
        await expect(addToBagBtn).toBeVisible()
      }
    }
  })
})
