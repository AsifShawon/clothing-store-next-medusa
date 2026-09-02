import { test, expect } from "@playwright/test"

const MEDUSA_URL = process.env.MEDUSA_STOREFRONT_URL || "http://localhost:8000"

test.describe("Medusa Storefront Smoke Suite", () => {
  test.beforeEach(async ({ request }) => {
    // Probe if Medusa storefront server is active before running smoke tests
    try {
      const probe = await request.get(MEDUSA_URL, { timeout: 2000 })
      if (!probe.ok()) {
        test.skip(true, `Medusa storefront at ${MEDUSA_URL} returned status ${probe.status()}. Skipping live smoke checks.`)
      }
    } catch {
      test.skip(true, `Medusa storefront server is not running at ${MEDUSA_URL}. Skipping live smoke checks.`)
    }
  })

  test("Medusa storefront renders homepage with shared components", async ({ page }) => {
    await page.goto(MEDUSA_URL)
    await expect(page.locator("text=LONDON BOY").first()).toBeVisible()
  })

  test("Medusa storefront catalog route renders shared CatalogView", async ({ page }) => {
    await page.goto(`${MEDUSA_URL}/bd/store`)
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("Medusa storefront customer account route renders shared AuthShell", async ({ page }) => {
    await page.goto(`${MEDUSA_URL}/bd/account`)
    await expect(page.locator("text=Customer Portal, text=Sign In").first()).toBeVisible()
  })
})
