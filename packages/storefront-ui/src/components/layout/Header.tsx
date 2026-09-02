import React from "react"
import Link from "next/link"
import { BarsThreeIcon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from "../icons"
import { DesktopNav, NavLinkItem } from "./DesktopNav"

export interface HeaderProps {
  navLinks: NavLinkItem[]
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
  linkComponent?: React.ComponentType<{ href: string; className?: string; children?: React.ReactNode; [key: string]: unknown }>
}

export function Header({
  navLinks,
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
  linkComponent: LinkComp = Link,
}: HeaderProps) {
  return (
    <header className="relative z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/80 transition-all duration-200">
      <div className="content-container flex items-center justify-between h-16 sm:h-20">
        {/* Left: Mobile Menu & Desktop Primary Navigation */}
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

          <DesktopNav links={navLinks} linkComponent={LinkComp} />
        </div>

        {/* Center: Brand Logotype */}
        <div className="flex flex-col items-center justify-center">
          <LinkComp
            href={homeHref}
            className="flex flex-col items-center group py-1"
            data-testid="nav-store-link"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-[0.18em] text-brand-primary font-bold group-hover:opacity-90 transition-opacity">
              LONDON BOY
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-heading tracking-[0.3em] text-brand-muted font-semibold -mt-0.5">
              EST. LONDON • DHAKA
            </span>
          </LinkComp>
        </div>

        {/* Right: Actions (Search, Custom Slot, Account, Cart) */}
        <div className="flex items-center justify-end gap-x-3 sm:gap-x-5 flex-1 basis-0">
          {/* Search Trigger */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-accent p-2 transition-colors group"
              aria-label="Search catalog"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-brand-primary group-hover:text-brand-accent transition-colors" />
              <span className="hidden sm:inline font-heading uppercase tracking-wider text-[11px]">Search</span>
            </button>
          )}

          {/* Provider-specific Slot (e.g. Currency badge in Medusa, Demo Admin link in Demo) */}
          {headerActionsSlot}

          {/* Account Link */}
          <LinkComp
            href={accountHref}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold font-heading uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors p-2"
            data-testid="nav-account-link"
            aria-label="Customer Account"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden md:inline">Account</span>
          </LinkComp>

          {/* Cart Trigger: Custom Node or Standard Button */}
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
              <span className="text-xs font-semibold font-heading uppercase tracking-wider">
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
              <span className="text-xs font-semibold font-heading uppercase tracking-wider">
                Bag ({cartCount})
              </span>
            </LinkComp>
          )}
        </div>
      </div>
    </header>
  )
}
