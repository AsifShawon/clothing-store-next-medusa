"use client"

import React from "react"
import Link from "next/link"
import { BarsThreeIcon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from "../icons"
import { DesktopNav, NavLinkItem } from "./DesktopNav"
import { MegaNavItem } from "./navigation-model"
import { LinkComponent } from "../../types"

export interface HeaderProps {
  navLinks?: NavLinkItem[]
  navItems?: MegaNavItem[]
  homeHref?: string
  cartHref?: string
  cartCount?: number
  cartCountNode?: React.ReactNode
  onCartClick?: () => void
  accountHref?: string
  onOpenSearch?: () => void
  onOpenMobileMenu?: () => void
  mobileMenuSlot?: React.ReactNode
  headerActionsSlot?: React.ReactNode
  announcementText?: string
  secondaryLinks?: Array<{ label: string; href: string }>
  linkComponent?: LinkComponent
}

export function Header({
  navLinks,
  navItems,
  homeHref = "/",
  cartHref = "/cart",
  cartCount = 0,
  cartCountNode,
  onCartClick,
  accountHref = "/account",
  onOpenSearch,
  onOpenMobileMenu,
  mobileMenuSlot,
  headerActionsSlot,
  announcementText = "Complimentary Dhaka Express Delivery on Orders Over ৳2,000 • 24h Easy Exchanges",
  secondaryLinks = [
    { label: "Our Story", href: "/about" },
    { label: "Care & Support", href: "/contact" },
  ],
  linkComponent: LinkComp = Link,
}: HeaderProps) {
  return (
    <header className="relative z-40 bg-white border-b border-brand-border/80 transition-all duration-200">
      {/* 1. Slim Announcement Bar */}
      {announcementText && (
        <div className="bg-brand-primary text-brand-secondary text-[11px] font-heading font-medium tracking-wide py-2 px-4 text-center border-b border-white/10">
          <div className="content-container flex items-center justify-center gap-2">
            <span>{announcementText}</span>
          </div>
        </div>
      )}

      {/* 2. Utility Row: Secondary links, Centered Logo, and Actions */}
      <div className="content-container flex items-center justify-between h-16 sm:h-20 border-b border-brand-border/40">
        {/* Left: Mobile Menu Trigger & Secondary Desktop Links */}
        <div className="flex items-center gap-x-6 flex-1 basis-0">
          {mobileMenuSlot ? (
            <div className="lg:hidden">{mobileMenuSlot}</div>
          ) : onOpenMobileMenu ? (
            <div className="lg:hidden">
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="p-2 -ml-2 text-brand-primary hover:text-brand-accent transition-colors"
                aria-label="Open navigation menu"
              >
                <BarsThreeIcon className="w-6 h-6" />
              </button>
            </div>
          ) : null}

          {/* Secondary Desktop Utility Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-heading font-medium text-brand-primary/70">
            {secondaryLinks.map((link) => (
              <LinkComp
                key={link.href}
                href={link.href}
                className="hover:text-brand-primary transition-colors"
              >
                {link.label}
              </LinkComp>
            ))}
          </nav>
        </div>

        {/* Center: Brand Logotype */}
        <div className="flex flex-col items-center justify-center">
          <LinkComp
            href={homeHref}
            className="flex flex-col items-center group py-1"
            data-testid="nav-store-link"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-[0.2em] text-brand-primary font-normal group-hover:opacity-90 transition-opacity">
              LONDON BOY
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-heading tracking-[0.32em] text-brand-muted font-semibold -mt-0.5">
              EST. LONDON • DHAKA
            </span>
          </LinkComp>
        </div>

        {/* Right: Actions (Search, Custom Slot, Account, Bag) */}
        <div className="flex items-center justify-end gap-x-2 sm:gap-x-4 flex-1 basis-0">
          {/* Search Trigger */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 text-xs font-heading font-semibold text-brand-primary hover:text-brand-accent p-2 transition-colors group"
              aria-label="Search catalog"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-brand-primary group-hover:text-brand-accent transition-colors" />
              <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Search</span>
            </button>
          )}

          {/* Provider-specific Slot (e.g. Currency badge in Medusa, Demo Admin link in Demo) */}
          {headerActionsSlot}

          {/* Account Link */}
          <LinkComp
            href={accountHref}
            className="hidden sm:flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors p-2"
            data-testid="nav-account-link"
            aria-label="Customer Account"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Account</span>
          </LinkComp>

          {/* Cart Trigger */}
          {cartCountNode ? (
            cartCountNode
          ) : onCartClick ? (
            <button
              type="button"
              onClick={onCartClick}
              className="relative p-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2"
              aria-label={`Shopping bag with ${cartCount} items`}
              data-testid="nav-cart-link"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[11px]">
                Bag ({cartCount})
              </span>
            </button>
          ) : (
            <LinkComp
              href={cartHref}
              className="relative p-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2"
              aria-label={`Shopping bag with ${cartCount} items`}
              data-testid="nav-cart-link"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[11px]">
                Bag ({cartCount})
              </span>
            </LinkComp>
          )}
        </div>
      </div>

      {/* 3. Primary Category Navigation Row with Mega Panels (Desktop) */}
      <div className="hidden lg:flex items-center justify-center h-12 border-t border-brand-border/30 bg-white">
        <DesktopNav
          items={navItems}
          links={navLinks}
          linkComponent={LinkComp}
        />
      </div>
    </header>
  )
}
