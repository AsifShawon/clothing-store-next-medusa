import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  getClientEnv,
  getServerEnv,
  getBaseURL,
  getMedusaBackendUrl,
  validateStorefrontEnv,
} from "../../src/lib/util/env-validation"

describe("Storefront Environment Validation Tests", () => {
  it("1. getBaseURL returns valid URL without trailing slash", () => {
    const original = process.env.NEXT_PUBLIC_BASE_URL
    process.env.NEXT_PUBLIC_BASE_URL = "https://londonboy.co.uk/"
    assert.strictEqual(getBaseURL(), "https://londonboy.co.uk")

    delete process.env.NEXT_PUBLIC_BASE_URL
    assert.strictEqual(getBaseURL(), "http://localhost:8000")

    if (original) {
      process.env.NEXT_PUBLIC_BASE_URL = original
    }
  })

  it("2. getMedusaBackendUrl prefers MEDUSA_BACKEND_URL in server environment", () => {
    const origServer = process.env.MEDUSA_BACKEND_URL
    const origClient = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

    process.env.MEDUSA_BACKEND_URL = "http://backend:9000/"
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = "https://api.londonboy.co.uk"

    assert.strictEqual(getMedusaBackendUrl(), "http://backend:9000")

    delete process.env.MEDUSA_BACKEND_URL
    assert.strictEqual(getMedusaBackendUrl(), "https://api.londonboy.co.uk")

    if (origServer) process.env.MEDUSA_BACKEND_URL = origServer
    if (origClient) process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = origClient
  })

  it("3. getClientEnv returns validated object with safe defaults in test mode", () => {
    const env = getClientEnv()
    assert.ok(env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)
    assert.ok(env.NEXT_PUBLIC_BASE_URL)
    assert.ok(env.NEXT_PUBLIC_DEFAULT_REGION)
    assert.ok(env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
  })

  it("4. validateStorefrontEnv executes cleanly on server", () => {
    const result = validateStorefrontEnv()
    assert.ok(result.client)
    assert.strictEqual(typeof result.client.NEXT_PUBLIC_DEFAULT_REGION, "string")
  })
})
