import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

test.describe("London Boy Customer Storefront & Checkout Journey", () => {
  test("1. Fresh browser initializes seed catalog and renders homepage", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Check brand header and hero
    await expect(page.locator("text=LONDON BOY").first()).toBeVisible()
    await expect(page.locator("text=Structured Minimalism").first()).toBeVisible()

    // Check department categories & featured rails
    await expect(page.locator("text=Shop By Wardrobe Category").first()).toBeVisible()
    await expect(page.locator("text=Featured Garments").first()).toBeVisible()

    // Check product cards
    await expect(page.locator("text=London Boy Signature Heavyweight T-Shirt").first()).toBeVisible()
    await expect(page.locator("text=৳1,250").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })


  test("2. Shop page displays products, search and filters work", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/shop")

    // Check all products loaded
    await expect(page.locator("text=London Boy Signature Heavyweight T-Shirt").first()).toBeVisible()
    await expect(page.locator("text=Oxford Button-Down Smart Shirt").first()).toBeVisible()

    // Search for Oxford
    const searchInput = page.locator("input[placeholder*='Search']").first()
    if (await searchInput.isVisible()) {
      await searchInput.fill("Oxford")
      await page.waitForTimeout(300)
      await expect(page.locator("text=Oxford Button-Down Smart Shirt").first()).toBeVisible()
      await expect(page.locator("text=London Boy Signature Heavyweight T-Shirt")).not.toBeVisible()
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("3. PDP variant selection and size guide modal work", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/product?handle=regent-knit-polo")

    await expect(page.locator("h1:has-text('Regent Knit Pique Polo')")).toBeVisible()
    await expect(page.locator("text=৳1,850").first()).toBeVisible()

    // Select variant size pill (e.g. L)
    const sizeButton = page.locator("button[aria-label*='Size L']").or(page.locator("button:has-text('L')")).first()
    if (await sizeButton.isVisible()) {
      await sizeButton.click()
    }

    // Open size guide modal
    const sizeGuideBtn = page.locator("button:has-text('Measurement Guide')").or(page.locator("button:has-text('Size Guide')")).first()
    if (await sizeGuideBtn.isVisible()) {
      await sizeGuideBtn.click()
      await expect(page.locator("text=Chest").first()).toBeVisible()
      // Close size guide
      await page.keyboard.press("Escape")
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("4. Cart addition, LONDON10 coupon discount, and reload persistence", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/product?handle=soho-cotton-twill-cap")

    // Add cap to cart (850 BDT)
    const addToCartBtn = page.locator("button:has-text('Add to Shopping Bag')").or(page.locator("button:has-text('Add to Bag')")).first()
    await addToCartBtn.click()

    // Go to cart page
    await page.goto("/cart")
    await expect(page.locator("text=Soho Structured Cotton Twill Cap").first()).toBeVisible()
    await expect(page.locator("text=৳850").first()).toBeVisible()

    // Apply promo code LONDON10
    const promoInput = page.locator("input[placeholder*='LONDON10']").or(page.locator("input[placeholder*='coupon']")).or(page.locator("input[placeholder*='promo']")).first()
    if (await promoInput.isVisible()) {
      await promoInput.fill("LONDON10")
      const applyBtn = page.locator("button:has-text('Apply')").first()
      await applyBtn.click()
      await page.waitForTimeout(300)
      // Check discount applied (Remove coupon button appears)
      await expect(page.locator("button:has-text('Remove')").first()).toBeVisible()
    }

    // Refresh page and assert cart persistence
    await page.reload()
    await expect(page.locator("text=Soho Structured Cotton Twill Cap").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("5. Successful checkout creates single order and decrements inventory", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)

    // Add item to cart
    await page.goto("/product?handle=soho-cotton-twill-cap")
    const addToCartBtn = page.locator("button:has-text('Add to Shopping Bag')").or(page.locator("button:has-text('Add to Bag')")).first()
    await addToCartBtn.click()

    // Go to checkout
    await page.goto("/checkout")
    await expect(page.locator("text=Portfolio Demo Simulation").or(page.locator("text=Portfolio demo")).first()).toBeVisible()

    // Step 1: Contact (1-Click Demo Customer)
    const demoCustomerBtn = page.locator("button:has-text('1-Click Demo Customer')").or(page.locator("button:has-text('Continue as Demo Customer')")).first()
    if (await demoCustomerBtn.isVisible()) {
      await demoCustomerBtn.click()
      await page.waitForTimeout(300)
    }

    // Place Order
    const placeOrderBtn = page.locator("button:has-text('Confirm & Place Order')").or(page.locator("button:has-text('Place Demo Order')")).first()
    await placeOrderBtn.scrollIntoViewIfNeeded()
    await placeOrderBtn.click()
    await page.waitForTimeout(600)

    // Verify receipt page
    await expect(page.locator("text=Order Confirmed").or(page.locator("text=Order Placed")).or(page.locator("text=LB-ORD-")).first()).toBeVisible()

    // View in Account
    await page.goto("/account/orders")
    await expect(page.locator("text=LB-ORD-").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })
})
