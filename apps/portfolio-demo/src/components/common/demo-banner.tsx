"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ResetDemoModal } from "./reset-demo-modal"
import { ArrowPath, BuildingStorefront, CogSixTooth, XMark } from "@medusajs/icons"

const STORAGE_KEY = "lb_demo_banner_dismissed"

export function DemoBanner() {
  const pathname = usePathname()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const isAdmin = pathname.startsWith("/demo-admin")
  const bannerRef = React.useRef<HTMLElement>(null)

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        if (window.sessionStorage.getItem(STORAGE_KEY) === "true") {
          setIsDismissed(true)
        }
      }
    } catch {
      // Storage unavailable or disabled
    }

    const handleReopen = () => {
      setIsDismissed(false)
      try {
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.removeItem(STORAGE_KEY)
        }
      } catch {}
    }

    window.addEventListener("lb:reopen-demo-banner", handleReopen)
    return () => {
      window.removeEventListener("lb:reopen-demo-banner", handleReopen)
    }
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return

    if (isDismissed || !bannerRef.current) {
      document.documentElement.style.setProperty("--demo-banner-offset", "0px")
      return
    }

    const updateHeight = () => {
      if (bannerRef.current) {
        const height = bannerRef.current.offsetHeight
        document.documentElement.style.setProperty("--demo-banner-offset", `${height}px`)
      } else {
        document.documentElement.style.setProperty("--demo-banner-offset", "0px")
      }
    }

    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    ro.observe(bannerRef.current)

    return () => {
      ro.disconnect()
      document.documentElement.style.setProperty("--demo-banner-offset", "0px")
    }
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--demo-banner-offset", "0px")
    }
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(STORAGE_KEY, "true")
      }
    } catch {
      // Storage unavailable
    }
  }

  if (isDismissed) {
    return <ResetDemoModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
  }

  return (
    <>
      <aside
        ref={bannerRef}
        aria-label="Demo announcement"
        className="bg-brand-primary text-white border-b border-brand-accent/20 text-xs py-2 px-3 sm:px-4 sticky top-0 z-40 transition-all duration-200"
      >
        <div className="content-container flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-heading font-semibold tracking-wider uppercase text-[10px] text-brand-secondary bg-brand-accent px-1.5 py-0.5 rounded-xs flex-shrink-0">
              Demo
            </span>
            <span className="text-grey-20 text-[11px] sm:text-xs font-heading font-medium truncate">
              Interactive demo — explore the store and sample checkout.
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isAdmin ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-heading font-semibold bg-brand-secondary text-brand-primary hover:bg-white transition-colors rounded-sm"
              >
                <BuildingStorefront className="w-3.5 h-3.5 text-brand-accent" />
                <span>View Storefront</span>
              </Link>
            ) : (
              <Link
                href="/demo-admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-heading font-semibold bg-brand-secondary text-brand-primary hover:bg-white transition-colors rounded-sm"
              >
                <CogSixTooth className="w-3.5 h-3.5 text-brand-accent" />
                <span>Demo Admin</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-heading text-grey-30 hover:text-white hover:bg-grey-80 transition-colors border border-grey-70 rounded-sm"
              title="Reset all demo state to original London Boy seed"
            >
              <ArrowPath className="w-3 h-3" />
              <span className="hidden xs:inline">Reset Data</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 sm:p-1.5 text-grey-30 hover:text-white hover:bg-white/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0"
              aria-label="Dismiss demo notice"
            >
              <XMark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <ResetDemoModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </>
  )
}
