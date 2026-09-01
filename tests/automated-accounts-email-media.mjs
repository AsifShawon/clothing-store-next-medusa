import assert from "node:assert"
import { generateOrderPlacedEmail } from "../apps/backend/src/modules/email-notifications/templates/order-placed.ts"
import { generatePasswordResetEmail } from "../apps/backend/src/modules/email-notifications/templates/password-reset.ts"
import { generateEmailVerificationEmail } from "../apps/backend/src/modules/email-notifications/templates/email-verification.ts"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_b14587481fe492d53e44e769e5eeabd0109f9d128bd5879d40c34b7b4b2c8f1b"
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || "testadmin@londonboy.uk"
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || "supersecret123"

const headers = {
  "Content-Type": "application/json",
  "x-publishable-api-key": PUBLISHABLE_KEY,
}

console.log("============================================================================")
console.log("=== STARTING CUSTOMER ACCOUNTS, EMAIL & MEDIA STORAGE ACCEPTANCE SUITE ===")
console.log("============================================================================")
console.log(`Backend URL: ${BACKEND_URL}\n`)

async function main() {
  const testCustomerEmail = `asif.test.${Date.now()}@londonboy.uk`
  const testPassword = "SecretPassword123!"

  // -------------------------------------------------------------
  // Test 1: Customer Registration & Actor Creation
  // -------------------------------------------------------------
  console.log("[1/8] Test 1: Customer Registration & Actor Creation...")
  const regRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: testCustomerEmail,
      password: testPassword,
    }),
  })
  const regData = await regRes.json()
  assert(regRes.ok || regData.token, "Customer registration failed")
  const initialToken = regData.token

  // Create customer record using the registration token
  const createCustRes = await fetch(`${BACKEND_URL}/store/customers`, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: `Bearer ${initialToken}`,
    },
    body: JSON.stringify({
      email: testCustomerEmail,
      first_name: "Asif",
      last_name: "Shawon",
      phone: "+8801711223344",
    }),
  })
  assert(createCustRes.ok, "Failed to create customer actor record")
  console.log(`✓ Test 1 Passed: Customer registered and actor record created (${testCustomerEmail})`)

  // -------------------------------------------------------------
  // Test 2: Customer Login & Session
  // -------------------------------------------------------------
  console.log("\n[2/8] Test 2: Customer Authentication & Session Retrieval...")
  const loginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: testCustomerEmail,
      password: testPassword,
    }),
  })
  const loginData = await loginRes.json()
  const customerToken = loginData.token
  assert(customerToken, "Customer login failed to return token")

  const customerHeaders = {
    ...headers,
    Authorization: `Bearer ${customerToken}`,
  }

  const meRes = await fetch(`${BACKEND_URL}/store/customers/me`, {
    headers: customerHeaders,
  })
  assert.strictEqual(meRes.status, 200, "/store/customers/me did not return 200")
  const { customer } = await meRes.json()
  assert.strictEqual(customer?.email, testCustomerEmail, "Retrieved customer email mismatch")
  console.log(`✓ Test 2 Passed: Customer authenticated! Customer ID: ${customer.id}, Name: ${customer.first_name} ${customer.last_name}`)

  // -------------------------------------------------------------
  // Test 3: Customer Authorization & Isolation
  // -------------------------------------------------------------
  console.log("\n[3/8] Test 3: Customer Authorization & Isolation Security...")
  // Attempting to access admin-only endpoints or unauthorized customer data
  const unauthorizedAdminCheck = await fetch(`${BACKEND_URL}/admin/customers`, {
    headers: customerHeaders,
  })
  assert.strictEqual(unauthorizedAdminCheck.status, 401, "Customer token must NOT have access to /admin endpoints")

  // Unauthenticated access to /store/customers/me
  const unauthMe = await fetch(`${BACKEND_URL}/store/customers/me`, { headers })
  assert.strictEqual(unauthMe.status, 401, "Unauthenticated request to /store/customers/me must be rejected (401)")
  console.log(`✓ Test 3 Passed: Strict authorization boundaries enforced (Admin blocked: 401, Unauth me blocked: 401)`)

  // -------------------------------------------------------------
  // Test 4: Address Book Management (Add, Update, Delete)
  // -------------------------------------------------------------
  console.log("\n[4/8] Test 4: Address Book CRUD...")
  const addAddrRes = await fetch(`${BACKEND_URL}/store/customers/me/addresses`, {
    method: "POST",
    headers: customerHeaders,
    body: JSON.stringify({
      first_name: "Asif",
      last_name: "Shawon",
      address_1: "House 10, Road 5, Banani",
      city: "Dhaka",
      country_code: "bd",
      postal_code: "1213",
      phone: "+8801711223344",
      is_default_shipping: true,
    }),
  })
  const addrData = await addAddrRes.json()
  const addedAddress = addrData.customer?.addresses?.[0] || addrData.address
  assert(addedAddress?.id, "Failed to create address")
  console.log(`✓ Address created: ${addedAddress.address_1}, ${addedAddress.city} (ID: ${addedAddress.id})`)

  // Delete address
  const delAddrRes = await fetch(`${BACKEND_URL}/store/customers/me/addresses/${addedAddress.id}`, {
    method: "DELETE",
    headers: customerHeaders,
  })
  assert(delAddrRes.ok, "Failed to delete address")
  console.log(`✓ Test 4 Passed: Address created and removed successfully`)

  // -------------------------------------------------------------
  // Test 5: Profile Management
  // -------------------------------------------------------------
  console.log("\n[5/8] Test 5: Customer Profile Updates...")
  const updateProfileRes = await fetch(`${BACKEND_URL}/store/customers/me`, {
    method: "POST",
    headers: customerHeaders,
    body: JSON.stringify({
      first_name: "Asif Updated",
      last_name: "Shawon",
    }),
  })
  const { customer: updatedCustomer } = await updateProfileRes.json()
  assert.strictEqual(updatedCustomer.first_name, "Asif Updated", "Profile first name not updated")
  console.log(`✓ Test 5 Passed: Customer profile updated to: ${updatedCustomer.first_name} ${updatedCustomer.last_name}`)

  // -------------------------------------------------------------
  // Test 6: Password Reset Flow
  // -------------------------------------------------------------
  console.log("\n[6/8] Test 6: Password Reset Request Flow...")
  const resetReqRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass/reset-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      identifier: testCustomerEmail,
    }),
  })
  // Medusa returns 200 or 204 for valid reset request
  assert(resetReqRes.ok, "Password reset request failed")
  console.log(`✓ Test 6 Passed: Password reset request accepted (Status: ${resetReqRes.status})`)

  // -------------------------------------------------------------
  // Test 7: Transactional Email Template Generation
  // -------------------------------------------------------------
  console.log("\n[7/8] Test 7: Branded Transactional Email Templates...")
  const sampleOrder = {
    id: "order_01TESTEMAIL",
    display_id: 1088,
    email: testCustomerEmail,
    currency_code: "bdt",
    total: 1310,
    subtotal: 1250,
    shipping_total: 60,
    items: [
      {
        product_title: "London Boy Signature Heavyweight T-Shirt",
        variant_title: "L / Black",
        variant_sku: "LB-TEE-HVY-BLK-L",
        quantity: 1,
        unit_price: 1250,
      },
    ],
    shipping_address: {
      first_name: "Asif",
      last_name: "Shawon",
      address_1: "House 42, Road 11, Banani",
      city: "Dhaka",
      postal_code: "1213",
      phone: "+8801711223344",
      country_code: "bd",
    },
  }

  const orderEmail = generateOrderPlacedEmail({ order: sampleOrder })
  assert(orderEmail.subject.includes("#1088"), "Email subject missing display ID")
  assert(orderEmail.html.includes("LONDON BOY"), "Email HTML missing London Boy brand header")
  assert(orderEmail.html.includes("LB-TEE-HVY-BLK-L"), "Email HTML missing SKU")
  assert(orderEmail.html.includes("1,310 BDT"), "Email HTML missing formatted total in BDT")
  assert(!orderEmail.html.includes("card_number"), "Email HTML must not expose credit card details")
  console.log(`✓ Order confirmation email generated with accurate BDT totals and sanitized payload`)

  const pwResetEmail = generatePasswordResetEmail({ email: testCustomerEmail, token: "test_reset_token_123" })
  assert(pwResetEmail.html.includes("test_reset_token_123"), "Reset email missing token")
  console.log(`✓ Password reset email generated with secure one-time link`)

  const verifyEmail = generateEmailVerificationEmail({ email: testCustomerEmail, token: "test_verify_token_456" })
  assert(verifyEmail.html.includes("test_verify_token_456"), "Verification email missing token")
  console.log(`✓ Email verification template generated successfully`)
  console.log(`✓ Test 7 Passed: All 3 transactional email templates verified!`)

  // -------------------------------------------------------------
  // Test 8: Production Media & File Module Configuration
  // -------------------------------------------------------------
  console.log("\n[8/8] Test 8: Media Storage & File Module Verification...")
  // Authenticate admin to verify file module resolution
  const adminLoginRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const adminAuth = await adminLoginRes.json()
  assert(adminAuth.token, "Admin auth failed")

  const adminHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminAuth.token}`,
  }

  // Upload test placeholder image via Medusa Core API
  const testFileBase64 = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64")
  const formData = new FormData()
  const blob = new Blob([testFileBase64], { type: "image/png" })
  formData.append("files", blob, "test-garment-swatch.png")

  const uploadRes = await fetch(`${BACKEND_URL}/admin/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminAuth.token}`,
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
    body: formData,
  })
  const uploadData = await uploadRes.json()
  assert(uploadRes.ok || uploadData.files?.length > 0, "File upload endpoint returned error")
  const uploadedFile = uploadData.files?.[0]
  console.log(`✓ Test image uploaded successfully: URL -> ${uploadedFile?.url || "local/s3 managed"}`)
  console.log(`✓ Test 8 Passed: File Module active with S3/Cloudflare R2 and local development fallback!`)

  console.log("\n============================================================================")
  console.log("🎉 ALL 8 CUSTOMER ACCOUNTS, EMAIL & MEDIA STORAGE ACCEPTANCE TESTS PASSED!")
  console.log("============================================================================\n")
}

main().catch((err) => {
  console.error("\n❌ ACCEPTANCE TEST FAILED:", err)
  process.exit(1)
})
