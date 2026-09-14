"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import clsx from "clsx"
import { MegaNavItem } from "./navigation-model"
import { MegaMenu } from "./MegaMenu"
import { LinkComponent } from "../../types"

export interface NavLinkItem {
  label: string
  href: string
  isActive?: boolean
}

export interface DesktopNavProps {
  items?: MegaNavItem[]
  links?: NavLinkItem[]
  linkComponent?: LinkComponent
  activeMenuId?: string | null
  onMenuChange?: (id: string | null) => void
  backdropTop?: number
  isCompact?: boolean
}

export function DesktopNav({
  items,
  links,
  linkComponent: LinkComp = Link,
  activeMenuId: controlledActiveId,
  onMenuChange,
  backdropTop,
  isCompact = false,
}: DesktopNavProps) {
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null)
  const isControlled = controlledActiveId !== undefined
  const activeId = isControlled ? controlledActiveId : internalActiveId

  const setActiveId = useCallback(
    (id: string | null) => {
      if (!isControlled) {
        setInternalActiveId(id)
      }
      onMenuChange?.(id)
    },
    [isControlled, onMenuChange]
  )

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | HTMLButtonElement | null>>({})

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const handleTriggerMouseEnter = (id: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (activeId === id) return

    // If another menu is already open, switch immediately without delay
    if (activeId !== null) {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current)
        openTimerRef.current = null
      }
      setActiveId(id)
      return
    }

    // Snappy 120ms hover-intent delay (prevents accidental trigger on swift mouse sweeps)
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = setTimeout(() => {
      setActiveId(id)
      openTimerRef.current = null
    }, 120)
  }

  const handleTriggerMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }

    // 280ms close grace period for diagonal pointer movement into the panel
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setActiveId(null)
      closeTimerRef.current = null
    }, 280)
  }

  const handlePanelMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const handlePanelMouseLeave = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setActiveId(null)
      closeTimerRef.current = null
    }, 280)
  }

  const handleTriggerClick = (e: React.MouseEvent, item: MegaNavItem) => {
    // If it has mega content, toggle it on click
    if (item.featuredLinks?.length || item.categoryGroups?.length) {
      if (activeId === item.id) {
        setActiveId(null)
      } else {
        setActiveId(item.id)
      }
    }
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (activeId === id) {
        setActiveId(null)
      } else {
        setActiveId(id)
      }
    } else if (e.key === "Escape") {
      if (activeId === id) {
        e.preventDefault()
        setActiveId(null)
      }
    } else if (e.key === "ArrowDown") {
      if (activeId === id) {
        e.preventDefault()
        // Focus first link in active panel
        const panel = document.getElementById(`mega-menu-panel-${id}`)
        const firstLink = panel?.querySelector<HTMLAnchorElement>("a")
        firstLink?.focus()
      } else {
        e.preventDefault()
        setActiveId(id)
      }
    }
  }

  const handleClosePanel = (options?: { restoreFocus?: boolean }) => {
    const currentActive = activeId
    setActiveId(null)
    if (options?.restoreFocus && currentActive) {
      triggerRefs.current[currentActive]?.focus()
    }
  }

  // If items are provided, render full mega-navigation
  if (items && items.length > 0) {
    const activeItem = items.find((i) => i.id === activeId)

    return (
      <>
        <nav
          aria-label="Main category navigation"
          className={clsx(
            "hidden lg:flex items-center h-full font-heading font-semibold uppercase tracking-wider",
            isCompact
              ? "gap-x-2 xl:gap-x-4 2xl:gap-x-6 text-[11px] xl:text-xs"
              : "gap-x-6 xl:gap-x-8 text-xs"
          )}
        >
          {items.map((item) => {
            const isMenuOpen = activeId === item.id

            return (
              <div
                key={item.id}
                className="relative flex items-center h-full"
                onMouseEnter={() => handleTriggerMouseEnter(item.id)}
                onMouseLeave={handleTriggerMouseLeave}
              >
                <LinkComp
                  ref={(el: HTMLAnchorElement | null) => {
                    triggerRefs.current[item.id] = el
                  }}
                  href={item.href}
                  onClick={(e: React.MouseEvent) => handleTriggerClick(e, item)}
                  onKeyDown={(e: React.KeyboardEvent) => handleTriggerKeyDown(e, item.id)}
                  aria-expanded={isMenuOpen}
                  aria-controls={`mega-menu-panel-${item.id}`}
                  aria-haspopup="true"
                  className={clsx(
                    "h-full flex items-center px-1 whitespace-nowrap border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                    isMenuOpen
                      ? "text-brand-accent border-brand-accent"
                      : item.isActive
                        ? "text-brand-primary border-brand-primary"
                        : "text-brand-primary/90 border-transparent hover:text-brand-accent hover:border-brand-accent/50"
                  )}
                >
                  <span>{item.label}</span>
                </LinkComp>
              </div>
            )
          })}
        </nav>

        {/* Backdrop for open panel - starts below header to never overlap navbar links */}
        {activeId && (
          <div
            className="fixed inset-x-0 bottom-0 bg-black/40 backdrop-blur-2xs z-30 transition-opacity duration-200"
            style={{ top: backdropTop ? `${backdropTop}px` : "160px" }}
            onClick={() => handleClosePanel()}
            aria-hidden="true"
          />
        )}

        {/* Active Mega Panel */}
        {activeItem && (
          <MegaMenu
            item={activeItem}
            isOpen={Boolean(activeId)}
            onClose={handleClosePanel}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            linkComponent={LinkComp}
            isCompact={isCompact}
          />
        )}
      </>
    )
  }

  // Backward-compatible fallback if only flat `links` provided
  const navLinks = links || []
  return (
    <nav
      aria-label="Main category navigation"
      className={clsx(
        "hidden lg:flex items-center h-full uppercase tracking-wider text-brand-primary",
        isCompact ? "gap-x-3 xl:gap-x-5 text-[11px] xl:text-xs" : "gap-x-7 text-xs font-semibold"
      )}
    >
      {navLinks.map((link, idx) => (
        <LinkComp
          key={`${link.label}-${link.href}-${idx}`}
          href={link.href}
          className={clsx(
            "h-full flex items-center px-1 whitespace-nowrap transition-colors duration-150 border-b-2 hover:text-brand-accent hover:border-brand-accent",
            link.isActive
              ? "text-brand-accent border-brand-accent font-bold"
              : "text-brand-primary border-transparent"
          )}
        >
          {link.label}
        </LinkComp>
      ))}
    </nav>
  )
}
