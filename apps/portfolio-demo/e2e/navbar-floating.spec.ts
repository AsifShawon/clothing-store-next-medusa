import { test, expect } from "@playwright/test"

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812, isMobile: true },
  { name: "mobile-390", width: 390, height: 844, isMobile: true },
  { name: "tablet-768", width: 768, height: 1024, isMobile: false },
  { name: "tablet-landscape-1024", width: 1024, height: 768, isMobile: false },
  { name: "desktop-1280", width: 1280, height: 800, isMobile: false },
  { name: "desktop-1440", width: 1440, height: 900, isMobile: false },
  { name: "desktop-1920", width: 1920, height: 1080, isMobile: false },
]

test.describe("Portfolio Demo Floating Compact Navbar Suite", () => {
  test("1. Desktop: Header starts expanded at page top and transforms into compact floating navbar on scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")

    const header = page.locator("header")
    await expect(header).toBeVisible()

    // Page top: Announcement bar is visible and header is expanded
    const announcement = page.locator("text=Complimentary Dhaka Express Delivery").first()
    await expect(announcement).toBeVisible()
    await expect(header).toHaveAttribute("data-compact", "false")

    // Brand logo & subtitle present in expanded state
    await expect(header.locator("a[data-testid='nav-store-link']").locator("visible=true").first()).toBeVisible()
    await expect(header.locator("text=EST. LONDON • DHAKA").locator("visible=true").first()).toBeVisible()

    // Desktop categories visible
    const categoryNav = page.locator("nav[aria-label='Main category navigation']")
    await expect(categoryNav.first()).toBeVisible()
    await expect(categoryNav.locator("text=New & Trending").first()).toBeVisible()
    await expect(categoryNav.locator("text=Shirts").first()).toBeVisible()

    // Actions visible
    await expect(header.locator("button[aria-label='Search catalog']").first()).toBeVisible()
    await expect(header.locator("[data-testid='nav-account-link']").first()).toBeVisible()
    await expect(header.locator("[data-testid='nav-cart-link']").first()).toBeVisible()
    await expect(header.locator("a[href*='/demo-admin']").first()).toBeVisible()

    // Capture screenshot: A. page top — desktop
    await page.screenshot({ path: "test-results/screenshots/demo-page-top-desktop.png" })

    // Scroll down 400px
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(400)

    // Verify compact state activated
    await expect(header).toHaveAttribute("data-compact", "true")
    await expect(header).toBeVisible()

    // In compact floating state, navbar stays fixed near the top
    const headerBox = await header.boundingBox()
    expect(headerBox).not.toBeNull()
    expect(headerBox!.y).toBeLessThan(30)
    expect(headerBox!.height).toBeLessThanOrEqual(75)

    // Capture screenshot: B. scrolled compact header — desktop
    await page.screenshot({ path: "test-results/screenshots/demo-scrolled-compact-header-desktop.png" })

    // Scroll further down over product cards
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(300)
    await expect(header).toHaveAttribute("data-compact", "true")
    await page.screenshot({ path: "test-results/screenshots/demo-compact-header-product-cards.png" })

    // Scroll back to page top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)

    // Header returns to expanded state
    await expect(header).toHaveAttribute("data-compact", "false")
    await expect(announcement).toBeVisible()
  })

  test("2. Shopping actions and navigation links remain interactive in compact mode", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")

    const header = page.locator("header")
    await expect(header).toBeVisible()
    await expect(header).toHaveAttribute("data-compact", "false")

    // Scroll to activate compact mode
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(400)

    await expect(header).toHaveAttribute("data-compact", "true")

    // Logo links home
    const homeLink = header.locator("[data-testid='nav-store-link']").first()
    await expect(homeLink).toBeVisible()

    // Category navigation links work
    const shirtsLink = header.locator("a", { hasText: "Shirts" }).first()
    await expect(shirtsLink).toBeVisible()

    // Search opens modal
    const searchBtn = header.locator("button[aria-label='Search catalog']").first()
    await searchBtn.click()
    const searchModal = page.locator("role=dialog").or(page.locator("[placeholder*='Search']")).first()
    await expect(searchModal).toBeVisible()

    // Close search
    await page.keyboard.press("Escape")

    // Demo Admin button exists in header
    const demoAdminBtn = header.locator("a[href*='/demo-admin']").first()
    await expect(demoAdminBtn).toBeVisible()

    // Bag trigger opens cart drawer
    const cartBtn = header.locator("[data-testid='nav-cart-link']").first()
    await expect(cartBtn).toBeVisible()
    await cartBtn.click()
    const cartDrawer = page.locator("text=Shopping Bag").or(page.locator("text=Your Cart")).or(page.locator("[aria-label*='Cart']")).first()
    await expect(cartDrawer).toBeVisible()
  })

  test("3. Mobile: Dedicated compact arrangement with accessible touch targets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")

    const header = page.locator("header")
    await expect(header).toBeVisible()
    await expect(header).toHaveAttribute("data-compact", "false")

    // Screenshot: F. mobile top
    await page.screenshot({ path: "test-results/screenshots/demo-mobile-top.png" })

    // Scroll down to activate compact mobile navbar
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(400)

    await expect(header).toHaveAttribute("data-compact", "true")

    // Verify touch targets >= 40x40
    const menuBtn = page.locator("button[aria-label='Open navigation menu'], [aria-label*='menu']").first()
    if (await menuBtn.isVisible()) {
      const menuBox = await menuBtn.boundingBox()
      expect(menuBox!.width).toBeGreaterThanOrEqual(40)
      expect(menuBox!.height).toBeGreaterThanOrEqual(40)
    }

    const searchBtn = header.locator("button[aria-label='Search catalog']").first()
    const searchBox = await searchBtn.boundingBox()
    expect(searchBox!.width).toBeGreaterThanOrEqual(40)
    expect(searchBox!.height).toBeGreaterThanOrEqual(40)

    // Screenshot: G. mobile scrolled
    await page.screenshot({ path: "test-results/screenshots/demo-mobile-scrolled.png" })
  })

  test("4. Multi-viewport responsive verification (no wrapping or layout breaks)", async ({
    page,
  }) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto("/")

      const header = page.locator("header")
      await expect(header).toBeVisible()

      // Scroll to compact
      await page.evaluate(() => window.scrollTo(0, 400))
      await page.waitForTimeout(250)

      await expect(header).toHaveAttribute("data-compact", "true")

      // Header height must remain compact (<= 75px)
      const box = await header.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.height).toBeLessThanOrEqual(75)

      // On desktop viewports (>= 1024), categories must remain on a single line
      if (vp.width >= 1024) {
        const catNav = header.locator("nav[aria-label='Main category navigation']")
        if (await catNav.isVisible()) {
          const navBox = await catNav.boundingBox()
          expect(navBox!.height).toBeLessThanOrEqual(65)
        }
      }
    }
  })

  test("5. Slow, incremental scroll triggers compact navbar deterministically without failure", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")

    const header = page.locator("header")
    await expect(header).toBeVisible()
    await expect(header).toHaveAttribute("data-compact", "false")

    // Simulate slow, continuous mouse wheel / trackpad scroll in small 2-3px increments
    for (let i = 0; i < 70; i++) {
      await page.evaluate(() => window.scrollBy(0, 3))
      await page.waitForTimeout(16)
    }

    // Must deterministically enter compact state
    await expect(header).toHaveAttribute("data-compact", "true")
    await expect(header).toBeVisible()

    // Scroll back slowly in small increments to page top
    for (let i = 0; i < 70; i++) {
      await page.evaluate(() => window.scrollBy(0, -3))
      await page.waitForTimeout(16)
    }

    // Must return to expanded state
    await expect(header).toHaveAttribute("data-compact", "false")
  })
})
