"use client"

import React, { useState } from "react"
import Link from "next/link"

export interface AnnouncementBarProps {
  leftHighlights?: React.ReactNode
  centerText?: React.ReactNode
  centerHref?: string
  rightLinkText?: string
  rightLinkHref?: string
  showDismiss?: boolean
  onDismiss?: () => void
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

export function AnnouncementBar({
  leftHighlights,
  centerText = "Free Delivery in Dhaka on Orders Over ৳2,000",
  centerHref = "/store",
  rightLinkText = "24h Return Policy",
  rightLinkHref = "/return-policy",
  showDismiss = true,
  onDismiss,
  linkComponent: LinkComp = Link,
}: AnnouncementBarProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  const handleDismiss = () => {
    setIsOpen(false)
    if (onDismiss) onDismiss()
  }

  return (
    <aside
      aria-label="Store Announcement"
      className="bg-brand-primary text-brand-secondary border-b border-white/10 text-xs py-2 px-4 transition-all duration-300"
    >
      <div className="content-container flex items-center justify-between">
        {/* Left Highlights */}
        <div className="hidden md:flex items-center gap-x-6 text-[11px] font-medium tracking-wide">
          {leftHighlights || (
            <>
              <span>🇬🇧 British-Inspired Smart-Casual</span>
              <span className="text-brand-muted/40">•</span>
              <span>⚡ 24–48h Delivery Inside Dhaka</span>
            </>
          )}
        </div>

        {/* Center Promotion Link */}
        <div className="flex-1 text-center md:flex-initial">
          {centerHref ? (
            <LinkComp
              href={centerHref}
              className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 font-medium tracking-wider uppercase text-[11px]"
            >
              <span>{centerText}</span>
              <span className="underline decoration-brand-accent underline-offset-2">Shop Now</span>
            </LinkComp>
          ) : (
            <span className="font-medium tracking-wider uppercase text-[11px]">{centerText}</span>
          )}
        </div>

        {/* Right Action & Dismiss */}
        <div className="hidden md:flex items-center gap-x-4 text-[11px]">
          {rightLinkText && rightLinkHref && (
            <LinkComp
              href={rightLinkHref}
              className="text-brand-secondary/80 hover:text-white transition-colors"
            >
              {rightLinkText}
            </LinkComp>
          )}
          {showDismiss && (
            <button
              onClick={handleDismiss}
              className="text-brand-secondary/60 hover:text-white text-xs px-1"
              aria-label="Close announcement bar"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
