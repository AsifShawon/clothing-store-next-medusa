"use client"

import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import clsx from "clsx"
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
  isCompact?: boolean
  onCompactChange?: (compact: boolean) => void
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
  isCompact: controlledIsCompact,
  onCompactChange,
}: HeaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const [internalIsCompact, setInternalIsCompact] = useState(false)
  const isControlled = controlledIsCompact !== undefined
  const isCompact = isControlled ? controlledIsCompact : internalIsCompact

  const [expandedHeight, setExpandedHeight] = useState<number>(128)
  const [headerBottom, setHeaderBottom] = useState<number>(160)

  // Measure expanded header height to prevent Cumulative Layout Shift (CLS)
  useEffect(() => {
    if (!isCompact && headerRef.current) {
      const height = headerRef.current.offsetHeight
      if (height > 50) {
        setExpandedHeight(height)
      }
    }
  }, [isCompact])

  // Track header bottom coordinate for mega menu backdrops and panels
  useEffect(() => {
    const updateHeaderBottom = () => {
      if (headerRef.current) {
        setHeaderBottom(headerRef.current.getBoundingClientRect().bottom)
      }
    }
    updateHeaderBottom()
    window.addEventListener("resize", updateHeaderBottom)
    window.addEventListener("scroll", updateHeaderBottom, { passive: true })
    return () => {
      window.removeEventListener("resize", updateHeaderBottom)
      window.removeEventListener("scroll", updateHeaderBottom)
    }
  }, [isCompact])

  // Scroll detection via IntersectionObserver sentinel (zero unthrottled scroll listeners)
  useEffect(() => {
    if (isControlled) return
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0
        setInternalIsCompact(scrolledPast)
        onCompactChange?.(scrolledPast)
      },
      {
        root: null,
        rootMargin: "-24px 0px 0px 0px",
        threshold: 0,
      }
    )

    observer.observe(sentinel)
    return () => {
      observer.disconnect()
    }
  }, [isControlled, onCompactChange])

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ minHeight: isCompact && expandedHeight ? `${expandedHeight}px` : undefined }}
    >
      {/* 1. Slim Announcement Bar - normal document flow (scrolls away) */}
      {announcementText && (
        <div className="bg-brand-primary text-brand-secondary text-[11px] font-heading font-medium tracking-wide py-2 px-4 text-center border-b border-white/10">
          <div className="content-container flex items-center justify-center gap-2">
            <span>{announcementText}</span>
          </div>
        </div>
      )}


      {/* Header Element */}
      <header
        ref={headerRef}
        data-compact={isCompact ? "true" : "false"}
        className={clsx(
          "transition-all duration-250 ease-luxury motion-reduce:transition-none motion-reduce:transform-none",
          isCompact
            ? "fixed top-2 sm:top-2.5 lg:top-3 inset-x-2.5 sm:inset-x-4 lg:inset-x-6 z-40 max-w-[1440px] mx-auto bg-white/[0.96] backdrop-blur-md rounded-xl sm:rounded-2xl border border-neutral-900/10 shadow-[0_8px_30px_rgba(0,0,0,0.07)] px-3 sm:px-5 lg:px-6 animate-floating-nav"
            : "relative z-40 bg-white border-b border-brand-border/80 w-full"
        )}
      >
        {/* 2. Utility / Main Navigation Row */}
        <div
          className={clsx(
            "flex items-center justify-between transition-all duration-250 ease-luxury",
            isCompact
              ? "h-[54px] sm:h-[58px] lg:h-[62px] w-full"
              : "content-container h-16 sm:h-20 border-b border-brand-border/40"
          )}
        >
          {/* Left Slot: Mobile Menu & Secondary Links / Compact Logo */}
          <div
            className={clsx(
              "flex items-center",
              isCompact ? "gap-x-3 sm:gap-x-4 max-w-fit flex-initial" : "gap-x-6 flex-1 basis-0"
            )}
          >
            {mobileMenuSlot ? (
              <div className="lg:hidden">{mobileMenuSlot}</div>
            ) : onOpenMobileMenu ? (
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="p-2 -ml-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  aria-label="Open navigation menu"
                >
                  <BarsThreeIcon className="w-6 h-6" />
                </button>
              </div>
            ) : null}

            {/* In Expanded mode on Desktop: Secondary Links */}
            {!isCompact && (
              <nav
                aria-label="Secondary navigation"
                className="hidden lg:flex items-center gap-5 text-xs font-heading font-medium text-brand-primary/70"
              >
                {secondaryLinks.map((link) => (
                  <LinkComp
                    key={link.href}
                    href={link.href}
                    className="hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded px-1"
                  >
                    {link.label}
                  </LinkComp>
                ))}
              </nav>
            )}

            {/* In Compact mode on Desktop: Compact Logo on the Left */}
            {isCompact && (
              <LinkComp
                href={homeHref}
                className="hidden lg:flex flex-col group py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                data-testid="nav-store-link"
                aria-label="London Boy Home"
              >
                <span className="font-display text-xl tracking-[0.16em] text-brand-primary font-normal group-hover:opacity-90 transition-opacity whitespace-nowrap">
                  LONDON BOY
                </span>
                <span className="hidden xl:block text-[8px] uppercase font-heading tracking-[0.28em] text-brand-muted font-semibold -mt-0.5 whitespace-nowrap">
                  EST. LONDON • DHAKA
                </span>
              </LinkComp>
            )}
          </div>

          {/* Center Slot: Logo (Expanded Desktop / All Mobile) OR Categories (Compact Desktop) */}
          <div
            className={clsx(
              "flex items-center justify-center",
              isCompact ? "flex-1 px-2 lg:px-4 overflow-hidden" : ""
            )}
          >
            {/* On Mobile (< lg): Always the Centered Brand Logotype */}
            <div className="lg:hidden flex flex-col items-center justify-center">
              <LinkComp
                href={homeHref}
                className="flex flex-col items-center group py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                data-testid="nav-store-link"
                aria-label="London Boy Home"
              >
                <span
                  className={clsx(
                    "font-display tracking-[0.18em] text-brand-primary font-normal group-hover:opacity-90 transition-all duration-200 whitespace-nowrap",
                    isCompact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
                  )}
                >
                  LONDON BOY
                </span>
                {!isCompact && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-heading tracking-[0.32em] text-brand-muted font-semibold -mt-0.5 whitespace-nowrap">
                    EST. LONDON • DHAKA
                  </span>
                )}
              </LinkComp>
            </div>

            {/* On Desktop (lg+):
                If !isCompact: Large Centered Brand Logotype
                If isCompact: Category Navigation (DesktopNav) */}
            {!isCompact ? (
              <div className="hidden lg:flex flex-col items-center justify-center">
                <LinkComp
                  href={homeHref}
                  className="flex flex-col items-center group py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  data-testid="nav-store-link"
                  aria-label="London Boy Home"
                >
                  <span className="font-display text-2xl sm:text-3xl tracking-[0.2em] text-brand-primary font-normal group-hover:opacity-90 transition-opacity whitespace-nowrap">
                    LONDON BOY
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-heading tracking-[0.32em] text-brand-muted font-semibold -mt-0.5 whitespace-nowrap">
                    EST. LONDON • DHAKA
                  </span>
                </LinkComp>
              </div>
            ) : (
              <div className="hidden lg:flex items-center justify-center h-full w-full">
                <DesktopNav
                  items={navItems}
                  links={navLinks}
                  linkComponent={LinkComp}
                  backdropTop={headerBottom}
                  isCompact={true}
                />
              </div>
            )}
          </div>

          {/* Right Slot: Actions (Search, Provider Slot, Account, Bag) */}
          <div
            className={clsx(
              "flex items-center justify-end",
              isCompact ? "gap-x-1 sm:gap-x-2.5 max-w-fit flex-initial" : "gap-x-2 sm:gap-x-4 flex-1 basis-0"
            )}
          >
            {/* Search Trigger */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 text-xs font-heading font-semibold text-brand-primary hover:text-brand-accent p-2 transition-colors group min-w-[44px] min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                aria-label="Search catalog"
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-brand-primary group-hover:text-brand-accent transition-colors" />
                <span
                  className={clsx(
                    "uppercase tracking-wider text-[11px]",
                    isCompact ? "hidden xl:inline" : "hidden sm:inline"
                  )}
                >
                  Search
                </span>
              </button>
            )}

            {/* Provider-specific Slot (e.g. Currency badge in Medusa, Demo Admin link in Demo) */}
            {headerActionsSlot}

            {/* Account Link */}
            <LinkComp
              href={accountHref}
              className={clsx(
                "items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors p-2 min-w-[44px] min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded",
                isCompact ? "hidden lg:flex" : "hidden sm:flex"
              )}
              data-testid="nav-account-link"
              aria-label="Customer Account"
            >
              <UserIcon className="w-4 h-4" />
              <span
                className={clsx(
                  "text-[11px]",
                  isCompact ? "hidden xl:inline" : "hidden md:inline"
                )}
              >
                Account
              </span>
            </LinkComp>

            {/* Cart Trigger (State preserved; never unmounted) */}
            {cartCountNode ? (
              cartCountNode
            ) : onCartClick ? (
              <button
                type="button"
                onClick={onCartClick}
                className="relative p-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2 min-w-[44px] min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
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
                className="relative p-2 text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2 min-w-[44px] min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
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

        {/* 3. Primary Category Navigation Row with Mega Panels (Expanded Desktop only) */}
        {!isCompact && (
          <div className="hidden lg:flex items-center justify-center h-12 border-t border-brand-border/30 bg-white">
            <DesktopNav
              items={navItems}
              links={navLinks}
              linkComponent={LinkComp}
              backdropTop={headerBottom}
              isCompact={false}
            />
          </div>
        )}
      </header>

      {/* Observer Sentinel - placed right at the boundary where expanded header leaves viewport */}
      <div
        ref={sentinelRef}
        className="h-px w-full pointer-events-none absolute bottom-0"
        aria-hidden="true"
      />
    </div>
  )
}
