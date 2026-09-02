"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { AnnouncementBar } from "./announcement-bar"
import { SearchModal } from "@components/store/search-modal"
import { MobileNavDrawer } from "./mobile-nav-drawer"
import { ResetDemoModal } from "./reset-demo-modal"
import {
  MagnifyingGlass,
  ShoppingBag,
  User,
  BarsThree,
  BuildingStorefront,
} from "@medusajs/icons"

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
    { label: "Shop All", href: "/shop" },
    { label: "New Arrivals", href: "/collection?handle=new-arrivals" },
    { label: "Men", href: "/category?handle=men" },
    { label: "Women", href: "/category?handle=women" },
    { label: "Essentials", href: "/collection?handle=essentials" },
    { label: "Our Story", href: "/about" },
  ]

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border transition-all">
        <div className="content-container">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 -ml-2 text-brand-primary hover:text-brand-accent transition-colors"
                aria-label="Open navigation menu"
              >
                <BarsThree className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex flex-col items-start">
                <span className="font-display text-xl sm:text-2xl font-normal tracking-tight text-brand-primary uppercase group-hover:text-brand-accent transition-colors">
                  London Boy
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-widest text-grey-50 uppercase -mt-1">
                  Dhaka • London
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-brand-primary">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/shop" && pathname?.includes(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-2 transition-colors hover:text-brand-accent ${
                      isActive ? "text-brand-accent font-bold" : "text-brand-primary"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent animate-fade-in" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right: Actions (Search, Admin, Account, Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1.5"
                aria-label="Search products"
              >
                <MagnifyingGlass className="w-5 h-5" />
                <span className="hidden xl:inline text-xs font-medium text-grey-50">Search</span>
              </button>

              {/* Demo Admin Badge Link */}
              <Link
                href="/demo-admin"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-brand-secondary hover:bg-brand-sand/60 text-brand-primary border border-brand-border rounded transition-colors"
                title="Open Simulated Demo Admin Dashboard"
              >
                <BuildingStorefront className="w-3.5 h-3.5 text-brand-accent" />
                <span>Demo Admin</span>
              </Link>

              {/* Account Link */}
              <Link
                href="/account"
                className="p-2 text-brand-primary hover:text-brand-accent transition-colors"
                aria-label="Customer Account"
                title="Customer Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2"
                aria-label={`Shopping bag containing ${mounted ? itemsCount : 0} items`}
                suppressHydrationWarning
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && itemsCount > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-enter">
                    {itemsCount}
                  </span>
                )}
                <span className="hidden md:inline text-xs font-bold text-brand-primary" suppressHydrationWarning>
                  Bag {mounted && itemsCount > 0 ? `(${itemsCount})` : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
