import { test, expect } from "@playwright/test"
import { attachDiagnostics, assertCleanDiagnostics } from "./test-helpers"

test.describe("London Boy Storage Resilience, Multi-Tab Sync & Concurrency", () => {
  test("1. Corrupted localStorage auto-recovers gracefully", async ({ page }) => {
    const diagnostics = attachDiagnostics(page)

    // Navigate to initialize
    await page.goto("/")

    // Inject corrupted JSON into localStorage
    await page.evaluate(() => {
      window.localStorage.setItem("london-boy:portfolio-demo:v1", "{bad_json:true,,,invalid")
    })

    // Reload page
    await page.reload()

    // Page must still render cleanly without crashing
    await expect(page.locator("text=LONDON BOY").first()).toBeVisible()
    await expect(page.locator("text=London Boy Signature Heavyweight T-Shirt").first()).toBeVisible()

    assertCleanDiagnostics(diagnostics)
  })

  test("2. Cross-tab real-time storage synchronization", async ({ context }) => {
    // Open Tab 1 and Tab 2
    const page1 = await context.newPage()
    const page2 = await context.newPage()

    const diag1 = attachDiagnostics(page1)
    const diag2 = attachDiagnostics(page2)

    await page1.goto("/")
    await page2.goto("/")

    // Add item to cart in Tab 1
    await page1.goto("/product?handle=soho-cotton-twill-cap")
    const addBtn = page1.locator("button:has-text('Add to Shopping Bag')").or(page1.locator("button:has-text('Add to Bag')")).first()
    await addBtn.click()
    await page1.waitForTimeout(500)

    // Verify Tab 2 cart reflects the addition
    await page2.goto("/cart")
    await expect(page2.locator("text=Soho Structured Cotton Twill Cap").first()).toBeVisible()

    assertCleanDiagnostics(diag1)
    assertCleanDiagnostics(diag2)

    await page1.close()
    await page2.close()
  })

  test("3. Incognito / isolated browser contexts receive distinct sessions", async ({ browser }) => {
    // Context A
    const contextA = await browser.newContext()
    const pageA = await contextA.newPage()
    await pageA.goto("/product?handle=soho-cotton-twill-cap")
    const addBtn = pageA.locator("button:has-text('Add to Shopping Bag')").or(pageA.locator("button:has-text('Add to Bag')")).first()
    await addBtn.click()
    await pageA.waitForTimeout(400)

    // Context B (isolated)
    const contextB = await browser.newContext()
    const pageB = await contextB.newPage()
    await pageB.goto("/cart")

    // Context B cart must be empty
    await expect(pageB.locator("text=Your shopping bag is empty").or(pageB.locator("text=0 items")).first()).toBeVisible()

    await contextA.close()
    await contextB.close()
  })
})
