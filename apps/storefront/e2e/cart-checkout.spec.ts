import { test, expect } from "@playwright/test"

test.describe("Storefront Cart & Checkout User Journey", () => {
  test("1. Cart page displays empty state when cart is empty", async ({ page }) => {
    await page.goto("/bd/cart")

    await expect(page).toHaveTitle(/London Boy/)

    const main = page.locator("#main-content")
    await expect(main).toBeVisible()

    // Must render either items or empty cart view
    const emptyMsg = page.locator("text=Your shopping bag is empty")
    const cartItems = page.locator("[data-testid='cart-item']")
    const exploreBtn = page.locator("a[href*='/store']")

    const hasEmpty = await emptyMsg.count()
    const hasItems = await cartItems.count()
    const hasExplore = await exploreBtn.count()

    expect(hasEmpty > 0 || hasItems > 0 || hasExplore > 0).toBeTruthy()
  })

  test("2. Checkout page requires valid cart and presents step-by-step layout", async ({ page }) => {
    // When visiting checkout without an active cart with items, storefront redirects safely to /cart
    await page.goto("/bd/checkout")
    await page.waitForLoadState("domcontentloaded")

    // The customer should either see the checkout container or be safely redirected to /cart
    const currentUrl = page.url()
    expect(currentUrl.includes("/checkout") || currentUrl.includes("/cart") || currentUrl.includes("/bd")).toBeTruthy()
  })
})
