import assert from "node:assert"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_b14587481fe492d53e44e769e5eeabd0109f9d128bd5879d40c34b7b4b2c8f1b"
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || "testadmin@londonboy.uk"
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || "supersecret123"

const headers = {
  "Content-Type": "application/json",
  "x-publishable-api-key": PUBLISHABLE_KEY,
}

describe("Medusa Cart and Checkout Flow", () => {
  let bdRegion: { id: string; name: string }
  let targetVariant: { id: string; sku: string; title: string }
  let tshirtProduct: { id: string; title: string }
  let adminToken: string
  let cartId: string
  let lineItemId: string

  beforeAll(async () => {
    // 1. Get Region
    const regionsRes = await fetch(`${BACKEND_URL}/store/regions`, { headers })
    const { regions } = await regionsRes.json()
    bdRegion = regions.find((r: { countries?: { iso_2: string }[] }) => r.countries?.some((c) => c.iso_2 === "bd")) || regions[0]

    // 2. Get Product & Variant
    const productsRes = await fetch(`${BACKEND_URL}/store/products?fields=*variants,*variants.options`, { headers })
    const { products } = await productsRes.json()
    tshirtProduct = products.find((p: { handle: string }) => p.handle === "heavyweight-t-shirt") || products[0]
    targetVariant = tshirtProduct.variants.find((v: { sku: string }) => v.sku === "LB-TEE-HVY-BLK-S" || v.sku === "TSHIRT-BLK-S") || tshirtProduct.variants[0]

    // 3. Admin Auth
    const adminLoginRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })
    const adminAuth = await adminLoginRes.json()
    adminToken = adminAuth.token
  })

  it("1. Adds a specific size/color variant to cart", async () => {
    const createCartRes = await fetch(`${BACKEND_URL}/store/carts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ region_id: bdRegion.id }),
    })
    const { cart } = await createCartRes.json()
    cartId = cart.id

    const addLineRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        variant_id: targetVariant.id,
        quantity: 1,
      }),
    })
    const addLineData = await addLineRes.json()
    const added = addLineData.cart?.items?.find((i: { variant_id: string }) => i.variant_id === targetVariant.id)
    lineItemId = added.id

    expect(added).toBeDefined()
    expect(added.quantity).toBe(1)
  })

  it("2. Updates line item quantity from 1 to 2", async () => {
    const updateRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ quantity: 2 }),
    })
    const updateData = await updateRes.json()
    const item = updateData.cart?.items?.find((i: { id: string }) => i.id === lineItemId)

    expect(item.quantity).toBe(2)
  })

  it("3. Removes an item from cart", async () => {
    const deleteRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "DELETE",
      headers,
    })
    const deleteData = await deleteRes.json()
    expect(deleteData.cart?.items?.length || 0).toBe(0)

    // Re-add for following checkout tests
    const reAdd = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ variant_id: targetVariant.id, quantity: 1 }),
    })
    const reAddData = await reAdd.json()
    expect(reAddData.cart?.items?.length).toBe(1)
  })

  it("4. Rejects an invalid promotion code", async () => {
    const promoRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ promo_codes: ["INVALID_PROMO_CODE_999"] }),
    })
    expect(promoRes.status).toBe(400)
  })

  it("5. Completes checkout with development payment provider", async () => {
    // Set Address
    await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: "asif.customer@example.com",
        shipping_address: {
          first_name: "Asif",
          last_name: "Shawon",
          address_1: "House 42, Road 11, Banani",
          city: "Dhaka",
          country_code: "bd",
          postal_code: "1213",
          phone: "+8801711223344",
        },
        billing_address: {
          first_name: "Asif",
          last_name: "Shawon",
          address_1: "House 42, Road 11, Banani",
          city: "Dhaka",
          country_code: "bd",
          postal_code: "1213",
          phone: "+8801711223344",
        },
      }),
    })

    // Add Shipping Option
    const shippingOptionsRes = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, { headers })
    const { shipping_options } = await shippingOptionsRes.json()
    const dhakaOption = shipping_options[0]

    await fetch(`${BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers,
      body: JSON.stringify({ option_id: dhakaOption.id }),
    })

    // Payment Session
    const paymentCollRes = await fetch(`${BACKEND_URL}/store/payment-collections`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cart_id: cartId }),
    })
    const { payment_collection } = await paymentCollRes.json()

    await fetch(`${BACKEND_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ provider_id: "pp_system_default" }),
    })

    // Complete
    const completeRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers,
    })
    const completeData = await completeRes.json()
    expect(completeData.type).toBe("order")
    expect(completeData.order?.id).toBeDefined()
  })
})
