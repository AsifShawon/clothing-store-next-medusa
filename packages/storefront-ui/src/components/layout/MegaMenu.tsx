"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
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
  isCompact?: boolean
}

export function MegaMenu({
  item,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  linkComponent: LinkComp = Link,
  isCompact = false,
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
      className={clsx(
        "absolute left-0 right-0 z-40 bg-white shadow-mega animate-mega-enter before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']",
        isCompact
          ? "top-[calc(100%+8px)] rounded-2xl border border-brand-border/80 shadow-2xl overflow-hidden"
          : "top-full border-b border-brand-border/80"
      )}
    >
      <div className="content-container py-8 lg:py-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Featured Links */}
          <div className="col-span-3 space-y-4 border-r border-brand-border/60 pr-6">
            <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted block">
              Featured
            </span>
            <ul className="space-y-2">
              {item.featuredLinks.map((link, idx) => (
                <li key={`${item.id}-feat-${idx}-${link.label}`}>
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
                  {group.links.map((link, idx) => (
                    <li key={`${item.id}-${group.title}-${idx}-${link.label}`}>
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
            {item.editorialCards.slice(0, 1).map((card, idx) => (
              <div
                key={`${item.id}-card-${idx}-${card.title}`}
                className="group relative overflow-hidden rounded-2xl border border-brand-border/70 aspect-[4/3] bg-brand-surface shadow-subtle hover:shadow-editorial transition-all duration-300 flex flex-col justify-end p-6"
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt || card.title}
                  fill
                  sizes="400px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2 text-white">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-brand-sand">
                    Curated Spotlight
                  </span>
                  <h4 className="font-display text-lg text-white font-normal leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-xs text-brand-sand/90 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                  <div className="pt-1">
                    <LinkComp
                      href={card.href}
                      onClick={() => onClose()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-brand-primary text-xs font-heading font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors"
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRightIcon className="w-3 h-3" />
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
