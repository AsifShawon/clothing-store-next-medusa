/**
 * Unique Identifier Generation with crypto.randomUUID and deterministic seed helpers
 */

/**
 * Generate a UUIDv4 string safely across modern browsers, Node.js and legacy fallbacks
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  // Fallback for environments where crypto.randomUUID is not present
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate a prefixed entity ID (e.g. prod_8f1a..., ord_b2c4...)
 */
export function generateId(prefix: string): string {
  const shortUuid = generateUUID().replace(/-/g, "").substring(0, 12)
  return `${prefix}_${shortUuid}`
}

/**
 * Generate a customer-facing display order ID (e.g. LB-ORD-1001, LB-ORD-1002)
 */
export function generateDisplayOrderId(orderCount: number): string {
  return `LB-ORD-${1000 + orderCount + 1}`
}
