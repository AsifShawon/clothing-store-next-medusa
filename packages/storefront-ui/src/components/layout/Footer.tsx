import React from "react"
import Link from "next/link"

export interface FooterLinkItem {
  label: string
  href: string
}

export interface FooterProps {
  homeHref?: string
  categories?: FooterLinkItem[]
  collections?: FooterLinkItem[]
  customerCareLinks?: FooterLinkItem[]
  policyLinks?: FooterLinkItem[]
  customControlsSlot?: React.ReactNode
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

const DEFAULT_CATEGORIES: FooterLinkItem[] = [
  { label: "All Clothing", href: "/store" },
  { label: "Men's Collection", href: "/categories/men" },
  { label: "Women's Edit", href: "/categories/women" },
  { label: "Caps & Accessories", href: "/categories/accessories" },
]

const DEFAULT_COLLECTIONS: FooterLinkItem[] = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "The Essentials Edit", href: "/collections/essentials" },
]

const DEFAULT_CUSTOMER_CARE: FooterLinkItem[] = [
  { label: "Size & Fit Guide", href: "/size-guide" },
  { label: "Frequently Asked Questions (FAQ)", href: "/faq" },
  { label: "About London Boy", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Delivery Rates", href: "/shipping-policy" },
  { label: "24h Return Policy", href: "/return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
]

export function Footer({
  homeHref = "/",
  categories = DEFAULT_CATEGORIES,
  collections = DEFAULT_COLLECTIONS,
  customerCareLinks = DEFAULT_CUSTOMER_CARE,
  customControlsSlot,
  linkComponent: LinkComp = Link,
}: FooterProps) {
  return (
    <footer className="bg-brand-primary text-brand-secondary border-t border-white/10 w-full mt-auto">
      {/* Upper Trust Strip */}
      <div className="border-b border-white/10 py-6 bg-black/40">
        <div className="content-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">🚚</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              Fast Dhaka Delivery
            </h4>
            <p className="text-[11px] text-brand-muted/80">Inside Dhaka in 24–48h for ৳60</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">🛡️</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              24-Hour Returns
            </h4>
            <p className="text-[11px] text-brand-muted/80">Hassle-free size &amp; style exchange</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">🧵</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              240 GSM Dense Cotton
            </h4>
            <p className="text-[11px] text-brand-muted/80">Structured drape &amp; French linen</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2">
            <span className="text-lg">💳</span>
            <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-white">
              Cash on Delivery &amp; Card
            </h4>
            <p className="text-[11px] text-brand-muted/80">Pay upon delivery or secure checkout</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="content-container py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <LinkComp href={homeHref} className="inline-block">
              <span className="font-display text-2xl tracking-[0.2em] text-white font-bold">
                LONDON BOY
              </span>
            </LinkComp>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              Modern British-inspired, confident, minimal and premium-accessible smart-casual clothing.
              Engineered with 240 GSM combed compact cotton and French linen, tailored for modern living in Bangladesh.
            </p>
            <div className="space-y-1.5 text-xs text-brand-muted/90 pt-2">
              <p>📍 Tejgaon Industrial Area, Dhaka, Bangladesh</p>
              <p>
                ✉️ Support:{" "}
                <a href="mailto:londonboy@mack.com.bd" className="text-white hover:underline">
                  londonboy@mack.com.bd
                </a>
              </p>
            </div>

            {/* Optional Custom Slot (e.g. Demo Admin / Reset controls or Newsletter) */}
            {customControlsSlot && <div className="pt-4">{customControlsSlot}</div>}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <LinkComp href={cat.href} className="hover:text-white transition-colors">
                    {cat.label}
                  </LinkComp>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              {collections.map((col) => (
                <li key={col.href}>
                  <LinkComp href={col.href} className="hover:text-white transition-colors">
                    {col.label}
                  </LinkComp>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold tracking-widest uppercase text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              {customerCareLinks.map((item) => (
                <li key={item.href}>
                  <LinkComp href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </LinkComp>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} London Boy (londonboy.uk). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Currency: 🇧🇩 BDT (৳)</span>
            <span>•</span>
            <LinkComp href="/shipping-policy" className="hover:underline">
              Nationwide Delivery in BD
            </LinkComp>
          </div>
        </div>
      </div>
    </footer>
  )
}
