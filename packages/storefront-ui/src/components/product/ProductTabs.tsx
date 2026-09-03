"use client"

import React, { useState } from "react"
import { ChevronDownIcon } from "../icons"

export interface ProductTabsProps {
  description?: string
  material?: string
  metadata?: Record<string, string | number | boolean | null>
}

export function ProductTabs({
  description,
  material,
  metadata,
}: ProductTabsProps) {
  const [openTab, setOpenTab] = useState<number | null>(0)

  const tabs = [
    {
      title: "Description & Silhouette",
      content: (
        <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
          <p>{description || "Designed with architectural minimalism and high-density British tailoring precision."}</p>
          {metadata?.fit && <p><strong>Fit:</strong> {String(metadata.fit)}</p>}
        </div>
      ),
    },
    {
      title: "Fabric Engineering & Care",
      content: (
        <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
          <p>
            <strong>Composition:</strong> {material || "240 GSM Combed Compact Cotton, French Flax Linen"}
          </p>
          <p>
            <strong>Care Instructions:</strong> Machine wash cold (30°C) with similar darks. Turn garment inside out. Do not tumble dry. Warm iron on reverse.
          </p>
          {metadata?.origin && <p><strong>Manufacturing Origin:</strong> {String(metadata.origin)}</p>}
        </div>
      ),
    },
    {
      title: "Dhaka Delivery & 24h Size Swap",
      content: (
        <div className="space-y-3 text-xs text-brand-muted leading-relaxed">
          <p>
            <strong>Inside Dhaka:</strong> Delivered in 24–48 hours for ৳60. Free delivery on orders over ৳2,000.
          </p>
          <p>
            <strong>Outside Dhaka:</strong> 3–5 working days nationwide courier for ৳120.
          </p>
          <p>
            <strong>Size Exchange Guarantee:</strong> Door-to-door size exchange within 24 hours of delivery inside Dhaka.
          </p>
        </div>
      ),
    },
  ]

  const toggleTab = (idx: number) => {
    setOpenTab(openTab === idx ? null : idx)
  }

  return (
    <div className="border-t border-brand-border divide-y divide-brand-border">
      {tabs.map((tab, idx) => {
        const isOpen = openTab === idx
        return (
          <div key={tab.title} className="py-3">
            <button
              type="button"
              onClick={() => toggleTab(idx)}
              className="w-full flex items-center justify-between py-2 text-left text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors"
              aria-expanded={isOpen}
            >
              <span>{tab.title}</span>
              <ChevronDownIcon
                className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && <div className="pt-2 pb-3 animate-enter">{tab.content}</div>}
          </div>
        )
      })}
    </div>
  )
}
