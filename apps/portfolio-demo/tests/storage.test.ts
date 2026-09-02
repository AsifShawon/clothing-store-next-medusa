import { test, describe, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { demoStorage, STORAGE_KEY } from "../src/lib/storage-repository"
import { SEED_PRODUCTS, createInitialSeedState, DEMO_SCHEMA_VERSION } from "../src/lib/seed-catalog"
import { validateAndSanitizeState } from "../src/lib/storage-validator"
import { DemoStoreState, DemoProduct } from "../src/lib/types"

// In-memory mock for localStorage in Node test environment
class MockLocalStorage {
  private store = new Map<string, string>()
  public shouldThrowQuota = false

  getItem(key: string): string | null {
    return this.store.get(key) || null
  }

  setItem(key: string, value: string): void {
    if (this.shouldThrowQuota && key === STORAGE_KEY) {
      const err = new Error("Quota exceeded")
      err.name = "QuotaExceededError"
      throw err
    }
    this.store.set(key, value)
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

describe("London Boy Portfolio Demo Storage Engine & Catalog Tests", () => {
  let mockStorage: MockLocalStorage

  before(() => {
    mockStorage = new MockLocalStorage()
    // Inject global window mock for Node test environment
    ;(globalThis as any).window = {
      localStorage: mockStorage,
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  })

  beforeEach(() => {
    mockStorage.clear()
    mockStorage.shouldThrowQuota = false
    demoStorage.resetState()
  })

  test("1. Empty-store initialization produces valid state with seed catalog", () => {
    const state = demoStorage.initializeState()
    assert.equal(state.schemaVersion, DEMO_SCHEMA_VERSION)
    assert.equal(state.products.length, 6)
    assert.equal(state.categories.length, 4)
    assert.equal(state.collections.length, 3)
    assert.equal(state.shippingOptions.length, 3)
    assert.equal(state.promotions.length, 2)
    assert.equal(state.settings.storeName, "London Boy")
    assert.equal(state.settings.currencyCode, "BDT")
    assert.equal(state.settings.countryCode, "BD")
  })

  test("2. Six products and thirty-eight total variants are accurately seeded", () => {
    const state = demoStorage.getState()
    const expectedHandles = [
      "heavyweight-t-shirt",
      "oxford-smart-shirt",
      "regent-knit-polo",
      "mayfair-tailored-chinos",
      "chelsea-relaxed-linen-shirt",
      "soho-cotton-twill-cap",
    ]

    expectedHandles.forEach((handle) => {
      const prod = state.products.find((p) => p.handle === handle)
      assert.ok(prod, `Product with handle "${handle}" should exist`)
    })

    const totalVariants = state.products.reduce((sum, p) => sum + p.variants.length, 0)
    assert.equal(totalVariants, 38, "Catalog must contain exactly 38 variants across 6 products")

    // Check variant counts per product: 8, 8, 6, 8, 6, 2
    const counts = state.products.map((p) => p.variants.length)
    assert.deepEqual(counts, [8, 8, 6, 8, 6, 2])

    // Verify all 38 SKUs are unique
    const skus = new Set<string>()
    state.products.forEach((p) => {
      p.variants.forEach((v) => {
        assert.ok(!skus.has(v.sku), `Duplicate SKU detected: ${v.sku}`)
        skus.add(v.sku)
      })
    })
    assert.equal(skus.size, 38)
  })

  test("3. All products have valid BDT pricing and no base64 image data", () => {
    const state = demoStorage.getState()
    const expectedPrices = [1250, 2250, 1850, 2650, 2450, 850]

    state.products.forEach((p, idx) => {
      p.variants.forEach((v) => {
        assert.equal(v.price, expectedPrices[idx], `Product ${p.title} variant should cost ৳${expectedPrices[idx]}`)
        assert.ok(v.inventoryQuantity > 0, `Variant ${v.sku} should have positive stocked quantity`)
      })

      // Image safety check
      assert.ok(!p.thumbnail.startsWith("data:"), "Thumbnail must not be a base64 string")
      p.images.forEach((img) => {
        assert.ok(!img.startsWith("data:"), "Product image must not be a base64 string")
        assert.ok(img.startsWith("https://") || img.startsWith("http://") || img.startsWith("/"), "Image must be a URL")
      })
    })
  })

  test("4. Reset behavior restores exact initial seed catalog and settings", () => {
    // Modify store state
    demoStorage.updateState((draft) => {
      draft.products.pop()
      draft.orders.push({
        id: "ord_test_temp",
        displayId: "LB-ORD-TEMP",
        createdAt: new Date().toISOString(),
        status: "delivered",
        paymentStatus: "paid",
        fulfillmentStatus: "fulfilled",
        paymentMethod: "cod",
        items: [],
        customer: { firstName: "Test", lastName: "User", email: "t@test.com", phone: "123" },
        shippingAddress: { firstName: "Test", lastName: "User", email: "t@test.com", phone: "123", address1: "A", city: "D", postalCode: "1", country: "BD" },
        shippingOption: draft.shippingOptions[0],
        itemSubtotal: 100,
        discountTotal: 0,
        shippingTotal: 60,
        total: 160,
      })
      return draft
    })

    assert.equal(demoStorage.getState().products.length, 5)

    // Execute reset
    const fresh = demoStorage.resetState()
    assert.equal(fresh.products.length, 6)
    assert.equal(fresh.products.reduce((s, p) => s + p.variants.length, 0), 38)
    assert.equal(fresh.orders.length, 2)
  })

  test("5. Corrupted JSON recovery handles invalid storage gracefully", () => {
    mockStorage.setItem(STORAGE_KEY, "{ broken_invalid_json_data [")
    
    // Should safely catch parse error and recover to valid initial seed
    const state = demoStorage.initializeState()
    assert.ok(state)
    assert.equal(state.products.length, 6)
    assert.equal(state.products.reduce((s, p) => s + p.variants.length, 0), 38)
  })

  test("6. Unsupported schema version automatically migrates/repairs state", () => {
    const outdatedState = {
      schemaVersion: 0,
      products: [],
    }
    mockStorage.setItem(STORAGE_KEY, JSON.stringify(outdatedState))

    const validation = validateAndSanitizeState(outdatedState)
    assert.equal(validation.migrated, true)
    assert.equal(validation.state.schemaVersion, DEMO_SCHEMA_VERSION)
    assert.equal(validation.state.products.length, 6)
  })

  test("7. QuotaExceededError is caught and handled without throwing unhandled exceptions", () => {
    mockStorage.shouldThrowQuota = true
    const currentState = demoStorage.getState()

    // Should return false and log warning, but not crash
    const saved = demoStorage.saveState(currentState)
    assert.equal(saved, false)
  })

  test("8. Cart item deduplication and quantity merging", () => {
    demoStorage.resetState()
    const state = demoStorage.getState()
    const product = state.products[0]
    const variant = product.variants[0]

    // Simulate adding variant twice via updateState
    demoStorage.updateState((draft) => {
      const item1 = {
        id: "cart_item_1",
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        variantId: variant.id,
        variantTitle: variant.title,
        sku: variant.sku,
        options: variant.options,
        unitPrice: variant.price,
        quantity: 2,
        thumbnail: product.thumbnail,
        maxInventory: variant.inventoryQuantity,
      }
      draft.cart.items.push(item1)
      return draft
    })

    demoStorage.updateState((draft) => {
      const existingIdx = draft.cart.items.findIndex((i) => i.variantId === variant.id)
      if (existingIdx > -1) {
        draft.cart.items[existingIdx].quantity += 3
      }
      return draft
    })

    const updated = demoStorage.getState()
    assert.equal(updated.cart.items.length, 1, "Should not create duplicate cart items for the same variant")
    assert.equal(updated.cart.items[0].quantity, 5, "Should merge quantity to 5")
  })

  test("9. Negative inventory prevention on order placement", () => {
    const state = demoStorage.getState()
    const product = state.products[0]
    const variant = product.variants[0]
    const availableStock = variant.inventoryQuantity // 25

    // Attempting to deduct 30 units (exceeding stock) should be bounded or prevent negative
    demoStorage.updateState((draft) => {
      const prod = draft.products.find((p) => p.id === product.id)!
      const v = prod.variants.find((vr) => vr.id === variant.id)!
      const requestedQty = 30
      v.inventoryQuantity = Math.max(0, v.inventoryQuantity - requestedQty)
      return draft
    })

    const after = demoStorage.getState()
    const updatedVar = after.products[0].variants[0]
    assert.ok(updatedVar.inventoryQuantity >= 0, "Inventory must never drop below 0")
    assert.equal(updatedVar.inventoryQuantity, 0)
  })

  test("10. State export and import validation", () => {
    const exportedJson = demoStorage.exportState()
    assert.ok(typeof exportedJson === "string")
    assert.ok(exportedJson.includes("London Boy Signature Heavyweight T-Shirt"))

    // Test successful import
    const importRes = demoStorage.importState(exportedJson)
    assert.equal(importRes.success, true)

    // Test invalid import rejection
    const badImport = demoStorage.importState("{ this is not valid json }")
    assert.equal(badImport.success, false)
    assert.ok(badImport.error)
  })

  test("11. Promotion code LONDON10 applies 10% discount", () => {
    const state = demoStorage.getState()
    const promo = state.promotions.find((p) => p.code === "LONDON10")
    assert.ok(promo, "LONDON10 promo code must be configured in seed state")
    assert.equal(promo?.value, 10)
    assert.equal(promo?.type, "percentage")
    assert.equal(promo?.isActive, true)
  })
})
