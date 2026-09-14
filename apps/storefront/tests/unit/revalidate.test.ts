import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { NextRequest } from "next/server"
import { POST } from "../../src/app/api/revalidate/route"

describe("Storefront Cache Revalidation API Route Tests", () => {
  it("1. Rejects request with 500 when REVALIDATE_SECRET is unconfigured on server", async () => {
    const orig = process.env.REVALIDATE_SECRET
    delete process.env.REVALIDATE_SECRET

    const req = new NextRequest("http://localhost:8000/api/revalidate", {
      method: "POST",
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 500)
    const data = await res.json()
    assert.ok(data.error.includes("REVALIDATE_SECRET is not configured"))

    if (orig) process.env.REVALIDATE_SECRET = orig
  })

  it("2. Rejects request with 401 when secret header is missing or incorrect", async () => {
    const orig = process.env.REVALIDATE_SECRET
    process.env.REVALIDATE_SECRET = "super_secure_revalidate_secret_test_key_12345"

    const reqMissing = new NextRequest("http://localhost:8000/api/revalidate", {
      method: "POST",
    })
    const resMissing = await POST(reqMissing)
    assert.strictEqual(resMissing.status, 401)

    const reqWrong = new NextRequest("http://localhost:8000/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": "wrong_secret" },
    })
    const resWrong = await POST(reqWrong)
    assert.strictEqual(resWrong.status, 401)

    if (orig) process.env.REVALIDATE_SECRET = orig
    else delete process.env.REVALIDATE_SECRET
  })

  it("3. Rejects request with 400 when authenticated but no tags are provided", async () => {
    const orig = process.env.REVALIDATE_SECRET
    process.env.REVALIDATE_SECRET = "super_secure_revalidate_secret_test_key_12345"

    const req = new NextRequest("http://localhost:8000/api/revalidate", {
      method: "POST",
      headers: {
        "x-revalidate-secret": "super_secure_revalidate_secret_test_key_12345",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags: [] }),
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 400)
    const data = await res.json()
    assert.ok(data.error.includes("No cache tags provided"))

    if (orig) process.env.REVALIDATE_SECRET = orig
    else delete process.env.REVALIDATE_SECRET
  })

  it("4. Accepts valid secret and returns revalidated tags list", async () => {
    const orig = process.env.REVALIDATE_SECRET
    process.env.REVALIDATE_SECRET = "super_secure_revalidate_secret_test_key_12345"

    const req = new NextRequest("http://localhost:8000/api/revalidate", {
      method: "POST",
      headers: {
        "x-revalidate-secret": "super_secure_revalidate_secret_test_key_12345",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags: ["products", "categories"] }),
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.strictEqual(data.revalidated, true)
    assert.deepStrictEqual(data.tags, ["products", "categories"])
    assert.ok(typeof data.timestamp === "number")

    if (orig) process.env.REVALIDATE_SECRET = orig
    else delete process.env.REVALIDATE_SECRET
  })
})
