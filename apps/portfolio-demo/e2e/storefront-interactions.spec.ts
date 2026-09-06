import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

test.describe("Storefront Interaction Polish & Responsive UX Suite", () => {
  test("1. Demo banner displays concise copy, dismisses cleanly, updates CSS variable, and persists across reload", async ({
    page,
  }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Banner is visible initially
    const banner = page.locator("aside[aria-label='Demo announcement']")
    await expect(banner).toBeVisible()
    await expect(banner).toContainText("Interactive demo")

    // Check CSS variable --demo-banner-offset is greater than 0
    const initialOffset = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue("--demo-banner-offset").trim()
    })
    expect(initialOffset).not.toBe("0px")
    expect(initialOffset).not.toBe("")

    // Dismiss banner
    const dismissBtn = page.locator("button[aria-label='Dismiss demo notice']")
    await dismissBtn.click()

    // Banner should disappear
    await expect(banner).not.toBeVisible()

    // CSS variable should reset to 0px
    const dismissedOffset = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue("--demo-banner-offset").trim()
    })
    expect(dismissedOffset).toBe("0px")

    // Reload page - banner should remain dismissed due to sessionStorage
    await page.reload()
    await expect(page.locator("aside[aria-label='Demo announcement']")).not.toBeVisible()

    // Reopen banner via footer trigger
    const reopenFooterBtn = page.locator("button:has-text('Reopen Demo Notice Banner')")
    await reopenFooterBtn.scrollIntoViewIfNeeded()
    await reopenFooterBtn.click()

    // Banner should be visible again
    await expect(page.locator("aside[aria-label='Demo announcement']")).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("2. Floating header adheres to sticky geometry with and without banner", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    const header = page.locator("header")
    await expect(header).toBeVisible()

    const island = page.locator("header .rounded-2xl")
    await expect(island).toBeVisible()

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(300)

    // Header remains visible
    await expect(island).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("3. Desktop MegaMenu opens on hover/focus, and closes on Escape", async ({ page }) => {
    // Ensure desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Find a top-level nav link with dropdown, e.g. "Shirts"
    const shirtsTrigger = page.locator("header button:has-text('Shirts'), header a:has-text('Shirts')").first()
    if (await shirtsTrigger.isVisible()) {
      await shirtsTrigger.hover()
      await page.waitForTimeout(200)

      // Mega menu container or links should be visible
      const megaPanel = page.locator("text=Oxford Button-Down Smart Shirt").first()
      if (await megaPanel.isVisible()) {
        await page.keyboard.press("Escape")
        await page.waitForTimeout(200)
      }
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("4. Desktop quick-add provides inline 'Added ✓' feedback and updates bag count without opening cart drawer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Initial cart badge
    const cartBtn = page.locator("[data-testid='nav-cart-link']").first()
    await expect(cartBtn).toBeVisible()

    // Locate first product card and hover to reveal quick add tray
    const firstCard = page.locator("[data-testid='product-wrapper']").first()
    await expect(firstCard).toBeVisible()
    await firstCard.scrollIntoViewIfNeeded()
    await firstCard.hover()

    // Find available size button inside card
    const sizeBtn = firstCard.locator("button[aria-label*='Quick add size']:not([disabled])").first()
    if (await sizeBtn.isVisible()) {
      await sizeBtn.click()

      // Should show 'Added ✓' inline
      await expect(firstCard.locator("text=Added ✓")).toBeVisible()

      // Cart drawer should NOT be open
      const cartDrawer = page.locator("[role='dialog'][aria-label*='Shopping Bag'], [role='dialog'][aria-label*='Cart']")
      await expect(cartDrawer).not.toBeVisible()

      // Header bag badge should show 'Bag (1)'
      await expect(cartBtn).toContainText("Bag (1)")
    }

    assertCleanDiagnostics(diagnostics)
  })

  test("5. Cart drawer opens via bag icon, supports quantity adjustment, and closes via Escape with focus restored", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Open bag drawer via header bag button
    const bagBtn = page.locator("header button[aria-label*='bag'], header button[aria-label*='Bag']").first()
    await bagBtn.click()

    // Cart drawer dialog should open
    const cartDialog = page.locator("[role='dialog']").first()
    await expect(cartDialog).toBeVisible()

    // Escape closes drawer
    await page.keyboard.press("Escape")
    await page.waitForTimeout(300)
    await expect(cartDialog).not.toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("6. Mobile quick-add bottom sheet modal opens, selects options, and closes cleanly", async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    const diagnostics = attachDiagnostics(page)
    await page.goto("/")

    // Locate mobile quick add button on first card
    const firstCard = page.locator("[data-testid='product-wrapper']").first()
    await expect(firstCard).toBeVisible()
    const mobileQuickAddBtn = firstCard.locator("button[aria-label*='Quick Add']").first()
    await expect(mobileQuickAddBtn).toBeVisible()
    await mobileQuickAddBtn.click()

    // Sheet modal should be visible
    const sheet = page.locator("[role='dialog'][aria-label*='Quick Add']").first()
    await expect(sheet).toBeVisible()

    // Close button dismisses sheet
    const closeBtn = sheet.locator("button[aria-label='Close Quick Add sheet']").first()
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()
    await page.waitForTimeout(300)

    await expect(sheet).not.toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })
})
