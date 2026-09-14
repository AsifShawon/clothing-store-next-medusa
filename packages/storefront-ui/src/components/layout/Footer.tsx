"use client"

import React from "react"
import Link from "next/link"

import {
  FooterLinkItem,
  DEFAULT_CATEGORIES,
  DEFAULT_COLLECTIONS,
  DEFAULT_CUSTOMER_CARE,
  deduplicateFooterLinks,
} from "./footer-model"


export interface FooterProps {
  homeHref?: string
  categories?: FooterLinkItem[]
  collections?: FooterLinkItem[]
  customerCareLinks?: FooterLinkItem[]
  policyLinks?: FooterLinkItem[]
  customControlsSlot?: React.ReactNode
  linkComponent?: React.ComponentType<{ href: string; className?: string; children?: React.ReactNode; [key: string]: unknown }>
}

export function Footer({
  homeHref = "/",
  categories = DEFAULT_CATEGORIES,
  collections = DEFAULT_COLLECTIONS,
  customerCareLinks = DEFAULT_CUSTOMER_CARE,
  customControlsSlot,
  linkComponent: LinkComp = Link,
}: FooterProps) {
  const displayCollections = deduplicateFooterLinks(collections)
  const displayCategories = deduplicateFooterLinks(categories)
  const displayCustomerCareLinks = deduplicateFooterLinks(customerCareLinks)

  return (
    <footer className="bg-brand-primary text-brand-secondary border-t border-white/10 w-full mt-auto">
      {/* Upper Reassurance Strip */}
      <div className="border-b border-white/10 py-8 bg-black/30">
        <div className="editorial-container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              🚚 Express Dhaka Delivery
            </span>
            <p className="text-[11px] text-brand-sand/80 font-sans">Same-day dispatch • 24–48h courier nationwide</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              🛡️ 24h Doorstep Exchanges
            </span>
            <p className="text-[11px] text-brand-sand/80 font-sans">Hassle-free size replacement at your home</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              🧵 240 GSM Compact Cotton
            </span>
            <p className="text-[11px] text-brand-sand/80 font-sans">Pre-shrunk fibers &amp; pure French flax linen</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              💳 Cash on Delivery &amp; Cards
            </span>
            <p className="text-[11px] text-brand-sand/80 font-sans">bKash, Nagad, Visa, Mastercard, or COD</p>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="editorial-container py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand & Craftsmanship */}
          <div className="lg:col-span-5 space-y-4">
            <LinkComp href={homeHref} className="inline-block">
              <span className="font-display text-2xl tracking-[0.2em] text-white font-normal block">
                LONDON BOY
              </span>
              <span className="text-[10px] uppercase font-heading tracking-[0.3em] text-brand-sand font-semibold -mt-1 block">
                EST. LONDON • DHAKA
              </span>
            </LinkComp>
            <p className="text-xs text-brand-sand/80 leading-relaxed max-w-sm font-sans">
              Modern British menswear engineered with 240 GSM combed compact cotton and pure French flax linen.
              Tailored in specialized artisan ateliers in Dhaka for quiet confidence and lifelong durability.
            </p>
            <div className="space-y-1 text-xs text-brand-sand/70 pt-2 font-sans">
              <p>📍 Tejgaon Industrial Area, Dhaka, Bangladesh</p>
              <p>
                ✉️ Customer Concierge:{" "}
                <a href="mailto:concierge@londonboy.uk" className="text-white hover:underline">
                  concierge@londonboy.uk
                </a>
              </p>
            </div>

            {customControlsSlot && <div className="pt-2">{customControlsSlot}</div>}
          </div>

          {/* Column 2: Collections */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-widest uppercase text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-brand-sand/80 font-sans">
              {displayCollections.map((col) => (
                <li key={col.href}>
                  <LinkComp href={col.href} className="hover:text-white transition-colors">
                    {col.label}
                  </LinkComp>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Departments */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-widest uppercase text-white">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-brand-sand/80 font-sans">
              {displayCategories.map((cat) => (
                <li key={cat.href}>
                  <LinkComp href={cat.href} className="hover:text-white transition-colors">
                    {cat.label}
                  </LinkComp>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-widest uppercase text-white">
              Client Concierge &amp; Care
            </h4>
            <ul className="space-y-2 text-xs text-brand-sand/80 font-sans">
              {displayCustomerCareLinks.map((item) => (
                <li key={item.href}>
                  <LinkComp href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </LinkComp>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment Badges & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-sand/70 font-sans">
          <p>© {new Date().getFullYear()} London Boy (londonboy.uk). British Design, Dhaka Tailoring.</p>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-wider">
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">bKash</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">Visa</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
