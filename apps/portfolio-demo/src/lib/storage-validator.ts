import { DemoStoreState } from "./types"
import { DEMO_SCHEMA_VERSION, createInitialSeedState } from "./seed-catalog"

export interface ValidationResult {
  isValid: boolean
  state: DemoStoreState
  migrated: boolean
  repaired: boolean
  error?: string
}

/**
 * Validate and sanitize loaded state object
 */
export function validateAndSanitizeState(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      isValid: false,
      state: createInitialSeedState(),
      migrated: false,
      repaired: true,
      error: "State is not a valid JSON object",
    }
  }

  const obj = raw as Partial<DemoStoreState>
  let repaired = false
  let migrated = false

  // Check and handle schema migration
  const version = typeof obj.schemaVersion === "number" ? obj.schemaVersion : 0
  if (version < DEMO_SCHEMA_VERSION) {
    // Future migration hook keyed by schemaVersion
    migrated = true
  }

  // Sanity check core array structures with seed fallbacks
  const seed = createInitialSeedState()
  const products = Array.isArray(obj.products) && obj.products.length > 0 ? obj.products : (repaired = true, seed.products)
  const categories = Array.isArray(obj.categories) && obj.categories.length > 0 ? obj.categories : (repaired = true, seed.categories)
  const collections = Array.isArray(obj.collections) && obj.collections.length > 0 ? obj.collections : (repaired = true, seed.collections)
  const customers = Array.isArray(obj.customers) && obj.customers.length > 0 ? obj.customers : (repaired = true, seed.customers)
  const orders = Array.isArray(obj.orders) ? obj.orders : (repaired = true, seed.orders)
  const promotions = Array.isArray(obj.promotions) && obj.promotions.length > 0 ? obj.promotions : (repaired = true, seed.promotions)
  const shippingOptions = Array.isArray(obj.shippingOptions) && obj.shippingOptions.length > 0 ? obj.shippingOptions : (repaired = true, seed.shippingOptions)
  const inventoryEvents = Array.isArray(obj.inventoryEvents) ? obj.inventoryEvents : (repaired = true, [])
  const activityEvents = Array.isArray(obj.activityEvents) ? obj.activityEvents : (repaired = true, [])

  // Validate settings
  const defaultSettings = createInitialSeedState().settings
  const settings = obj.settings && typeof obj.settings === "object"
    ? {
        storeName: obj.settings.storeName || defaultSettings.storeName,
        currencyCode: obj.settings.currencyCode || defaultSettings.currencyCode,
        countryCode: obj.settings.countryCode || defaultSettings.countryCode,
        warehouseName: obj.settings.warehouseName || defaultSettings.warehouseName,
        warehouseAddress: obj.settings.warehouseAddress || defaultSettings.warehouseAddress,
        supportEmail: obj.settings.supportEmail || defaultSettings.supportEmail,
        supportPhone: obj.settings.supportPhone || defaultSettings.supportPhone,
        lowStockThreshold: typeof obj.settings.lowStockThreshold === "number" ? obj.settings.lowStockThreshold : defaultSettings.lowStockThreshold,
      }
    : (repaired = true, defaultSettings)

  // Validate cart
  const cart = obj.cart && typeof obj.cart === "object" && Array.isArray(obj.cart.items)
    ? {
        items: obj.cart.items.filter((item) => item && typeof item.unitPrice === "number" && item.quantity > 0),
        appliedPromotionCode: obj.cart.appliedPromotionCode,
        updatedAt: obj.cart.updatedAt || new Date().toISOString(),
      }
    : (repaired = true, { items: [], appliedPromotionCode: undefined, updatedAt: new Date().toISOString() })

  // Clean products to guarantee no negative inventory and sanitize images (strip any base64 / binary)
  const sanitizedProducts = products.map((p) => {
    const images = Array.isArray(p.images)
      ? p.images.filter((img) => typeof img === "string" && !img.startsWith("data:"))
      : []

    const thumbnail = typeof p.thumbnail === "string" && !p.thumbnail.startsWith("data:")
      ? p.thumbnail
      : images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"

    const variants = Array.isArray(p.variants)
      ? p.variants.map((v) => ({
          ...v,
          price: Math.max(0, Number(v.price) || 0),
          inventoryQuantity: Math.max(0, Number(v.inventoryQuantity) || 0),
          manageInventory: typeof v.manageInventory === "boolean" ? v.manageInventory : true,
        }))
      : []

    return {
      ...p,
      thumbnail,
      images: images.length > 0 ? images : [thumbnail],
      variants,
    }
  })

  const validatedState: DemoStoreState = {
    schemaVersion: DEMO_SCHEMA_VERSION,
    initializedAt: obj.initializedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    products: sanitizedProducts,
    categories,
    collections,
    customers,
    currentCustomerId: obj.currentCustomerId || customers[0].id,
    cart,
    orders,
    promotions,
    shippingOptions,
    settings,
    inventoryEvents: inventoryEvents.slice(0, 50), // keep bounded at 50 events
    activityEvents: activityEvents.slice(0, 50),   // keep bounded at 50 events
  }

  return {
    isValid: !repaired && !migrated,
    state: validatedState,
    migrated,
    repaired,
  }
}
