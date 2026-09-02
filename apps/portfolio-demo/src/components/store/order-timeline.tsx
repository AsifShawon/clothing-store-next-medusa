import React from "react"
import { DemoOrderStatus } from "@lib/types"
import { Check, TruckFast, ShoppingBag, XMark } from "@medusajs/icons"

interface OrderTimelineProps {
  status: DemoOrderStatus
  createdAt: string
}

export function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  if (status === "canceled") {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
        <div className="p-2 bg-rose-600 text-white rounded-full">
          <XMark className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold block">Order Canceled</span>
          <span className="text-[11px] text-rose-700">
            This demo order was canceled. Allocated inventory was returned to the Dhaka Central Warehouse.
          </span>
        </div>
      </div>
    )
  }

  const steps = [
    { key: "pending", label: "Order Placed", desc: "Received at Dhaka hub" },
    { key: "processing", label: "Processing & Quality Check", desc: "Garments packaged" },
    { key: "shipped", label: "Dispatched", desc: "In transit with courier" },
    { key: "delivered", label: "Delivered", desc: "Handed to recipient" },
  ]

  const statusOrder: Record<DemoOrderStatus, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    canceled: -1,
  }

  const currentLevel = statusOrder[status] ?? 0

  return (
    <div className="bg-white border border-brand-border p-6 space-y-4">
      <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3">
        Fulfillment Status Timeline
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
        {steps.map((step, idx) => {
          const isDone = idx <= currentLevel
          const isCurrent = idx === currentLevel

          return (
            <div key={step.key} className="flex sm:flex-col items-start gap-3 sm:gap-2 relative">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-brand-accent text-white"
                    : "bg-brand-secondary text-grey-40 border border-brand-border"
                } ${isCurrent ? "ring-2 ring-brand-accent ring-offset-2" : ""}`}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>

              <div>
                <span
                  className={`text-xs block font-semibold ${
                    isDone ? "text-brand-primary font-bold" : "text-grey-40"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[11px] text-grey-50 block mt-0.5">{step.desc}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
