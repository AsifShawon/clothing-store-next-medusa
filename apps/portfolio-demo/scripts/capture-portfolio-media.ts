import { chromium } from "@playwright/test"
import fs from "fs"
import path from "path"
import http from "http"

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
}

function createStaticServer(outDir: string): http.Server {
  return http.createServer((req, res) => {
    let reqPath = (req.url || "/").split("?")[0].split("#")[0]
    let filePath = path.join(outDir, reqPath)

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html")
    } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`
    } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, "index.html"))) {
      filePath = path.join(filePath, "index.html")
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const notFoundPath = path.join(outDir, "404.html")
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { "Content-Type": "text/html" })
        res.end(fs.readFileSync(notFoundPath))
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" })
        res.end("404 Not Found")
      }
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    })
    res.end(fs.readFileSync(filePath))
  })
}

async function runMediaCapture() {
  console.log("=== Starting London Boy Portfolio Media Capture ===")

  const outDir = path.resolve(__dirname, "../out")
  const screenshotsDir = path.resolve(__dirname, "../../../docs/assets/screenshots")
  const walkthroughDir = path.resolve(__dirname, "../../../docs/assets/walkthrough")

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true })
  }
  if (!fs.existsSync(walkthroughDir)) {
    fs.mkdirSync(walkthroughDir, { recursive: true })
  }

  // 1. Start local static server
  console.log(`Starting static server from: ${outDir}`)
  const server = createStaticServer(outDir)

  const PORT = 8099
  await new Promise<void>((resolve) => server.listen(PORT, resolve))
  const BASE_URL = `http://localhost:${PORT}`
  console.log(`Static server running at ${BASE_URL}`)

  const browser = await chromium.launch({ headless: true })

  try {
    // -------------------------------------------------------------
    // PART 1: 12 Portfolio UI Screenshots
    // -------------------------------------------------------------
    console.log("\n--- Capturing 12 Required Portfolio Screenshots ---")

    // Context for Desktop (1440x900)
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    })
    const desktopPage = await desktopContext.newPage()

    // 1. Homepage desktop
    console.log("1. Capturing Homepage Desktop...")
    await desktopPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "01-homepage-desktop.png"),
      fullPage: false,
    })

    // Context for Mobile (390x844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const mobilePage = await mobileContext.newPage()

    // 2. Homepage mobile
    console.log("2. Capturing Homepage Mobile...")
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await mobilePage.waitForTimeout(600)
    await mobilePage.screenshot({
      path: path.join(screenshotsDir, "02-homepage-mobile.png"),
      fullPage: false,
    })

    // 3. Shop with filters
    console.log("3. Capturing Shop with Filters...")
    await desktopPage.goto(`${BASE_URL}/shop/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "03-shop-filters.png"),
      fullPage: false,
    })

    // 4. Product variant selection
    console.log("4. Capturing Product Variant Selection...")
    await desktopPage.goto(`${BASE_URL}/product/?handle=heavyweight-t-shirt`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(500)
    const sizeL = desktopPage.locator("button:has-text('L')").first()
    if (await sizeL.isVisible()) {
      await sizeL.click()
    }
    await desktopPage.waitForTimeout(300)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "04-product-variant-selection.png"),
      fullPage: false,
    })

    // 5. Cart (add item and view cart)
    console.log("5. Capturing Cart...")
    const addToBag = desktopPage.locator("button:has-text('Add to Bag')").or(desktopPage.locator("button:has-text('Add to Shopping Bag')")).first()
    if (await addToBag.isVisible()) {
      await addToBag.click()
      await desktopPage.waitForTimeout(500)
    }
    await desktopPage.goto(`${BASE_URL}/cart/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "05-cart.png"),
      fullPage: false,
    })

    // 6. Checkout review (fill address and apply LONDON10)
    console.log("6. Capturing Checkout Review...")
    await desktopPage.goto(`${BASE_URL}/checkout/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)

    const emailInput = desktopPage.locator("input[type='email']").first()
    if (await emailInput.isVisible()) {
      await emailInput.fill("alexander@londonboy.co.uk")
    }
    const nameInput = desktopPage.locator("input[placeholder*='name' i], input[name*='name' i]").first()
    if (await nameInput.isVisible()) {
      await nameInput.fill("Alexander Wright")
    }
    const addressInput = desktopPage.locator("input[placeholder*='address' i], input[name*='address' i]").first()
    if (await addressInput.isVisible()) {
      await addressInput.fill("42 Regent Street, Suite 5B")
    }
    const cityInput = desktopPage.locator("input[placeholder*='city' i], input[name*='city' i]").first()
    if (await cityInput.isVisible()) {
      await cityInput.fill("London")
    }
    const postalInput = desktopPage.locator("input[placeholder*='postal' i], input[name*='postal' i], input[placeholder*='zip' i]").first()
    if (await postalInput.isVisible()) {
      await postalInput.fill("W1B 5RL")
    }

    const checkoutPromoInput = desktopPage.locator("input[placeholder*='promo' i], input[placeholder*='coupon' i], input[placeholder*='LONDON10' i]").first()
    if (await checkoutPromoInput.isVisible()) {
      await checkoutPromoInput.fill("LONDON10")
      const applyBtn = desktopPage.locator("button:has-text('Apply')").first()
      if (await applyBtn.isVisible()) {
        await applyBtn.click()
        await desktopPage.waitForTimeout(500)
      }
    }

    await desktopPage.waitForTimeout(500)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "06-checkout-review.png"),
      fullPage: false,
    })

    // 7. Order confirmation
    console.log("7. Capturing Order Confirmation...")
    const placeOrderBtn = desktopPage.locator("button:has-text('Place Order')").or(desktopPage.locator("button:has-text('Complete Order')")).first()
    if (await placeOrderBtn.isVisible()) {
      await placeOrderBtn.click()
      await desktopPage.waitForTimeout(1000)
    } else {
      await desktopPage.goto(`${BASE_URL}/order/?id=ord_demo_1001`, { waitUntil: "networkidle" })
    }
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "07-order-confirmation.png"),
      fullPage: false,
    })

    // 8. Customer order history
    console.log("8. Capturing Customer Order History...")
    await desktopPage.goto(`${BASE_URL}/account/orders/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "08-customer-order-history.png"),
      fullPage: false,
    })

    // 9. Demo Admin dashboard
    console.log("9. Capturing Demo Admin Dashboard...")
    await desktopPage.goto(`${BASE_URL}/demo-admin/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "09-demo-admin-dashboard.png"),
      fullPage: false,
    })

    // 10. Admin order detail
    console.log("10. Capturing Admin Order Detail...")
    await desktopPage.goto(`${BASE_URL}/demo-admin/order/?id=ord_demo_1001`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "10-admin-order-detail.png"),
      fullPage: false,
    })

    // 11. Admin product editing
    console.log("11. Capturing Admin Product Editing...")
    await desktopPage.goto(`${BASE_URL}/demo-admin/product/?id=prod_1`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({
      path: path.join(screenshotsDir, "11-admin-product-editing.png"),
      fullPage: false,
    })

    // 12. Admin mobile view
    console.log("12. Capturing Admin Mobile View...")
    await mobilePage.goto(`${BASE_URL}/demo-admin/`, { waitUntil: "networkidle" })
    await mobilePage.waitForTimeout(600)
    await mobilePage.screenshot({
      path: path.join(screenshotsDir, "12-admin-mobile-view.png"),
      fullPage: false,
    })

    // -------------------------------------------------------------
    // PART 2: 60-90s Walkthrough Sequence Frame Capture
    // -------------------------------------------------------------
    console.log("\n--- Capturing 60-90s Walkthrough Sequence ---")
    const walkContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      deviceScaleFactor: 2,
    })
    const walkPage = await walkContext.newPage()

    // Step 1: Open storefront
    console.log("Walkthrough Step 1: Open Storefront")
    await walkPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-01-open-storefront.png"),
      fullPage: false,
    })

    // Step 2: Browse catalog
    console.log("Walkthrough Step 2: Browse Catalog")
    await walkPage.goto(`${BASE_URL}/shop/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-02-browse-catalog.png"),
      fullPage: false,
    })

    // Step 3: Select size and color on PDP
    console.log("Walkthrough Step 3: Select Size and Color")
    await walkPage.goto(`${BASE_URL}/product/?handle=heavyweight-t-shirt`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    const walkSizeBtn = walkPage.locator("button:has-text('M')").first()
    if (await walkSizeBtn.isVisible()) {
      await walkSizeBtn.click()
    }
    await walkPage.waitForTimeout(300)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-03-select-variant.png"),
      fullPage: false,
    })

    // Step 4: Add to cart
    console.log("Walkthrough Step 4: Add to Cart")
    const walkAddBtn = walkPage.locator("button:has-text('Add to Bag')").or(walkPage.locator("button:has-text('Add to Shopping Bag')")).first()
    if (await walkAddBtn.isVisible()) {
      await walkAddBtn.click()
      await walkPage.waitForTimeout(500)
    }
    await walkPage.goto(`${BASE_URL}/cart/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-04-cart-contents.png"),
      fullPage: false,
    })

    // Step 5: Apply LONDON10
    console.log("Walkthrough Step 5: Apply Promo LONDON10")
    const promoBox = walkPage.locator("input[placeholder*='promo' i], input[placeholder*='coupon' i], input[placeholder*='LONDON10' i]").first()
    if (await promoBox.isVisible()) {
      await promoBox.fill("LONDON10")
      const applyBtn = walkPage.locator("button:has-text('Apply')").first()
      if (await applyBtn.isVisible()) {
        await applyBtn.click()
        await walkPage.waitForTimeout(600)
      }
    }
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-05-apply-promo.png"),
      fullPage: false,
    })

    // Step 6: Complete demo checkout
    console.log("Walkthrough Step 6: Complete Checkout")
    await walkPage.goto(`${BASE_URL}/checkout/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)

    const wEmail = walkPage.locator("input[type='email']").first()
    if (await wEmail.isVisible()) await wEmail.fill("oliver.twist@londonboy.co.uk")
    const wName = walkPage.locator("input[placeholder*='name' i], input[name*='name' i]").first()
    if (await wName.isVisible()) await wName.fill("Oliver Twist")
    const wAddr = walkPage.locator("input[placeholder*='address' i], input[name*='address' i]").first()
    if (await wAddr.isVisible()) await wAddr.fill("12 Savile Row, Mayfair")
    const wCity = walkPage.locator("input[placeholder*='city' i], input[name*='city' i]").first()
    if (await wCity.isVisible()) await wCity.fill("London")
    const wPost = walkPage.locator("input[placeholder*='postal' i], input[name*='postal' i], input[placeholder*='zip' i]").first()
    if (await wPost.isVisible()) await wPost.fill("W1S 3PR")

    const placeBtn = walkPage.locator("button:has-text('Place Order')").or(walkPage.locator("button:has-text('Complete Order')")).first()
    let createdOrderId = "ord_demo_1001"
    if (await placeBtn.isVisible()) {
      await placeBtn.click()
      await walkPage.waitForTimeout(1000)
      const currentUrl = walkPage.url()
      const match = currentUrl.match(/id=([^&]+)/)
      if (match) createdOrderId = match[1]
    }
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-06-order-placed.png"),
      fullPage: false,
    })

    // Step 7: Open Demo Admin
    console.log("Walkthrough Step 7: Open Demo Admin")
    await walkPage.goto(`${BASE_URL}/demo-admin/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-07-open-admin.png"),
      fullPage: false,
    })

    // Step 8: Find the new order
    console.log("Walkthrough Step 8: Find New Order in Admin")
    await walkPage.goto(`${BASE_URL}/demo-admin/orders/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-08-find-order.png"),
      fullPage: false,
    })

    // Step 9: Change order status in Admin
    console.log("Walkthrough Step 9: Change Order Status to Shipped")
    await walkPage.goto(`${BASE_URL}/demo-admin/order/?id=${createdOrderId}`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)

    const statusSelect = walkPage.locator("select").first()
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption("shipped")
      await walkPage.waitForTimeout(300)
    }
    const trackingInput = walkPage.locator("input[placeholder*='tracking' i], input[placeholder*='LND' i]").first()
    if (await trackingInput.isVisible()) {
      await trackingInput.fill("LND-EXP-8842-GB")
      const saveTrackingBtn = walkPage.locator("button:has-text('Update')").or(walkPage.locator("button:has-text('Save')")).first()
      if (await saveTrackingBtn.isVisible()) {
        await saveTrackingBtn.click()
        await walkPage.waitForTimeout(300)
      }
    }
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-09-change-order-status.png"),
      fullPage: false,
    })

    // Step 10: Return to customer account and show updated status
    console.log("Walkthrough Step 10: Customer Account Verified Updated Status")
    await walkPage.goto(`${BASE_URL}/account/orders/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-10-account-updated-status.png"),
      fullPage: false,
    })

    // Step 11: Reset demo
    console.log("Walkthrough Step 11: Reset Demo")
    await walkPage.goto(`${BASE_URL}/demo-admin/settings/`, { waitUntil: "networkidle" })
    await walkPage.waitForTimeout(500)
    await walkPage.screenshot({
      path: path.join(walkthroughDir, "step-11-reset-demo.png"),
      fullPage: false,
    })

    console.log("\n=== Successfully Captured All 12 Screenshots & 11 Walkthrough Frames ===")
  } finally {
    await browser.close()
    await new Promise<void>((resolve) => server.close(() => resolve()))
    console.log("Static Server gracefully terminated.")
  }
}

runMediaCapture().catch((err) => {
  console.error("Media capture failed:", err)
  process.exit(1)
})
