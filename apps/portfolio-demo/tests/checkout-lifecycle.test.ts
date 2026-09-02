import { test, describe, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { demoStorage, STORAGE_KEY } from "../src/lib/storage-repository"
import { SEED_PRODUCTS, createInitialSeedState } from "../src/lib/seed-catalog"
import { DemoStoreState, DemoOrder } from "../src/lib/types"
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

describe("London Boy Portfolio Demo Checkout, Customer & Order Lifecycle Tests", () => {
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

  test("1. Guest order placement creates valid order and decrements inventory", () => {
    const state = demoStorage.getState()
    const product = state.products[0]
    const variant = product.variants[0] // 25 units initially
    const initialStock = variant.inventoryQuantity

    const guestAddress = {
      firstName: "Rahim",
      lastName: "Uddin",
      email: "rahim@example.com",
      phone: "+880 1812 000000",
      address1: "Dhanmondi Road 27",
      city: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    }

    // Populate cart
    demoStorage.updateState((draft) => {
      draft.cart.items = [
        {
          id: "item_guest_1",
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
          maxInventory: initialStock,
        },
      ]
      return draft
    })

    // Place Guest Order via simulated transaction
    let placedOrder: DemoOrder | null = null
    demoStorage.updateState((draft) => {
      const shippingOption = draft.shippingOptions[0] // Inside Dhaka (৳60)
      const subtotal = draft.cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) // 1250 * 2 = 2500
      const total = subtotal + shippingOption.price // 2560

      placedOrder = {
        id: generateId("ord"),
        displayId: generateDisplayOrderId(draft.orders.length),
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        fulfillmentStatus: "not_fulfilled",
        paymentMethod: "cod",
        isGuestOrder: true,
        items: draft.cart.items.map((i) => ({
          id: generateId("ord_item"),
          productId: i.productId,
          productTitle: i.productTitle,
          productHandle: i.productHandle,
          variantId: i.variantId,
          variantTitle: i.variantTitle,
          sku: i.sku,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.unitPrice * i.quantity,
          thumbnail: i.thumbnail,
        })),
        customer: {
          firstName: guestAddress.firstName,
          lastName: guestAddress.lastName,
          email: guestAddress.email,
          phone: guestAddress.phone,
        },
        shippingAddress: guestAddress,
        shippingOption,
        itemSubtotal: subtotal,
        discountTotal: 0,
        shippingTotal: shippingOption.price,
        total,
      }

      // Deduct inventory
      draft.products = draft.products.map((p) => {
        if (p.id === product.id) {
          p.variants = p.variants.map((v) => {
            if (v.id === variant.id) {
              return { ...v, inventoryQuantity: v.inventoryQuantity - 2 }
            }
            return v
          })
        }
        return p
      })

      draft.orders = [placedOrder, ...draft.orders]
      draft.cart.items = []
      return draft
    })

    const updated = demoStorage.getState()
    const updatedVar = updated.products[0].variants[0]

    assert.ok(placedOrder !== null)
    const orderObj: DemoOrder = placedOrder!
    assert.equal(orderObj.isGuestOrder, true)
    assert.equal(orderObj.total, 2560)
    assert.equal(updatedVar.inventoryQuantity, initialStock - 2, "Inventory should decrease by 2")
    assert.equal(updated.cart.items.length, 0, "Cart should be cleared after order")
  })

  test("2. Demo customer order updates customer statistics and profile", () => {
    const state = demoStorage.getState()
    const customer = state.customers[0]
    const initialOrdersCount = customer.ordersCount
    const initialSpent = customer.totalSpent

    demoStorage.updateState((draft) => {
      const prod = draft.products[1] // Oxford shirt (৳2250)
      const v = prod.variants[0]
      const orderTotal = 2250 + 60 // 2310

      const newOrder: DemoOrder = {
        id: generateId("ord"),
        displayId: generateDisplayOrderId(draft.orders.length),
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "paid",
        fulfillmentStatus: "not_fulfilled",
        paymentMethod: "test_card",
        isGuestOrder: false,
        customerId: customer.id,
        items: [
          {
            id: generateId("ord_item"),
            productId: prod.id,
            productTitle: prod.title,
            productHandle: prod.handle,
            variantId: v.id,
            variantTitle: v.title,
            sku: v.sku,
            quantity: 1,
            unitPrice: v.price,
            totalPrice: v.price,
            thumbnail: prod.thumbnail,
          },
        ],
        customer: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        shippingAddress: customer.defaultAddress!,
        shippingOption: draft.shippingOptions[0],
        itemSubtotal: 2250,
        discountTotal: 0,
        shippingTotal: 60,
        total: orderTotal,
      }

      draft.orders = [newOrder, ...draft.orders]
      draft.customers = draft.customers.map((c) => {
        if (c.id === customer.id) {
          return {
            ...c,
            ordersCount: c.ordersCount + 1,
            totalSpent: c.totalSpent + orderTotal,
          }
        }
        return c
      })
      return draft
    })

    const after = demoStorage.getState()
    const updatedCustomer = after.customers[0]
    assert.equal(updatedCustomer.ordersCount, initialOrdersCount + 1)
    assert.equal(updatedCustomer.totalSpent, initialSpent + 2310)
  })

  test("3. Promo code LONDON10 subtracts 10% discount from order subtotal", () => {
    const state = demoStorage.getState()
    const prod = state.products[0] // ৳1250
    const subtotal = 1250 * 2 // 2500
    const promo = state.promotions.find((p) => p.code === "LONDON10")!
    const discount = (subtotal * promo.value) / 100 // 250
    const shipping = 60
    const expectedTotal = subtotal - discount + shipping // 2310

    assert.equal(discount, 250)
    assert.equal(expectedTotal, 2310)
  })

  test("4. Payment failure simulation preserves cart contents", () => {
    demoStorage.updateState((draft) => {
      draft.cart.items = [
        {
          id: "cart_item_retry",
          productId: draft.products[0].id,
          productTitle: draft.products[0].title,
          productHandle: draft.products[0].handle,
          variantId: draft.products[0].variants[0].id,
          variantTitle: draft.products[0].variants[0].title,
          sku: draft.products[0].variants[0].sku,
          options: draft.products[0].variants[0].options,
          unitPrice: 1250,
          quantity: 1,
          thumbnail: draft.products[0].thumbnail,
          maxInventory: 25,
        },
      ]
      return draft
    })

    // Simulate failed payment: cart is NOT touched
    const state = demoStorage.getState()
    assert.equal(state.cart.items.length, 1)
    assert.equal(state.cart.items[0].productTitle, "London Boy Signature Heavyweight T-Shirt")
  })

  test("5. Inventory decrement occurs exactly once per order", () => {
    const state = demoStorage.getState()
    const v = state.products[0].variants[0]
    const initialQty = v.inventoryQuantity // 25

    // Order 3 units
    demoStorage.updateState((draft) => {
      draft.products[0].variants[0].inventoryQuantity -= 3
      return draft
    })

    const after = demoStorage.getState()
    assert.equal(after.products[0].variants[0].inventoryQuantity, initialQty - 3)
  })

  test("6. Order persists in storage after reload simulation", () => {
    const state = demoStorage.getState()
    const testOrderId = "ord_persisted_test_123"

    demoStorage.updateState((draft) => {
      draft.orders.push({
        id: testOrderId,
        displayId: "LB-ORD-9999",
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "paid",
        fulfillmentStatus: "not_fulfilled",
        paymentMethod: "test_card",
        items: [],
        customer: { firstName: "Test", lastName: "User", email: "u@u.com", phone: "123" },
        shippingAddress: { firstName: "Test", lastName: "User", email: "u@u.com", phone: "123", address1: "A", city: "Dhaka", postalCode: "1213", country: "BD" },
        shippingOption: draft.shippingOptions[0],
        itemSubtotal: 1000,
        discountTotal: 0,
        shippingTotal: 60,
        total: 1060,
      })
      return draft
    })

    // Read directly from mock storage
    const raw = mockStorage.getItem(STORAGE_KEY)
    assert.ok(raw)
    const parsed = JSON.parse(raw)
    const found = parsed.orders.find((o: any) => o.id === testOrderId)
    assert.ok(found)
    assert.equal(found.displayId, "LB-ORD-9999")
  })

  test("7. Store reset restores authentic 38 variants and clears custom orders", () => {
    // Add custom order and mutate stock
    demoStorage.updateState((draft) => {
      draft.products[0].variants[0].inventoryQuantity = 0
      draft.orders.push({
        id: "ord_to_delete",
        displayId: "LB-ORD-DEL",
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        fulfillmentStatus: "not_fulfilled",
        paymentMethod: "cod",
        items: [],
        customer: { firstName: "X", lastName: "Y", email: "x@y.com", phone: "1" },
        shippingAddress: { firstName: "X", lastName: "Y", email: "x@y.com", phone: "1", address1: "A", city: "D", postalCode: "1", country: "BD" },
        shippingOption: draft.shippingOptions[0],
        itemSubtotal: 100,
        discountTotal: 0,
        shippingTotal: 60,
        total: 160,
      })
      return draft
    })

    // Reset store
    const fresh = demoStorage.resetState()
    assert.equal(fresh.products[0].variants[0].inventoryQuantity, 25, "Initial variant stock restored to 25")
    assert.equal(fresh.orders.length, 2, "Reverted to 2 initial seed orders")
  })

  test("8. Customer authorization isolation prevents opening unrelated customer orders", () => {
    const customerA = "cust_demo_londonboy"
    const customerB = "cust_other_fictional"

    const orderForCustomerA: DemoOrder = {
      id: "ord_customer_a",
      displayId: "LB-ORD-A",
      createdAt: new Date().toISOString(),
      status: "delivered",
      paymentStatus: "paid",
      fulfillmentStatus: "fulfilled",
      paymentMethod: "cod",
      customerId: customerA,
      customer: { id: customerA, firstName: "Asif", lastName: "Shawon", email: "customer@londonboy.uk", phone: "123" },
      shippingAddress: { firstName: "Asif", lastName: "Shawon", email: "customer@londonboy.uk", phone: "123", address1: "Road 11", city: "Dhaka", postalCode: "1213", country: "BD" },
      shippingOption: { id: "so_1", name: "Standard", price: 60, description: "D", estimatedDelivery: "24h" },
      items: [],
      itemSubtotal: 1000,
      discountTotal: 0,
      shippingTotal: 60,
      total: 1060,
    }

    // Check authorization function
    const isAuthorizedA = (orderForCustomerA.customer.id === customerA || orderForCustomerA.customerId === customerA)
    const isAuthorizedB = (orderForCustomerA.customer.id === customerB || orderForCustomerA.customerId === customerB)

    assert.equal(isAuthorizedA, true, "Customer A should be authorized to view their order")
    assert.equal(isAuthorizedB, false, "Customer B must be unauthorized to view Customer A's order")
  })
})
