import React, { useEffect } from "react"
import Link from "next/link"
import { Drawer } from "../ui/drawer"
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from "../icons"

export interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  links: Array<{ label: string; href: string }>
  onOpenSearch?: () => void
  cartCount?: number
  cartHref?: string
  accountHref?: string
  bottomSlot?: React.ReactNode
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode; onClick?: () => void }>
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  links,
  onOpenSearch,
  cartCount = 0,
  cartHref = "/cart",
  accountHref = "/account",
  bottomSlot,
  linkComponent: LinkComp = Link,
}: MobileNavDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      title="Menu"
      maxWidth="sm"
    >
      <div className="flex flex-col justify-between h-full space-y-6">
        {/* Navigation Links */}
        <nav className="flex flex-col divide-y divide-brand-border/60">
          {links.map((link) => (
            <LinkComp
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="py-3.5 text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors"
            >
              {link.label}
            </LinkComp>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="space-y-4 pt-4 border-t border-brand-border">
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenSearch()
              }}
              className="w-full flex items-center gap-3 p-3 bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:bg-brand-secondary transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-brand-accent" />
              <span>Search Garments</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <LinkComp
              href={accountHref}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3 bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:bg-brand-secondary transition-colors"
            >
              <UserIcon className="w-4 h-4 text-brand-accent" />
              <span>Account</span>
            </LinkComp>

            <LinkComp
              href={cartHref}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3 bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:bg-brand-secondary transition-colors"
            >
              <ShoppingBagIcon className="w-4 h-4 text-brand-accent" />
              <span>Bag ({cartCount})</span>
            </LinkComp>
          </div>

          {bottomSlot}
        </div>
      </div>
    </Drawer>
  )
}
