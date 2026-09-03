import clsx, { ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format price in Bangladeshi Taka (BDT)
 */
export function formatBDT(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "৳0"
  }
  return `৳${Math.round(amount).toLocaleString("en-BD")}`
}

/**
 * Format Date to readable string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
  } catch {
    return dateString
  }
}

/**
 * Format Date with time (deterministic UTC)
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    })
  } catch {
    return dateString
  }
}

/**
 * Generate unique IDs
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`
}

/**
 * Generate human readable Order ID
 */
export function generateOrderId(orderIndex: number): string {
  return `LB-ORD-${1000 + orderIndex + 1}`
}
