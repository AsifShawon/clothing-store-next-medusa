import { chromium } from "playwright"
import path from "path"
import fs from "fs"
import http from "http"

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
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
      res.writeHead(404, { "Content-Type": "text/plain" })
      res.end("404 Not Found")
      return
    }
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"
    res.writeHead(200, { "Content-Type": contentType })
    res.end(fs.readFileSync(filePath))
  })
}

async function capture() {
  const outDir = path.resolve(__dirname, "../out")
  const baselineDir = path.resolve(__dirname, "../../../docs/assets/screenshots/baseline")
  if (!fs.existsSync(baselineDir)) {
    fs.mkdirSync(baselineDir, { recursive: true })
  }

  const server = createStaticServer(outDir)
  const PORT = 8111
  await new Promise<void>((resolve) => server.listen(PORT, resolve))
  const BASE_URL = `http://localhost:${PORT}`

  const browser = await chromium.launch({ headless: true })

  try {
    // 1. Desktop Context
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    })
    const desktopPage = await desktopContext.newPage()

    console.log("Capturing baseline desktop home...")
    await desktopPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({ path: path.join(baselineDir, "01-baseline-desktop-home.png") })

    // Mega menu
    console.log("Capturing baseline mega menu...")
    const shirtsNav = desktopPage.locator("nav[aria-label='Main category navigation'] a, header a").filter({ hasText: "SHIRTS" }).first()
    if (await shirtsNav.isVisible()) {
      await shirtsNav.hover()
      await desktopPage.waitForTimeout(400)
      await desktopPage.screenshot({ path: path.join(baselineDir, "02-baseline-desktop-mega-menu.png") })
    }

    // Desktop quick add
    console.log("Capturing baseline desktop quick add hover...")
    const firstCard = desktopPage.locator("article.product-card").first()
    if (await firstCard.isVisible()) {
      await firstCard.hover()
      await desktopPage.waitForTimeout(400)
      await desktopPage.screenshot({ path: path.join(baselineDir, "03-baseline-desktop-quick-add.png") })
    }

    // Cart Drawer
    console.log("Capturing baseline cart drawer...")
    const bagBtn = desktopPage.locator("[data-testid='nav-cart-link']").first()
    if (await bagBtn.isVisible()) {
      await bagBtn.click()
      await desktopPage.waitForTimeout(500)
      await desktopPage.screenshot({ path: path.join(baselineDir, "04-baseline-cart-drawer.png") })
    }

    // 2. Mobile Context
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const mobilePage = await mobileContext.newPage()

    console.log("Capturing baseline mobile home...")
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await mobilePage.waitForTimeout(600)
    await mobilePage.screenshot({ path: path.join(baselineDir, "05-baseline-mobile-home.png") })

    // Mobile quick add sheet
    console.log("Capturing baseline mobile quick add sheet...")
    const mobileQuickAddBtn = mobilePage.locator("button:has-text('+ Quick Add')").first()
    if (await mobileQuickAddBtn.isVisible()) {
      await mobileQuickAddBtn.click()
      await mobilePage.waitForTimeout(500)
      await mobilePage.screenshot({ path: path.join(baselineDir, "06-baseline-mobile-quick-add-sheet.png") })
    }

    console.log("Baseline capture complete!")
  } finally {
    await browser.close()
    server.close()
  }
}

capture().catch((err) => {
  console.error("Baseline capture error:", err)
  process.exit(1)
})
