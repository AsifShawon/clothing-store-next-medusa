"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { AnnouncementBar } from "./announcement-bar"
import { SearchModal } from "@components/store/search-modal"
import { MobileNavDrawer } from "./mobile-nav-drawer"
import { ResetDemoModal } from "./reset-demo-modal"
import { Header as SharedHeader, BuildingStorefrontIcon } from "@dtc/storefront-ui"

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

  const navLinks = [
    { label: "Shop All", href: "/shop", isActive: pathname === "/shop" },
    { label: "New Arrivals", href: "/collection?handle=new-arrivals", isActive: pathname?.includes("new-arrivals") },
    { label: "Men", href: "/category?handle=men", isActive: pathname?.includes("handle=men") },
    { label: "Women", href: "/category?handle=women", isActive: pathname?.includes("handle=women") },
    { label: "Essentials", href: "/collection?handle=essentials", isActive: pathname?.includes("essentials") },
    { label: "Our Story", href: "/about", isActive: pathname === "/about" },
  ]

  return (
    <>
      <AnnouncementBar />

      <SharedHeader
        navLinks={navLinks}
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
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-brand-secondary hover:bg-brand-sand/60 text-brand-primary border border-brand-border transition-colors font-heading uppercase tracking-wider"
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
