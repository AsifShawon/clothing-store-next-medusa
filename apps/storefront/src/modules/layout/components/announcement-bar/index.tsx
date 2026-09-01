"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function AnnouncementBar() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="bg-brand-primary text-brand-secondary border-b border-white/10 text-xs py-2 px-4 transition-all duration-300">
      <div className="content-container flex items-center justify-between">
        <div className="hidden md:flex items-center gap-x-6 text-[11px] font-medium tracking-wide">
          <span>🇬🇧 British-Inspired Smart-Casual</span>
          <span className="text-brand-muted/40">•</span>
          <span>⚡ 24–48h Delivery Inside Dhaka</span>
        </div>

        <div className="flex-1 text-center md:flex-initial">
          <LocalizedClientLink
            href="/store"
            className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 font-medium tracking-wider uppercase text-[11px]"
          >
            <span>Free Delivery in Dhaka on Orders Over ৳2,000</span>
            <span className="underline decoration-brand-accent underline-offset-2">Shop Now</span>
          </LocalizedClientLink>
        </div>

        <div className="hidden md:flex items-center gap-x-4 text-[11px]">
          <LocalizedClientLink
            href="/return-policy"
            className="text-brand-secondary/80 hover:text-white transition-colors"
          >
            24h Return Policy
          </LocalizedClientLink>
          <button
            onClick={() => setIsOpen(false)}
            className="text-brand-secondary/60 hover:text-white text-xs px-1"
            aria-label="Close announcement bar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
