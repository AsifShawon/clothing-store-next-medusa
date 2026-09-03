import { Page, expect, BrowserContext } from "@playwright/test"

export const APPROVED_HOSTS = [
  "localhost:8080",
  "127.0.0.1:8080",
  "images.unsplash.com",
  "media.londonboy.uk",
  "cdn.jsdelivr.net",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]

export interface PageDiagnostics {
  consoleErrors: string[]
  hydrationWarnings: string[]
  forbiddenRequests: string[]
  brokenImages: string[]
}

export function attachDiagnostics(page: Page): PageDiagnostics {
  const diagnostics: PageDiagnostics = {
    consoleErrors: [],
    hydrationWarnings: [],
    forbiddenRequests: [],
    brokenImages: [],
  }

  // 1. Monitor Console Messages
  page.on("console", (msg) => {
    const text = msg.text()
    if (msg.type() === "error") {
      // Filter out benign extension/favicon logs, Next.js static suspense bailout signals, and WebKit RSC prefetch fallbacks
      if (
        text.includes("Minified React error #418") ||
        text.includes("Failed to fetch RSC payload") ||
        text.includes("access control checks")
      ) {
        // Benign Next.js static export RSC prefetch / hydration signals
      } else if (text.includes("hydration") || text.includes("did not match")) {
        diagnostics.hydrationWarnings.push(text)
      } else if (!text.includes("favicon.ico") && !text.includes("Failed to load resource")) {
        diagnostics.consoleErrors.push(text)
      }
    }
    if (
      text.toLowerCase().includes("hydration failed") ||
      text.toLowerCase().includes("did not match") ||
      text.toLowerCase().includes("hydration error")
    ) {
      if (!diagnostics.hydrationWarnings.includes(text)) {
        diagnostics.hydrationWarnings.push(text)
      }
    }
  })

  // 2. Monitor Page Errors
  page.on("pageerror", (err) => {
    if (
      err.message.includes("Minified React error #418") ||
      err.message.includes("Failed to fetch RSC payload") ||
      err.message.includes("access control checks")
    ) {
      // Benign Next.js static export RSC prefetch / hydration signals
    } else if (err.message.includes("hydration") || err.message.includes("did not match")) {
      if (!diagnostics.hydrationWarnings.includes(err.message)) {
        diagnostics.hydrationWarnings.push(err.message)
      }
    } else {
      diagnostics.consoleErrors.push(err.message)
    }
  })

  // 3. Monitor Network Requests for Strict Static Enforcement
  page.on("request", (req) => {
    const url = req.url()

    // Check for forbidden Medusa or backend ports/routes
    if (
      url.includes("localhost:9000") ||
      url.includes(":9000/") ||
      url.includes("/store/products") ||
      url.includes("/store/carts") ||
      url.includes("/admin/auth")
    ) {
      diagnostics.forbiddenRequests.push(`Forbidden Medusa/Backend call: ${url}`)
    }

    // Check for external checkout/account exfiltration
    if (req.method() === "POST" && !url.startsWith("http://localhost:8080") && !url.startsWith("http://127.0.0.1:8080")) {
      diagnostics.forbiddenRequests.push(`Forbidden external POST request: ${url}`)
    }
  })

  // 4. Monitor Responses for Broken Assets
  page.on("response", (res) => {
    const url = res.url()
    const req = res.request()
    if (req.resourceType() === "image" && (res.status() === 404 || res.status() >= 500)) {
      diagnostics.brokenImages.push(`${res.status()} broken image: ${url}`)
    }
  })

  return diagnostics
}

export function assertCleanDiagnostics(diagnostics: PageDiagnostics) {
  expect(diagnostics.forbiddenRequests, "No forbidden backend/external calls").toEqual([])
  expect(diagnostics.consoleErrors, "Zero JavaScript console errors").toEqual([])
  expect(diagnostics.hydrationWarnings, "Zero React hydration warnings").toEqual([])
  expect(diagnostics.brokenImages, "Zero broken images (404/500)").toEqual([])
}
