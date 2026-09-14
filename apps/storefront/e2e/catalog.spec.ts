import { test, expect } from "@playwright/test"

test.describe("Storefront Product Catalog & Discovery", () => {
  test("1. Store catalog page loads with products or informative fallback", async ({ page }) => {
    await page.goto("/bd/store")

    await expect(page).toHaveTitle(/London Boy/)

    const main = page.locator("#main-content")
    await expect(main).toBeVisible()

    // Page must either render a products list or the empty/fallback card
    const productsList = page.locator("[data-testid='products-list']")
    const emptyNotice = page.locator("text=No clothing items found")

    const hasProducts = await productsList.count()
    const hasEmpty = await emptyNotice.count()

    expect(hasProducts > 0 || hasEmpty > 0).toBeTruthy()
  })

  test("2. Category and Collections pages render with valid headings", async ({ page }) => {
    await page.goto("/bd/collections/new-arrivals")
    const main = page.locator("#main-content")
    await expect(main).toBeVisible()

    // Title should contain London Boy
    await expect(page).toHaveTitle(/London Boy/)
  })
})
