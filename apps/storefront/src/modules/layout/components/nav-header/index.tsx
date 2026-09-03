"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Header as SharedHeader } from "@dtc/storefront-ui"
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

  const navLinks = [
    { label: "Shop All", href: "/store" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Men", href: "/categories/men" },
    { label: "Women", href: "/categories/women" },
    { label: "The Essentials", href: "/collections/essentials" },
  ]

  return (
    <>
      <SharedHeader
        navLinks={navLinks}
        homeHref="/"
        cartHref="/cart"
        accountHref="/account"
        cartCountNode={cartCountNode}
        onOpenSearch={() => setIsSearchOpen(true)}
        linkComponent={LocalizedClientLink}
        mobileMenuSlot={<SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />}
        headerActionsSlot={
          <div className="hidden sm:flex items-center text-[11px] font-semibold uppercase tracking-wider text-brand-primary/80 bg-brand-secondary/80 border border-brand-border px-2.5 py-1">
            <span>🇧🇩 BDT (৳)</span>
          </div>
        }
      />

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
