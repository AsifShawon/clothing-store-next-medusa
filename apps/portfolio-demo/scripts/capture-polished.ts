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
  const polishedDir = path.resolve(__dirname, "../../../docs/assets/screenshots/polished")
  if (!fs.existsSync(polishedDir)) {
    fs.mkdirSync(polishedDir, { recursive: true })
  }

  const server = createStaticServer(outDir)
  const PORT = 8112
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

    console.log("Capturing polished desktop home (with banner)...")
    await desktopPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await desktopPage.waitForTimeout(600)
    await desktopPage.screenshot({ path: path.join(polishedDir, "01-polished-desktop-home.png") })

    // Dismiss banner to capture clean floating header offset
    console.log("Capturing polished desktop home (banner dismissed)...")
    const dismissBtn = desktopPage.locator("button[aria-label='Dismiss demo notice']")
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click()
      await desktopPage.waitForTimeout(400)
      await desktopPage.screenshot({ path: path.join(polishedDir, "02-polished-desktop-banner-dismissed.png") })
    }

    // Mega menu
    console.log("Capturing polished mega menu...")
    const shirtsNav = desktopPage.locator("header a:has-text('Shirts'), header button:has-text('Shirts')").first()
    if (await shirtsNav.isVisible()) {
      await shirtsNav.hover()
      await desktopPage.waitForTimeout(400)
      await desktopPage.screenshot({ path: path.join(polishedDir, "03-polished-desktop-mega-menu.png") })
      await desktopPage.keyboard.press("Escape")
      await desktopPage.waitForTimeout(200)
    }

    // Desktop quick add hover tray
    console.log("Capturing polished desktop quick add tray...")
    const firstCard = desktopPage.locator("[data-testid='product-wrapper']").first()
    if (await firstCard.isVisible()) {
      await firstCard.scrollIntoViewIfNeeded()
      await firstCard.hover()
      await desktopPage.waitForTimeout(400)
      await desktopPage.screenshot({ path: path.join(polishedDir, "04-polished-desktop-quick-add.png") })
    }

    // Cart Drawer
    console.log("Capturing polished cart drawer...")
    const bagBtn = desktopPage.locator("[data-testid='nav-cart-link']").first()
    if (await bagBtn.isVisible()) {
      await bagBtn.click()
      await desktopPage.waitForTimeout(500)
      await desktopPage.screenshot({ path: path.join(polishedDir, "05-polished-cart-drawer.png") })
      await desktopPage.keyboard.press("Escape")
      await desktopPage.waitForTimeout(300)
    }

    // 2. Mobile Context
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const mobilePage = await mobileContext.newPage()

    console.log("Capturing polished mobile home...")
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await mobilePage.waitForTimeout(600)
    await mobilePage.screenshot({ path: path.join(polishedDir, "06-polished-mobile-home.png") })

    // Mobile quick add sheet
    console.log("Capturing polished mobile quick add sheet...")
    const mobileQuickAddBtn = mobilePage.locator("button[aria-label*='Quick Add']").first()
    if (await mobileQuickAddBtn.isVisible()) {
      await mobileQuickAddBtn.scrollIntoViewIfNeeded()
      await mobileQuickAddBtn.click()
      await mobilePage.waitForTimeout(500)
      await mobilePage.screenshot({ path: path.join(polishedDir, "07-polished-mobile-quick-add-sheet.png") })
    }

    console.log("Polished capture complete!")
  } finally {
    await browser.close()
    server.close()
  }
}

capture().catch((err) => {
  console.error("Polished capture error:", err)
  process.exit(1)
})
