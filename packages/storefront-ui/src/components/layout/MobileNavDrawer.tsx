"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Drawer } from "../ui/drawer"
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, ChevronDownIcon } from "../icons"
import { MegaNavItem } from "./navigation-model"
import { LinkComponent } from "../../types"

export interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  items?: MegaNavItem[]
  links?: Array<{ label: string; href: string }>
  onOpenSearch?: () => void
  cartCount?: number
  cartHref?: string
  accountHref?: string
  bottomSlot?: React.ReactNode
  linkComponent?: LinkComponent
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  items,
  links,
  onOpenSearch,
  cartCount = 0,
  cartHref = "/cart",
  accountHref = "/account",
  bottomSlot,
  linkComponent: LinkComp = Link,
}: MobileNavDrawerProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      title="London Boy Navigation"
      maxWidth="sm"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Quick Search Bar */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenSearch()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-brand-surface border border-brand-border text-xs font-heading font-medium text-brand-primary/70 hover:text-brand-primary hover:bg-brand-secondary/50 transition-colors text-left min-h-[44px]"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-brand-primary/60 flex-shrink-0" />
              <span>Search garments, colors, fabrics...</span>
            </button>
          )}

          {/* Navigation Items (Accordions or Flat Links) */}
          {items && items.length > 0 ? (
            <nav className="divide-y divide-brand-border/60 border-y border-brand-border/60">
              {items.map((item) => {
                const isExpanded = Boolean(expandedGroups[item.id])
                const hasChildren = (item.categoryGroups && item.categoryGroups.length > 0) || (item.featuredLinks && item.featuredLinks.length > 0)

                return (
                  <div key={item.id} className="py-1">
                    {hasChildren ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`mobile-group-${item.id}`}
                          className="w-full flex items-center justify-between py-3 px-2 text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors min-h-[44px]"
                        >
                          <span>{item.label}</span>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-brand-primary" : ""
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div
                            id={`mobile-group-${item.id}`}
                            className="pl-4 pr-2 pb-3 pt-1 space-y-3 animate-mega-enter"
                          >
                            <LinkComp
                              href={item.shopAllHref}
                              onClick={onClose}
                              className="block py-2 text-xs font-heading font-bold text-brand-accent uppercase tracking-wider min-h-[44px] flex items-center"
                            >
                              {item.shopAllLabel || `Shop All ${item.label} →`}
                            </LinkComp>

                            {/* Subcategory links */}
                            {item.categoryGroups.map((group) => (
                              <div key={group.title} className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-brand-muted block">
                                  {group.title}
                                </span>
                                <ul className="space-y-1">
                                  {group.links.map((sublink, sIdx) => (
                                    <li key={`mob-${item.id}-${group.title}-${sIdx}-${sublink.label}`}>
                                      <LinkComp
                                        href={sublink.href}
                                        onClick={onClose}
                                        className="block py-2 text-xs font-medium text-brand-primary/80 hover:text-brand-primary min-h-[44px] flex items-center"
                                      >
                                        {sublink.label}
                                      </LinkComp>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}

                            {/* Optional Featured Card Thumbnail */}
                            {item.editorialCards.length > 0 && (
                              <div className="pt-2">
                                <LinkComp
                                  href={item.editorialCards[0].href}
                                  onClick={onClose}
                                  className="group relative overflow-hidden rounded-lg border border-brand-border aspect-[21/9] flex items-end p-3 text-white block"
                                >
                                  <Image
                                    src={item.editorialCards[0].image}
                                    alt={item.editorialCards[0].title}
                                    fill
                                    sizes="300px"
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                  <div className="relative z-10">
                                    <span className="text-[11px] font-heading font-bold tracking-tight block">
                                      {item.editorialCards[0].title}
                                    </span>
                                    <span className="text-[10px] text-brand-sand underline">
                                      {item.editorialCards[0].ctaText} →
                                    </span>
                                  </div>
                                </LinkComp>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <LinkComp
                        href={item.href}
                        onClick={onClose}
                        className="block py-3 px-2 text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors min-h-[44px] flex items-center"
                      >
                        {item.label}
                      </LinkComp>
                    )}
                  </div>
                )
              })}
            </nav>
          ) : (
            <nav className="divide-y divide-brand-border/60 border-y border-brand-border/60">
              {(links || []).map((link) => (
                <LinkComp
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block py-3.5 px-2 text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </LinkComp>
              ))}
            </nav>
          )}

          {/* Secondary Editorial Links */}
          <div className="pt-4 space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-brand-muted px-2 block">
              About &amp; Care
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <LinkComp
                href="/about"
                onClick={onClose}
                className="py-2.5 px-2 text-brand-primary/80 hover:text-brand-primary min-h-[44px] flex items-center"
              >
                Our Story
              </LinkComp>
              <LinkComp
                href="/size-guide"
                onClick={onClose}
                className="py-2.5 px-2 text-brand-primary/80 hover:text-brand-primary min-h-[44px] flex items-center"
              >
                Size Guide
              </LinkComp>
              <LinkComp
                href="/contact"
                onClick={onClose}
                className="py-2.5 px-2 text-brand-primary/80 hover:text-brand-primary min-h-[44px] flex items-center"
              >
                Customer Care
              </LinkComp>
              <LinkComp
                href="/faq"
                onClick={onClose}
                className="py-2.5 px-2 text-brand-primary/80 hover:text-brand-primary min-h-[44px] flex items-center"
              >
                FAQ
              </LinkComp>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-4 border-t border-brand-border space-y-3 bg-white mt-auto">
          <div className="grid grid-cols-2 gap-3">
            <LinkComp
              href={accountHref}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3 bg-brand-surface border border-brand-border text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary transition-colors min-h-[44px]"
            >
              <UserIcon className="w-4 h-4 text-brand-accent" />
              <span>Account</span>
            </LinkComp>

            <LinkComp
              href={cartHref}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3 bg-brand-surface border border-brand-border text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary transition-colors min-h-[44px]"
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
