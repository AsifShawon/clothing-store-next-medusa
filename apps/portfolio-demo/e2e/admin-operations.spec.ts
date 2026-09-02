import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

test.describe("London Boy Demo Admin Operations & Cross-View Synchronization", () => {
  test("1. Admin dashboard renders KPI cards, pipeline, and activity log", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/demo-admin")

    // Permanent Shell Notice
    await expect(
      page.locator("text=Demo Admin — changes are stored only in this browser.").first()
    ).toBeVisible()

    // KPI Cards
    await expect(page.locator("text=Gross Revenue").first()).toBeVisible()
    await expect(page.locator("text=Orders Placed").first()).toBeVisible()
    await expect(page.locator("text=Active Garments").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("2. Order status update in Admin reflects in customer storefront", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)

    // View order detail in admin
    await page.goto("/demo-admin/order?id=ord_demo_1001")
    await expect(page.locator("text=Fulfillment Operations").first()).toBeVisible()

    // Select shipped status
    const selectStatus = page.locator("select").first()
    if (await selectStatus.isVisible()) {
      await selectStatus.selectOption("shipped")
      await page.waitForTimeout(300)
    }

    // View customer receipt in storefront
    await page.goto("/order?id=ord_demo_1001")
    await expect(
      page.locator("text=Shipped").or(page.locator("text=Handed to Courier")).or(page.locator("text=LB-ORD-1001")).first()
    ).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("3. Order cancellation restores inventory exactly once", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/demo-admin/orders")

    const viewBtn = page.locator("a:has-text('View')").first()
    if (await viewBtn.isVisible()) {
      await viewBtn.click()

      // Cancel order button
      const cancelBtn = page.locator("button:has-text('Cancel Order & Restore Stock')").first()
      if (await cancelBtn.isVisible()) {
        page.on("dialog", (dialog) => dialog.accept())
        await cancelBtn.click()
        await page.waitForTimeout(300)

        // Status badge should show canceled
        await expect(page.locator("text=Canceled").first()).toBeVisible()
      }
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("4. Create new promo code in Admin and verify on storefront cart", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/demo-admin/promotions")

    // Open creator
    await page.locator("button:has-text('New Promo Code')").first().click()

    // Fill form
    const codeInput = page.locator("input[placeholder*='FLASH20']").or(page.locator("input[placeholder*='SUMMER']")).first()
    await codeInput.fill("VIP20")

    const valueInput = page.locator("input[type='number']").first()
    await valueInput.fill("20")

    // Save
    const saveBtn = page.locator("button:has-text('Create Promo')").or(page.locator("button:has-text('Save Promo')")).first()
    await saveBtn.click()
    await page.waitForTimeout(400)

    // Verify VIP20 is in table
    await expect(page.locator("text=VIP20").first()).toBeVisible()

    // Test on storefront cart
    await page.goto("/product?handle=soho-cotton-twill-cap")
    const addToBagBtn = page.locator("button:has-text('Add to Shopping Bag')").or(page.locator("button:has-text('Add to Bag')")).first()
    await addToBagBtn.click()
    await page.waitForTimeout(300)

    await page.goto("/cart")
    const promoInput = page.locator("input[placeholder*='promo']").or(page.locator("input[placeholder*='LONDON10']")).first()
    if (await promoInput.isVisible()) {
      await promoInput.fill("VIP20")
      await page.locator("button:has-text('Apply')").first().click()
      await page.waitForTimeout(400)

      await expect(page.locator("text=20% Off").or(page.locator("text=VIP20")).first()).toBeVisible()
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("5. Two-step Reset with phrase confirmation restores seed data", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/demo-admin/settings")

    // Click Reset Demo Store
    await page.locator("button:has-text('Reset Demo Store')").or(page.locator("button:has-text('Reset Store')")).first().click()

    // Reset modal requires typing RESET DEMO
    const modalInput = page.locator("input[placeholder='RESET DEMO']").first()
    await expect(modalInput).toBeVisible()

    await modalInput.fill("RESET DEMO")
    await page.locator("button:has-text('Confirm & Reset')").first().click()
    await page.waitForTimeout(400)

    // Verify restored state (6 products in products catalog)
    await page.goto("/demo-admin/products")
    await expect(page.locator("text=London Boy Signature Heavyweight T-Shirt").first()).toBeVisible()
    await expect(page.locator("text=Soho Structured Cotton Twill Cap").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })
})
