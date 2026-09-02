"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ResetDemoModal } from "./reset-demo-modal"
import { ArrowPath, BuildingStorefront, CogSixTooth } from "@medusajs/icons"

export function DemoBanner() {
  const pathname = usePathname()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const isAdmin = pathname.startsWith("/demo-admin")

  return (
    <>
      <div className="bg-brand-primary text-white border-b border-brand-accent/30 text-xs py-2 px-4 sticky top-0 z-40">
        <div className="content-container flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-[10px] text-brand-secondary bg-brand-accent px-1.5 py-0.5">
              Portfolio Demo
            </span>
            <span className="hidden sm:inline text-grey-20 text-[11px]">
              Browser-only simulation using versioned local storage. Zero backend / cloud requirements.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-brand-secondary text-brand-primary hover:bg-white transition-colors"
              >
                <BuildingStorefront className="w-3.5 h-3.5 text-brand-accent" />
                <span>View Storefront</span>
              </Link>
            ) : (
              <Link
                href="/demo-admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-brand-secondary text-brand-primary hover:bg-white transition-colors"
              >
                <CogSixTooth className="w-3.5 h-3.5 text-brand-accent" />
                <span>Demo Admin</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-grey-30 hover:text-white hover:bg-grey-80 transition-colors border border-grey-70"
              title="Reset all demo state to original London Boy seed"
            >
              <ArrowPath className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      <ResetDemoModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </>
  )
}
