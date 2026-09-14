"use client"

import { useState, useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Header as SharedHeader, createStoreNavigation } from "@dtc/storefront-ui"
import { createMedusaRoutes } from "@adapters/medusa/routes"
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

  const routes = useMemo(() => createMedusaRoutes("bd"), [])
  const navItems = useMemo(() => createStoreNavigation(routes), [routes])

  return (
    <>
      <SharedHeader
        navItems={navItems}
        homeHref="/"
        cartHref="/cart"
        accountHref="/account"
        cartCountNode={cartCountNode}
        onOpenSearch={() => setIsSearchOpen(true)}
        linkComponent={LocalizedClientLink}
        mobileMenuSlot={<SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />}
        headerActionsSlot={
          <div className="hidden sm:flex items-center text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-primary/80 bg-brand-secondary/80 border border-brand-border px-3 py-1 rounded-full">
            <span>BDT (৳)</span>
          </div>
        }
      />

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
