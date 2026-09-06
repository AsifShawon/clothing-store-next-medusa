"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import {
  MobileNavDrawer as SharedMobileNavDrawer,
  createStoreNavigation,
} from "@dtc/storefront-ui"
import { ArrowPath, BuildingStorefront } from "@medusajs/icons"
import { demoRoutes } from "../../adapters/local-storage/routes"

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenSearch: () => void
  onOpenReset: () => void
  cartCount: number
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenReset,
  cartCount,
}: MobileNavDrawerProps) {
  const navItems = useMemo(() => createStoreNavigation(demoRoutes), [])

  return (
    <SharedMobileNavDrawer
      isOpen={isOpen}
      onClose={onClose}
      items={navItems}
      onOpenSearch={onOpenSearch}
      cartCount={cartCount}
      cartHref="/cart"
      accountHref="/account"
      linkComponent={Link}
      bottomSlot={
        <div className="space-y-3 pt-2">
          {/* Demo Admin Shortcut */}
          <Link
            href="/demo-admin"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 p-3 bg-brand-accent/5 hover:bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-heading font-semibold uppercase tracking-wider rounded transition-colors min-h-[44px]"
          >
            <BuildingStorefront className="w-4 h-4 text-brand-accent" />
            <span>Open Simulated Demo Admin</span>
          </Link>

          {/* Reset Demo Store Data Button */}
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenReset()
            }}
            className="w-full py-2.5 px-4 bg-white border border-brand-border hover:bg-rose-50 hover:text-rose-700 text-xs font-heading font-medium text-grey-70 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
          >
            <ArrowPath className="w-4 h-4 text-grey-50" />
            <span>Reset Demo Store Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("lb:reopen-demo-banner"))
              }
            }}
            className="w-full py-2 text-center text-xs font-heading text-brand-muted hover:text-brand-primary underline transition-colors"
          >
            Reopen Top Demo Notice
          </button>

          <div className="text-[10px] font-heading font-medium text-center text-grey-50 pt-1">
            London Boy Portfolio Demo • Zero Backend
          </div>
        </div>
      }
    />
  )
}
