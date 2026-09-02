"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useDemoAdmin } from "@lib/demo-store-context"
import { ResetConfirmModal } from "./reset-confirm-modal"
import { MobileAdminNav } from "./mobile-admin-nav"
import {
  ShieldCheck,
  ArrowPath,
  BuildingStorefront,
  BarsThree,
  CircleStack,
} from "@medusajs/icons"

export function AdminHeader() {
  const { state } = useDemoAdmin()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate approximate serialized byte size in storage
  const storageByteSize = useMemo(() => {
    try {
      const json = JSON.stringify(state)
      const bytes = new Blob([json]).size
      if (bytes < 1024) return `${bytes} B`
      return `${(bytes / 1024).toFixed(1)} KB`
    } catch {
      return "~25 KB"
    }
  }, [state])

  return (
    <>
      <header className="bg-white border-b border-brand-border sticky top-0 z-30 shadow-sm">
        {/* Top Banner Notice */}
        <div className="bg-brand-secondary/80 border-b border-brand-border/60 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-brand-primary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold text-brand-accent uppercase tracking-wider">
              Demo Admin — changes are stored only in this browser.
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-grey-50 font-mono text-[10px]">
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <CircleStack className="w-3 h-3 text-brand-accent" />
              <span>Storage: {mounted ? storageByteSize : "~25 KB"}</span>
            </span>
            <span>•</span>
            <span>Key: london-boy:portfolio-demo:v1</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Mobile Menu & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 -ml-1 text-grey-60 hover:text-brand-primary lg:hidden rounded"
              aria-label="Open mobile menu"
            >
              <BarsThree className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider hidden sm:inline">
              London Boy Operations
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-brand-surface hover:bg-brand-secondary text-brand-primary border border-brand-border text-xs font-semibold flex items-center gap-1.5 rounded transition-colors"
            >
              <BuildingStorefront className="w-3.5 h-3.5 text-brand-accent" />
              <span>View Storefront</span>
            </Link>

            {/* Reset Store Action */}
            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 rounded transition-colors"
            >
              <ArrowPath className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals & Nav Drawers */}
      <ResetConfirmModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
      <MobileAdminNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  )
}
