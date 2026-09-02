"use client"

import React, { useState, useMemo } from "react"
import { useDemoStore } from "@lib/demo-store-context"
import { STORAGE_KEY } from "@lib/storage-repository"
import { formatDateTime } from "@lib/utils"
import { Server, ChevronDown, ArrowPath } from "@medusajs/icons"

export function StorageInspector() {
  const isDev = process.env.NODE_ENV === "development"
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { state, resetStore } = useDemoStore()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const stats = useMemo(() => {
    let serializedBytes = 0
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          serializedBytes = new Blob([raw]).size
        }
      }
    } catch {
      serializedBytes = 0
    }

    const totalVariants = state.products.reduce((sum, p) => sum + p.variants.length, 0)
    const totalInventoryUnits = state.products.reduce(
      (sum, p) => sum + p.variants.reduce((vs, v) => vs + (v.inventoryQuantity || 0), 0),
      0
    )

    return {
      serializedBytes,
      serializedKb: (serializedBytes / 1024).toFixed(2),
      productsCount: state.products.length,
      variantsCount: totalVariants,
      ordersCount: state.orders.length,
      customersCount: state.customers.length,
      cartItemsCount: state.cart.items.length,
      inventoryUnits: totalInventoryUnits,
      inventoryEventsCount: state.inventoryEvents.length,
      activityEventsCount: state.activityEvents.length,
    }
  }, [state])

  if (!isDev || !mounted) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans text-xs">
      {isOpen ? (
        <div className="bg-brand-primary text-white border border-grey-70 p-4 shadow-2xl w-80 space-y-3 animate-enter">
          <div className="flex items-center justify-between border-b border-grey-80 pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-brand-secondary">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Storage Inspector (Dev Mode)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-grey-40 hover:text-white p-1"
              aria-label="Collapse inspector"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] text-grey-30 font-mono">
            <div className="flex justify-between">
              <span>Key:</span>
              <span className="text-white truncate max-w-[140px]">{STORAGE_KEY}</span>
            </div>
            <div className="flex justify-between">
              <span>Schema Version:</span>
              <span className="text-emerald-400 font-bold">{state.schemaVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>Payload Size:</span>
              <span className="text-white">{stats.serializedKb} KB ({stats.serializedBytes} B)</span>
            </div>
            <div className="flex justify-between">
              <span>Products / SKUs:</span>
              <span className="text-white">{stats.productsCount} / {stats.variantsCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Warehouse Stock:</span>
              <span className="text-white">{stats.inventoryUnits} Units</span>
            </div>
            <div className="flex justify-between">
              <span>Orders Placed:</span>
              <span className="text-white">{stats.ordersCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Cart Items:</span>
              <span className="text-white">{stats.cartItemsCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Event Logs:</span>
              <span className="text-white">{stats.activityEventsCount + stats.inventoryEventsCount}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-grey-80 text-[10px]">
              <span>Last Sync:</span>
              <span className="text-grey-40">{formatDateTime(state.updatedAt)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-grey-80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => resetStore()}
              className="px-2.5 py-1 bg-rose-900 text-rose-100 hover:bg-rose-800 text-[10px] font-semibold flex items-center gap-1 transition-colors"
            >
              <ArrowPath className="w-3 h-3" />
              <span>Reset State</span>
            </button>
            <span className="text-[10px] text-grey-40">Development Only</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-brand-primary text-white border border-grey-70 px-3 py-1.5 shadow-lg flex items-center gap-2 hover:bg-grey-90 transition-colors"
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px]">Storage: {stats.serializedKb} KB</span>
          <ChevronDown className="w-3.5 h-3.5 text-grey-40 rotate-180" />
        </button>
      )}
    </div>
  )
}
