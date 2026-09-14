import { test, expect } from "@playwright/test"

test.describe("Storefront Homepage & Brand Experience", () => {
  test("1. Homepage renders brand identity, meta tags and accessible skip link", async ({ page }) => {
    await page.goto("/bd")

    // Brand Title Check
    await expect(page).toHaveTitle(/London Boy/)

    // Accessible Skip Link Check
    const skipLink = page.locator("a[href='#main-content']")
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveText("Skip to main content")

    // Main Content Landmark Check
    const mainContent = page.locator("#main-content")
    await expect(mainContent).toBeVisible()

    // Hero Section Check
    const heroHeading = page.locator("h1")
    await expect(heroHeading).toContainText("Refined British Style")

    // Navigation Check
    const storeLink = page.locator("a", { hasText: "Shop New Arrivals" }).first()
    await expect(storeLink).toBeVisible()
  })

  test("2. Navigates to store catalog via hero CTA", async ({ page }) => {
    await page.goto("/bd")
    const catalogCta = page.locator("a[href*='/collections/new-arrivals']").first()
    await expect(catalogCta).toBeVisible()
    await catalogCta.click()

    await expect(page).toHaveURL(/.*\/collections\/new-arrivals/)
  })

  test("3. Footer displays legal policy links and dispatch provenance", async ({ page }) => {
    await page.goto("/bd")
    const footer = page.locator("footer")
    await expect(footer).toBeVisible()

    // Check key trust links
    await expect(footer.locator("a[href*='/privacy-policy']").first()).toBeVisible()
    await expect(footer.locator("a[href*='/terms-and-conditions']").first()).toBeVisible()
    await expect(footer.locator("a[href*='/return-policy']").first()).toBeVisible()
  })
})
