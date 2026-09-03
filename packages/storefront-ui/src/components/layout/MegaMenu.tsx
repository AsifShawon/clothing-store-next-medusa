"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { MegaNavItem } from "./navigation-model"
import { LinkComponent } from "../../types"
import { ArrowRightIcon } from "../icons"

export interface MegaMenuProps {
  item: MegaNavItem
  isOpen: boolean
  onClose: (options?: { restoreFocus?: boolean }) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  linkComponent?: LinkComponent
}

export function MegaMenu({
  item,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  linkComponent: LinkComp = Link,
}: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose({ restoreFocus: true })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      id={`mega-menu-panel-${item.id}`}
      role="region"
      aria-label={`${item.label} navigation menu`}
      ref={panelRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-40 bg-white border-b border-brand-border/80 shadow-mega animate-mega-enter"
    >
      <div className="content-container py-8 lg:py-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Featured Links */}
          <div className="col-span-3 space-y-4 border-r border-brand-border/60 pr-6">
            <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted block">
              Featured
            </span>
            <ul className="space-y-2">
              {item.featuredLinks.map((link) => (
                <li key={link.href}>
                  <LinkComp
                    href={link.href}
                    onClick={() => onClose()}
                    className="group inline-flex items-center gap-2 py-1.5 text-xs font-heading font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                        {link.badge}
                      </span>
                    )}
                  </LinkComp>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-brand-border/40">
              <LinkComp
                href={item.shopAllHref}
                onClick={() => onClose()}
                className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-accent hover:underline uppercase tracking-wider group"
              >
                <span>{item.shopAllLabel || `Shop All ${item.label}`}</span>
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </LinkComp>
            </div>
          </div>

          {/* Column 2 & 3: Category Groups */}
          <div className="col-span-5 grid grid-cols-2 gap-8">
            {item.categoryGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted block">
                  {group.title}
                </span>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <LinkComp
                        href={link.href}
                        onClick={() => onClose()}
                        className="block py-1 text-xs font-medium text-brand-primary/80 hover:text-brand-primary hover:translate-x-0.5 transition-all duration-150"
                      >
                        {link.label}
                      </LinkComp>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Column 4: Editorial Showcase Card */}
          <div className="col-span-4">
            {item.editorialCards.slice(0, 1).map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl border border-brand-border/70 bg-brand-secondary aspect-[16/10] flex flex-col justify-end p-5 text-white shadow-subtle"
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt || card.title}
                  fill
                  sizes="400px"
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-1.5">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-brand-sand">
                    Featured Editorial
                  </span>
                  <h4 className="font-heading font-bold text-sm tracking-tight text-white">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                  <div className="pt-2">
                    <LinkComp
                      href={card.href}
                      onClick={() => onClose()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-brand-primary hover:bg-brand-secondary text-[11px] font-heading font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRightIcon className="w-3 h-3 text-brand-primary" />
                    </LinkComp>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
