"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { SearchModal } from "@components/store/search-modal"
import { MobileNavDrawer } from "./mobile-nav-drawer"
import { ResetDemoModal } from "./reset-demo-modal"
import {
  Header as SharedHeader,
  BuildingStorefrontIcon,
  createStoreNavigation,
} from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

export function StorefrontHeader() {
  const pathname = usePathname()
  const { itemsCount } = useDemoCart()
  const { setIsCartDrawerOpen } = useDemoStore()

  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render storefront header in admin routes
  if (pathname?.startsWith("/demo-admin")) {
    return null
  }

  const navItems = useMemo(() => {
    const items = createStoreNavigation(demoRoutes)
    return items.map((item) => ({
      ...item,
      isActive:
        pathname === item.href ||
        (item.href !== "/" && pathname?.startsWith(item.href)),
    }))
  }, [pathname])

  return (
    <>
      <SharedHeader
        navItems={navItems}
        homeHref="/"
        cartHref="/cart"
        cartCount={mounted ? itemsCount : 0}
        onCartClick={() => setIsCartDrawerOpen(true)}
        accountHref="/account"
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        linkComponent={Link}
        headerActionsSlot={
          <Link
            href="/demo-admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-heading font-semibold bg-brand-secondary hover:bg-brand-sand/40 text-brand-primary border border-brand-border transition-colors rounded-full uppercase tracking-wider"
            title="Open Simulated Demo Admin Dashboard"
          >
            <BuildingStorefrontIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>Demo Admin</span>
          </Link>
        }
      />

      {/* Modals & Slide-overs */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenReset={() => setIsResetOpen(true)}
        cartCount={itemsCount}
      />
      <ResetDemoModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </>
  )
}
