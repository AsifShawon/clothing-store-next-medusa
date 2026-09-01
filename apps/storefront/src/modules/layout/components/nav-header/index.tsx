"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchModal from "../search-modal"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import SideMenu from "../side-menu"

type NavHeaderProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  cartCountNode?: React.ReactNode
}

export default function NavHeader({
  regions,
  locales,
  currentLocale,
  cartCountNode,
}: NavHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <header className="relative z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/80 transition-all duration-200">
        <nav className="content-container flex items-center justify-between h-20">
          {/* Left: Mobile Menu & Desktop Primary Navigation */}
          <div className="flex items-center gap-x-6 flex-1 basis-0">
            <div className="lg:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>

            <div className="hidden lg:flex items-center gap-x-7 text-xs font-semibold uppercase tracking-wider text-brand-primary">
              <LocalizedClientLink
                href="/store"
                className="hover:text-brand-accent transition-colors duration-150 py-2 border-b-2 border-transparent hover:border-brand-accent"
              >
                Shop All
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/collections/new-arrivals"
                className="hover:text-brand-accent transition-colors duration-150 py-2 border-b-2 border-transparent hover:border-brand-accent"
              >
                New Arrivals
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/men"
                className="hover:text-brand-accent transition-colors duration-150 py-2 border-b-2 border-transparent hover:border-brand-accent"
              >
                Men
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/women"
                className="hover:text-brand-accent transition-colors duration-150 py-2 border-b-2 border-transparent hover:border-brand-accent"
              >
                Women
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/collections/essentials"
                className="hover:text-brand-accent transition-colors duration-150 py-2 border-b-2 border-transparent hover:border-brand-accent"
              >
                The Essentials
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center: Brand Logotype */}
          <div className="flex flex-col items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="flex flex-col items-center group py-1"
              data-testid="nav-store-link"
            >
              <span className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-brand-primary font-bold group-hover:opacity-90 transition-opacity">
                LONDON BOY
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-heading tracking-[0.3em] text-brand-muted font-semibold -mt-0.5">
                EST. LONDON • DHAKA
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right: Actions (Search, Region, Account, Cart) */}
          <div className="flex items-center justify-end gap-x-4 sm:gap-x-6 flex-1 basis-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-accent p-2 transition-colors group"
              aria-label="Search catalog"
            >
              <svg
                className="w-4 h-4 text-brand-primary group-hover:text-brand-accent transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline font-heading uppercase tracking-wider text-[11px]">Search</span>
            </button>

            {/* Region / Currency Badge */}
            <div className="hidden sm:flex items-center text-[11px] font-semibold uppercase tracking-wider text-brand-primary/80 bg-brand-secondary/80 border border-brand-border px-2.5 py-1">
              <span>🇧🇩 BDT (৳)</span>
            </div>

            {/* Account Link */}
            <LocalizedClientLink
              href="/account"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold font-heading uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors"
              data-testid="nav-account-link"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden md:inline">Account</span>
            </LocalizedClientLink>

            {/* Cart Button */}
            {cartCountNode}
          </div>
        </nav>
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
