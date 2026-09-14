import { test, expect } from "@playwright/test"

test.describe("Storefront Accessibility & Keyboard Navigation Smoke Tests", () => {
  test("1. Skip-to-content link becomes focused and visible on first Tab key press", async ({ page }) => {
    await page.goto("/bd")

    // Press Tab from initial page load
    await page.keyboard.press("Tab")

    const skipLink = page.locator("a[href='#main-content']")
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()

    // Press Enter to skip
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/.*#main-content/)
  })

  test("2. Semantic HTML landmarks exist on all core pages", async ({ page }) => {
    await page.goto("/bd")

    // Must have exactly one <main id="main-content">
    const main = page.locator("main#main-content")
    await expect(main).toHaveCount(1)

    // Must have <nav>
    const nav = page.locator("nav")
    expect(await nav.count()).toBeGreaterThanOrEqual(1)

    // Must have <footer>
    const footer = page.locator("footer")
    await expect(footer).toHaveCount(1)
  })

  test("3. Color swatches and option selectors have accessible roles and labels", async ({ page }) => {
    await page.goto("/bd/products/heavyweight-t-shirt")

    const radiogroups = page.locator("[role='radiogroup']")
    const count = await radiogroups.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const group = radiogroups.nth(i)
        await expect(group).toHaveAttribute("aria-label", /.+/)

        // Radios inside must have role radio and aria-label
        const radios = group.locator("[role='radio']")
        const radioCount = await radios.count()
        expect(radioCount).toBeGreaterThan(0)
        for (let j = 0; j < radioCount; j++) {
          await expect(radios.nth(j)).toHaveAttribute("aria-label", /.+/)
        }
      }
    }
  })
})
