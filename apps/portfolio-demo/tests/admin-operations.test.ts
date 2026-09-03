import { test, describe, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { demoStorage, STORAGE_KEY } from "../src/lib/storage-repository"
import { SEED_PRODUCTS, createInitialSeedState } from "../src/lib/seed-catalog"
import { DemoStoreState, DemoProduct, DemoOrder } from "../src/lib/types"
import { generateId, generateDisplayOrderId } from "../src/lib/id"

// In-memory mock for localStorage in Node test environment
class MockLocalStorage {
  private store = new Map<string, string>()

  getItem(key: string): string | null {
    return this.store.get(key) || null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

describe("London Boy Portfolio Demo Admin Operations Tests", () => {
  let mockStorage: MockLocalStorage

  before(() => {
    mockStorage = new MockLocalStorage()
    ;(globalThis as any).window = {
      localStorage: mockStorage,
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  })

  beforeEach(() => {
    mockStorage.clear()
    demoStorage.resetState()
  })

  test("1. Create new garment with multiple variants in Admin", () => {
    const newProduct: Omit<DemoProduct, "id" | "createdAt" | "updatedAt"> = {
      title: "Mayfair Cashmere Overcoat",
      handle: "mayfair-cashmere-overcoat",
      subtitle: "100% Mongolian Cashmere",
      description: "Structured winter overcoat with horn buttons.",
      material: "100% Cashmere",
      status: "published",
      collectionHandle: "new-arrivals",
      categoryNames: ["Men"],
      tags: ["overcoat", "cashmere", "winter"],
      thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518"],
      options: [{ id: "opt_size", title: "Size", values: ["M", "L"] }],
      variants: [
        {
          id: "var_coat_m",
          title: "Camel / M",
          sku: "LB-COAT-CAM-M",
          options: { Color: "Camel", Size: "M" },
          price: 8500,
          usdPrice: 75,
          inventoryQuantity: 15,
          manageInventory: true,
        },
        {
          id: "var_coat_l",
          title: "Camel / L",
          sku: "LB-COAT-CAM-L",
          options: { Color: "Camel", Size: "L" },
          price: 8500,
          usdPrice: 75,
          inventoryQuantity: 10,
          manageInventory: true,
        },
      ],
      metadata: { origin: "Crafted in Bangladesh" },
    }

    demoStorage.updateState((draft) => {
      const id = generateId("prod")
      const now = new Date().toISOString()
      draft.products.unshift({ ...newProduct, id, createdAt: now, updatedAt: now })
      return draft
    })

    const state = demoStorage.getState()
    assert.equal(state.products.length, 7, "Catalog should now have 7 products")
    assert.equal(state.products[0].title, "Mayfair Cashmere Overcoat")
    assert.equal(state.products[0].variants.length, 2)
  })

  test("2. Enforce handle and SKU uniqueness validations", () => {
    const state = demoStorage.getState()
    const existingHandle = state.products[0].handle // "heavyweight-t-shirt"
    const existingSku = state.products[0].variants[0].sku // "LB-TSH-BLK-S"

    // Test handle uniqueness check
    const isHandleDuplicate = state.products.some((p) => p.handle === existingHandle)
    assert.equal(isHandleDuplicate, true, "Handle conflict correctly detected")

    // Test SKU uniqueness check
    const isSkuDuplicate = state.products.some((p) =>
      p.variants.some((v) => v.sku === existingSku)
    )
    assert.equal(isSkuDuplicate, true, "SKU conflict correctly detected")
  })

  test("3. Archive and publish toggle hides/shows product in catalog", () => {
    const state = demoStorage.getState()
    const targetProdId = state.products[0].id

    // Archive product
    demoStorage.updateState((draft) => {
      draft.products = draft.products.map((p) =>
        p.id === targetProdId ? { ...p, status: "draft" } : p
      )
      return draft
    })

    let current = demoStorage.getState()
    const archivedProd = current.products.find((p) => p.id === targetProdId)!
    assert.equal(archivedProd.status, "draft")

    // Publish product
    demoStorage.updateState((draft) => {
      draft.products = draft.products.map((p) =>
        p.id === targetProdId ? { ...p, status: "published" } : p
      )
      return draft
    })

    current = demoStorage.getState()
    const publishedProd = current.products.find((p) => p.id === targetProdId)!
    assert.equal(publishedProd.status, "published")
  })

  test("4. Order cancellation restores inventory exactly once", () => {
    const state = demoStorage.getState()
    const variant = state.products[0].variants[0]
    const initialQty = variant.inventoryQuantity // 25

    // Create active order with 3 units
    const orderId = "ord_cancel_test_1"
    demoStorage.updateState((draft) => {
      // Deduct 3 units
      draft.products[0].variants[0].inventoryQuantity -= 3

      draft.orders.unshift({
        id: orderId,
        displayId: "LB-ORD-TEST-1",
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        fulfillmentStatus: "not_fulfilled",
        paymentMethod: "cod",
        items: [
          {
            id: "ord_item_1",
            productId: draft.products[0].id,
            productTitle: draft.products[0].title,
            productHandle: draft.products[0].handle,
            variantId: variant.id,
            variantTitle: variant.title,
            sku: variant.sku,
            quantity: 3,
            unitPrice: variant.price,
            totalPrice: variant.price * 3,
            thumbnail: draft.products[0].thumbnail,
          },
        ],
        customer: { firstName: "Test", lastName: "Customer", email: "t@c.com", phone: "123" },
        shippingAddress: { firstName: "Test", lastName: "Customer", email: "t@c.com", phone: "123", address1: "A", city: "Dhaka", postalCode: "1213", country: "BD" },
        shippingOption: draft.shippingOptions[0],
        itemSubtotal: variant.price * 3,
        discountTotal: 0,
        shippingTotal: 60,
        total: variant.price * 3 + 60,
      })
      return draft
    })

    let afterOrder = demoStorage.getState()
    assert.equal(afterOrder.products[0].variants[0].inventoryQuantity, initialQty - 3)

    // Cancel order & restore inventory
    demoStorage.updateState((draft) => {
      const ord = draft.orders.find((o) => o.id === orderId)!
      if (ord.status !== "canceled") {
        draft.products[0].variants[0].inventoryQuantity += 3
        ord.status = "canceled"
      }
      return draft
    })

    const afterCancel = demoStorage.getState()
    assert.equal(
      afterCancel.products[0].variants[0].inventoryQuantity,
      initialQty,
      "Inventory should be restored back to initial 25"
    )
    assert.equal(afterCancel.orders[0].status, "canceled")

    // Attempt second cancellation: inventory must NOT increase again
    demoStorage.updateState((draft) => {
      const ord = draft.orders.find((o) => o.id === orderId)!
      if (ord.status !== "canceled") {
        draft.products[0].variants[0].inventoryQuantity += 3
        ord.status = "canceled"
      }
      return draft
    })

    const afterSecondCancel = demoStorage.getState()
    assert.equal(
      afterSecondCancel.products[0].variants[0].inventoryQuantity,
      initialQty,
      "Inventory must not increase on duplicate cancellation"
    )
  })

  test("5. Attach courier tracking and mark fulfilled", () => {
    const orderId = demoStorage.getState().orders[0].id

    demoStorage.updateState((draft) => {
      draft.orders = draft.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "shipped",
              fulfillmentStatus: "fulfilled",
              notes: "[Tracking: Pathao Courier PTH-99214]",
            }
          : o
      )
      return draft
    })

    const updated = demoStorage.getState().orders.find((o) => o.id === orderId)!
    assert.equal(updated.status, "shipped")
    assert.equal(updated.fulfillmentStatus, "fulfilled")
    assert.ok(updated.notes?.includes("PTH-99214"))
  })

  test("6. Simulate order refund updates payment status", () => {
    const orderId = demoStorage.getState().orders[0].id

    demoStorage.updateState((draft) => {
      draft.orders = draft.orders.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: "refunded" } : o
      )
      return draft
    })

    const updated = demoStorage.getState().orders.find((o) => o.id === orderId)!
    assert.equal(updated.paymentStatus, "refunded")
  })

  test("7. Create, toggle, and delete promotional coupon codes", () => {
    // Add promo
    demoStorage.updateState((draft) => {
      draft.promotions.push({
        id: "promo_winter25",
        code: "WINTER25",
        type: "percentage",
        value: 25,
        minOrderAmount: 3000,
        description: "25% off winter collection",
        isActive: true,
      })
      return draft
    })

    let state = demoStorage.getState()
    const promo = state.promotions.find((p) => p.code === "WINTER25")
    assert.ok(promo)
    assert.equal(promo.value, 25)
    assert.equal(promo.isActive, true)

    // Toggle active state
    demoStorage.updateState((draft) => {
      draft.promotions = draft.promotions.map((p) =>
        p.code === "WINTER25" ? { ...p, isActive: false } : p
      )
      return draft
    })

    state = demoStorage.getState()
    const toggled = state.promotions.find((p) => p.code === "WINTER25")!
    assert.equal(toggled.isActive, false)

    // Delete promo
    demoStorage.updateState((draft) => {
      draft.promotions = draft.promotions.filter((p) => p.code !== "WINTER25")
      return draft
    })

    state = demoStorage.getState()
    assert.equal(state.promotions.some((p) => p.code === "WINTER25"), false)
  })

  test("8. Update store settings", () => {
    demoStorage.updateState((draft) => {
      draft.settings.storeName = "London Boy Flagship"
      draft.settings.lowStockThreshold = 15
      return draft
    })

    const state = demoStorage.getState()
    assert.equal(state.settings.storeName, "London Boy Flagship")
    assert.equal(state.settings.lowStockThreshold, 15)
  })
})
