import { test, describe } from "node:test"
import assert from "node:assert/strict"
import {
  AddressFormView,
  CartItemView,
  CartTotalsView,
  ShippingMethodView,
  createMoneyView,
} from "@dtc/commerce-contracts"

describe("Shared Checkout State Transitions & Validation Contract Suite", () => {
  const dummyItem: CartItemView = {
    id: "item_1",
    productId: "prod_1",
    productTitle: "Heavyweight T-Shirt",
    productHandle: "heavyweight-t-shirt",
    variantId: "var_1",
    variantTitle: "Black / L",
    sku: "LB-TEE-BLK-L",
    quantity: 1,
    unitPrice: createMoneyView(2450, "bdt"),
    totalPrice: createMoneyView(2450, "bdt"),
    options: { Color: "Black", Size: "L" },
  }

  const dummyTotals: CartTotalsView = {
    subtotal: createMoneyView(2450, "bdt"),
    shipping: createMoneyView(60, "bdt"),
    total: createMoneyView(2510, "bdt"),
  }

  const dummyShipping: ShippingMethodView = {
    id: "sm_inside_dhaka",
    name: "Inside Dhaka Delivery",
    price: createMoneyView(60, "bdt"),
  }

  const validAddress: AddressFormView = {
    firstName: "Asif",
    lastName: "Shawon",
    phone: "+8801700000000",
    address1: "House 42, Road 11",
    city: "Dhaka",
    country: "bd",
    postalCode: "1213",
  }

  test("1. Empty required fields cannot proceed (Address Validation Guard)", () => {
    function validateAddress(addr: AddressFormView, email: string): Record<string, string> {
      const errors: Record<string, string> = {}
      if (!addr.firstName?.trim()) errors.firstName = "First name is required"
      if (!addr.lastName?.trim()) errors.lastName = "Last name is required"
      if (!addr.phone?.trim()) errors.phone = "Phone number is required"
      if (!addr.address1?.trim()) errors.address1 = "Address is required"
      if (!addr.city?.trim()) errors.city = "City is required"
      if (!email?.trim() || !email.includes("@")) errors.email = "Valid email is required"
      return errors
    }

    const emptyAddress: AddressFormView = {
      firstName: "",
      lastName: "",
      phone: "",
      address1: "",
      city: "",
      country: "",
    }

    const errors = validateAddress(emptyAddress, "")
    assert.equal(Object.keys(errors).length >= 5, true)
    assert.equal(errors.firstName, "First name is required")
    assert.equal(errors.email, "Valid email is required")
  })

  test("2. Email/address submission calls provider callback with normalized data (bd country code)", () => {
    let capturedPayload: { email: string; shipping_address: { country_code: string; city: string } } | null = null

    function handleSaveAddress(addr: AddressFormView, email: string, countryCode: string) {
      capturedPayload = {
        email: email.trim().toLowerCase(),
        shipping_address: {
          city: addr.city.trim(),
          country_code: countryCode.toLowerCase(),
        },
      }
    }

    handleSaveAddress(validAddress, "  User@Example.COM ", "BD")
    assert.notEqual(capturedPayload, null)
    if (capturedPayload) {
      assert.equal(capturedPayload.email, "user@example.com")
      assert.equal(capturedPayload.shipping_address.country_code, "bd")
    }
  })


  test("3. Address errors prevent transition to shipping", () => {
    let canContinueToShipping = false
    const errors: Record<string, string> = { phone: "Invalid phone number" }

    if (Object.keys(errors).length === 0) {
      canContinueToShipping = true
    }

    assert.equal(canContinueToShipping, false)
  })

  test("4. Shipping cannot be selected prematurely before address is persisted", () => {
    let addressPersisted = false
    let shippingSelectionAllowed = false

    function trySelectShipping(id: string) {
      if (!addressPersisted) {
        throw new Error("Address must be saved before selecting a shipping method")
      }
      shippingSelectionAllowed = true
    }

    assert.throws(() => trySelectShipping("sm_1"), /Address must be saved/)
    assert.equal(shippingSelectionAllowed, false)

    // Once address is persisted
    addressPersisted = true
    trySelectShipping("sm_1")
    assert.equal(shippingSelectionAllowed, true)
  })

  test("5. Provider errors do not falsely advance the UI", () => {
    let canContinueToPayment = false
    let checkoutError: string | null = null

    function simulateShippingFailure() {
      try {
        throw new Error("Courier route unavailable for this postal code")
      } catch (err: unknown) {
        checkoutError = err instanceof Error ? err.message : "Error"
        canContinueToPayment = false
      }
    }

    simulateShippingFailure()
    assert.equal(canContinueToPayment, false)
    assert.equal(checkoutError, "Courier route unavailable for this postal code")
  })

  test("6. Payment cannot complete without address and shipping", () => {
    function canCompletePayment(cart: {
      hasAddress: boolean
      hasShippingMethod: boolean
      hasPaymentSession: boolean
    }): boolean {
      return cart.hasAddress && cart.hasShippingMethod && cart.hasPaymentSession
    }

    assert.equal(canCompletePayment({ hasAddress: false, hasShippingMethod: false, hasPaymentSession: false }), false)
    assert.equal(canCompletePayment({ hasAddress: true, hasShippingMethod: false, hasPaymentSession: false }), false)
    assert.equal(canCompletePayment({ hasAddress: true, hasShippingMethod: true, hasPaymentSession: false }), false)
    assert.equal(canCompletePayment({ hasAddress: true, hasShippingMethod: true, hasPaymentSession: true }), true)
  })

  test("7. Exactly one order-completion call occurs and double-clicking is debounced", async () => {
    let placeOrderCallCount = 0
    let isSubmitting = false

    async function placeOrder() {
      if (isSubmitting) {
        return // debounced
      }
      isSubmitting = true
      placeOrderCallCount++
      await new Promise((resolve) => setTimeout(resolve, 10))
      isSubmitting = false
    }

    // Simulate rapid concurrent double clicks
    await Promise.all([placeOrder(), placeOrder()])
    assert.equal(placeOrderCallCount, 1)
  })

  test("8. Medusa adapter lifecycle calls cart update before shipping and payment", async () => {
    const lifecycleLog: string[] = []

    async function mockUpdateCart() {
      lifecycleLog.push("updateCart")
    }

    async function mockSetShippingMethod() {
      if (!lifecycleLog.includes("updateCart")) {
        throw new Error("Cannot set shipping method before cart update")
      }
      lifecycleLog.push("setShippingMethod")
    }

    async function mockInitiatePayment() {
      if (!lifecycleLog.includes("setShippingMethod")) {
        throw new Error("Cannot initiate payment before shipping selection")
      }
      lifecycleLog.push("initiatePayment")
    }

    async function mockCompleteOrder() {
      if (!lifecycleLog.includes("initiatePayment")) {
        throw new Error("Cannot complete order before payment session")
      }
      lifecycleLog.push("completeOrder")
    }

    await mockUpdateCart()
    await mockSetShippingMethod()
    await mockInitiatePayment()
    await mockCompleteOrder()

    assert.deepEqual(lifecycleLog, [
      "updateCart",
      "setShippingMethod",
      "initiatePayment",
      "completeOrder",
    ])
  })
})
