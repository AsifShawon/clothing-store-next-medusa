import React from "react"
import { OrderStatus, PaymentStatus } from "@lib/types"

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | "published" | "draft" | "active" | "inactive"
  type?: "order" | "payment" | "product" | "promo"
}

export function StatusBadge({ status, type = "order" }: StatusBadgeProps) {
  let badgeStyles = "bg-grey-20 text-grey-80 border-grey-30"

  switch (status) {
    case "delivered":
    case "paid":
    case "published":
    case "active":
      badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200"
      break
    case "shipped":
    case "processing":
      badgeStyles = "bg-sky-50 text-sky-700 border-sky-200"
      break
    case "pending":
      badgeStyles = "bg-amber-50 text-amber-700 border-amber-200"
      break
    case "canceled":
    case "refunded":
    case "inactive":
      badgeStyles = "bg-rose-50 text-rose-700 border-rose-200"
      break
    case "draft":
      badgeStyles = "bg-grey-10 text-grey-60 border-grey-20"
      break
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-none border ${badgeStyles}`}
    >
      {status}
    </span>
  )
}
