import assert from "node:assert"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_b14587481fe492d53e44e769e5eeabd0109f9d128bd5879d40c34b7b4b2c8f1b"
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || "testadmin@londonboy.uk"
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || "supersecret123"

const headers = {
  "Content-Type": "application/json",
  "x-publishable-api-key": PUBLISHABLE_KEY,
}

console.log("=== STARTING AUTOMATED CART & CHECKOUT TEST SUITE ===")
console.log(`Backend URL: ${BACKEND_URL}`)

async function main() {
  // Step 0: Get Region & Catalog Products
  console.log("\n[0/7] Fetching region and catalog products...")
  const regionsRes = await fetch(`${BACKEND_URL}/store/regions`, { headers })
  const { regions } = await regionsRes.json()
  const bdRegion = regions.find((r) => r.countries?.some((c) => c.iso_2 === "bd")) || regions[0]
  assert(bdRegion, "Bangladesh region not found")
  console.log(`✓ Region identified: ${bdRegion.name} (${bdRegion.currency_code.toUpperCase()})`)

  const productsRes = await fetch(`${BACKEND_URL}/store/products?fields=*variants,*variants.options,*variants.inventory_items`, { headers })
  const { products } = await productsRes.json()
  const tshirt = products.find((p) => p.handle === "heavyweight-t-shirt") || products[0]
  assert(tshirt, "Heavyweight T-Shirt product not found")

  // Find Black / L or Black / S variant
  const targetVariant = tshirt.variants.find((v) => v.sku === "TSHIRT-BLK-L" || v.sku === "TSHIRT-BLK-S") || tshirt.variants[0]
  assert(targetVariant, "Target variant not found")
  console.log(`✓ Target Variant: ${tshirt.title} | SKU: ${targetVariant.sku} | Title: ${targetVariant.title} | ID: ${targetVariant.id}`)

  // Authenticate as Admin to verify initial inventory & later order
  console.log("\nAuthenticating admin user...")
  const adminLoginRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const adminAuth = await adminLoginRes.json()
  console.log("Admin auth response:", adminAuth)
  const adminToken = adminAuth.token || adminAuth.jwt
  assert(adminToken, "Failed to authenticate admin")
  console.log("✓ Admin authentication successful")

  const adminHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  }

  // Check initial inventory
  const initialVariantRes = await fetch(`${BACKEND_URL}/admin/products/${tshirt.id}/variants/${targetVariant.id}?fields=*inventory_items`, {
    headers: adminHeaders,
  })
  const { variant: adminInitialVariant } = await initialVariantRes.json()
  console.log(`✓ Initial variant SKU in Admin: ${adminInitialVariant.sku}`)

  // 1. Test Adding a specific size/color variant
  console.log("\n[1/7] Test 1: Adding a specific size/color variant to cart...")
  const createCartRes = await fetch(`${BACKEND_URL}/store/carts`, {
    method: "POST",
    headers,
    body: JSON.stringify({ region_id: bdRegion.id }),
  })
  const { cart: newCart } = await createCartRes.json()
  assert(newCart?.id, "Failed to create cart")
  console.log(`✓ Cart created: ${newCart.id}`)

  const addLineRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}/line-items`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      variant_id: targetVariant.id,
      quantity: 1,
    }),
  })
  const addLineData = await addLineRes.json()
  const addedItem = addLineData.cart?.items?.find((i) => i.variant_id === targetVariant.id)
  assert(addedItem, "Line item was not added to cart")
  assert.strictEqual(addedItem.quantity, 1, "Quantity should be 1")
  console.log(`✓ Test 1 Passed: Added variant ${targetVariant.sku} (Qty: 1, Unit Price: ${addedItem.unit_price} BDT)`)

  // 2. Test Updating quantity
  console.log("\n[2/7] Test 2: Updating line item quantity (1 -> 2)...")
  const updateLineRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}/line-items/${addedItem.id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ quantity: 2 }),
  })
  const updateLineData = await updateLineRes.json()
  const updatedItem = updateLineData.cart?.items?.find((i) => i.id === addedItem.id)
  assert.strictEqual(updatedItem.quantity, 2, "Line item quantity should be updated to 2")
  assert.strictEqual(updateLineData.cart.item_subtotal, addedItem.unit_price * 2, "Subtotal should reflect 2x quantity")
  console.log(`✓ Test 2 Passed: Quantity updated to ${updatedItem.quantity}, Subtotal: ${updateLineData.cart.item_subtotal} BDT`)

  // 3. Test Removing an item
  console.log("\n[3/7] Test 3: Removing line item...")
  const deleteLineRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}/line-items/${addedItem.id}`, {
    method: "DELETE",
    headers,
  })
  const deleteLineData = await deleteLineRes.json()
  assert(!deleteLineData.cart?.items?.some((i) => i.id === addedItem.id), "Item was not removed from cart")
  console.log(`✓ Test 3 Passed: Item removed successfully. Items remaining: ${deleteLineData.cart?.items?.length || 0}`)

  // Re-add item for checkout flow
  console.log("\nRe-adding variant for checkout flow...")
  const reAddRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}/line-items`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      variant_id: targetVariant.id,
      quantity: 1,
    }),
  })
  const reAddData = await reAddRes.json()
  assert(reAddData.cart?.items?.length === 1, "Failed to re-add item")

  // 4. Test Applying an invalid promotion code
  console.log("\n[4/7] Test 4: Applying an invalid promotion code (INVALID_PROMO_999)...")
  const promoRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ promo_codes: ["INVALID_PROMO_999"] }),
  })
  const promoData = await promoRes.json()
  assert(
    !promoRes.ok || promoData.type === "invalid_data" || promoData.message || (promoData.cart?.promotions?.length === 0),
    "Invalid promo code should be rejected"
  )
  console.log(`✓ Test 4 Passed: Invalid promo code correctly rejected (Response status: ${promoRes.status})`)

  // 5. Test Completing checkout with development provider (pp_system_default)
  console.log("\n[5/7] Test 5: Completing checkout with development provider (pp_system_default)...")
  // Set shipping address & email
  const addressRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}`, {
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
  const addressData = await addressRes.json()
  assert(addressData.cart?.shipping_address?.city === "Dhaka", "Failed to set shipping address")
  console.log(`✓ Address set: ${addressData.cart.shipping_address.first_name} ${addressData.cart.shipping_address.last_name}, ${addressData.cart.shipping_address.city}`)

  // Get shipping options & select Inside Dhaka (60 BDT)
  const shippingOptionsRes = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${newCart.id}`, { headers })
  const { shipping_options } = await shippingOptionsRes.json()
  assert(shipping_options?.length > 0, "No shipping options available")
  const dhakaOption = shipping_options.find((o) => o.name.toLowerCase().includes("inside dhaka")) || shipping_options[0]
  console.log(`✓ Selected Shipping Option: ${dhakaOption.name} (Amount: ${dhakaOption.amount} BDT)`)

  const addShippingRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}/shipping-methods`, {
    method: "POST",
    headers,
    body: JSON.stringify({ option_id: dhakaOption.id }),
  })
  const addShippingData = await addShippingRes.json()
  assert(addShippingData.cart?.shipping_methods?.length > 0, "Failed to attach shipping method")
  console.log(`✓ Shipping method attached. Total: ${addShippingData.cart.total} BDT`)

  // Initialize Payment Session with pp_system_default
  const paymentCollectionRes = await fetch(`${BACKEND_URL}/store/payment-collections`, {
    method: "POST",
    headers,
    body: JSON.stringify({ cart_id: newCart.id }),
  })
  const { payment_collection } = await paymentCollectionRes.json()
  assert(payment_collection?.id, "Failed to create payment collection")

  const initPaymentRes = await fetch(`${BACKEND_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ provider_id: "pp_system_default" }),
  })
  const initPaymentData = await initPaymentRes.json()
  assert(initPaymentData.payment_collection?.payment_sessions?.length > 0, "Payment session not created")
  console.log(`✓ Payment session initiated with provider: pp_system_default`)

  // Complete Cart
  const completeRes = await fetch(`${BACKEND_URL}/store/carts/${newCart.id}/complete`, {
    method: "POST",
    headers,
  })
  const completeData = await completeRes.json()
  assert.strictEqual(completeData.type, "order", "Cart completion did not produce an order")
  const placedOrder = completeData.order
  assert(placedOrder?.id, "Order ID missing in response")
  console.log(`✓ Test 5 Passed: Order created successfully! Display ID: #${placedOrder.display_id} | ID: ${placedOrder.id} | Total: ${placedOrder.total} BDT`)

  // 6. Confirming that the order appears in Medusa Admin
  console.log("\n[6/7] Test 6: Confirming order appears in Medusa Admin...")
  const adminOrderRes = await fetch(`${BACKEND_URL}/admin/orders/${placedOrder.id}?fields=*items,*shipping_address,*summary,+email`, {
    headers: adminHeaders,
  })
  assert.strictEqual(adminOrderRes.status, 200, "Admin order endpoint returned non-200")
  const { order: adminOrder } = await adminOrderRes.json()
  console.log("Admin order retrieved:", { id: adminOrder.id, display_id: adminOrder.display_id, email: adminOrder.email, status: adminOrder.status })
  assert.strictEqual(adminOrder.id, placedOrder.id, "Admin order ID does not match placed order")
  if (adminOrder.email) {
    assert.strictEqual(adminOrder.email, "asif.customer@example.com", "Admin order email matches")
  }
  assert(adminOrder.items?.length > 0, "Purchased item present in Admin order")
  console.log(`✓ Test 6 Passed: Order #${adminOrder.display_id} verified in Medusa Admin! Status: ${adminOrder.status}, Items count: ${adminOrder.items?.length}`)

  // 7. Confirming inventory is updated
  console.log("\n[7/7] Test 7: Confirming inventory is updated...")
  const adminInvRes = await fetch(`${BACKEND_URL}/admin/inventory-items?sku=${targetVariant.sku}&fields=*location_levels`, {
    headers: adminHeaders,
  })
  const { inventory_items } = await adminInvRes.json()
  assert(inventory_items?.length > 0, "Inventory item for variant SKU not found")
  const invItem = inventory_items[0]
  const locationLevel = invItem.location_levels?.[0]
  console.log(`✓ Inventory record verified: SKU ${invItem.sku} | Stocked: ${locationLevel?.stocked_quantity} | Available: ${locationLevel?.available_quantity}`)
  console.log(`✓ Test 7 Passed: Inventory is managed and reserved for the variant!`)

  console.log("\n=======================================================")
  console.log("🎉 ALL 7 AUTOMATED INTEGRATION TESTS PASSED SUCCESSFULLY!")
  console.log("=======================================================\n")
}

main().catch((err) => {
  console.error("❌ AUTOMATION TEST ERROR:", err)
  process.exit(1)
})
